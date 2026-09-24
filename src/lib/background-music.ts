export const MUSIC_VOLUME = 0.12;
export const MUSIC_FADE_SECONDS = 0.3;
type MusicStatus = 'off' | 'starting' | 'playing' | 'blocked' | 'unavailable';
const listeners = new Set<() => void>();
let status: MusicStatus = 'off';
// Each new document requests playback; pause applies only to the current visit.
let wanted = true;
let player: HTMLAudioElement | null = null;
let context: AudioContext | null = null;
let volume: GainNode | null = null;
let loopEnvelope: GainNode | null = null;
let stopTimer: ReturnType<typeof setTimeout> | undefined;
let frame: number | undefined;
let intent = 0;
let previousTime = 0;
let fadingAtEnd = false;

export const getMusicStatus = () => status;
export function subscribeMusic(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
function publish(next: MusicStatus) { if (status !== next) { status = next; listeners.forEach(listener => listener()); } }
function ramp(node: GainNode | null, value: number, seconds = MUSIC_FADE_SECONDS) {
  if (!context || !node) return;
  const now = context.currentTime;
  // Firefox and older Safari versions do not support cancelAndHoldAtTime.
  if (typeof node.gain.cancelAndHoldAtTime === 'function') node.gain.cancelAndHoldAtTime(now);
  else {
    const current = node.gain.value;
    node.gain.cancelScheduledValues(now);
    node.gain.setValueAtTime(current, now);
  }
  node.gain.linearRampToValueAtTime(value, now + seconds);
}
function watchLoop() {
  if (!player || !context || player.paused) return;
  const time = player.currentTime;
  if (time < previousTime) {
    fadingAtEnd = false;
    loopEnvelope?.gain.cancelScheduledValues(context.currentTime);
    loopEnvelope?.gain.setValueAtTime(0, context.currentTime);
    ramp(loopEnvelope, 1);
  }
  const remaining = player.duration - time;
  if (!fadingAtEnd && remaining > 0 && remaining <= MUSIC_FADE_SECONDS) {
    fadingAtEnd = true;
    ramp(loopEnvelope, 0, remaining);
  }
  previousTime = time;
  frame = requestAnimationFrame(watchLoop);
}
function confirmPlayback() {
  if (!wanted || document.hidden || !player || player.paused || player.readyState < 2 || context?.state !== 'running' || status === 'playing') return;
  ramp(volume, MUSIC_VOLUME);
  ramp(loopEnvelope, 1);
  publish('playing');
  if (frame !== undefined) cancelAnimationFrame(frame);
  previousTime = player.currentTime;
  fadingAtEnd = false;
  watchLoop();
}
async function start() {
  if (!wanted || document.hidden || !player || !context) return;
  const request = ++intent;
  clearTimeout(stopTimer);
  if (!player.paused && context.state === 'running' && status === 'playing') return;
  publish('starting');
  try {
    // resume() can stay pending while autoplay is blocked. Do not let that
    // promise hold the player in a false "playing" state or prevent a retry.
    void context.resume().then(confirmPlayback).catch(() => {
      if (request === intent && wanted) publish('blocked');
    });
    const playback = player.play();
    if (context.state !== 'running') publish('blocked');
    await playback;
    if (request !== intent || !wanted || document.hidden) return;
    confirmPlayback();
    if (context.state !== 'running') publish('blocked');
  } catch (error) {
    if (request !== intent) return;
    publish(error instanceof DOMException && error.name === 'NotSupportedError' ? 'unavailable' : 'blocked');
  }
}
function pause() {
  ++intent;
  clearTimeout(stopTimer);
  if (frame !== undefined) cancelAnimationFrame(frame);
  ramp(volume, 0);
  publish('off');
  stopTimer = setTimeout(() => { player?.pause(); }, MUSIC_FADE_SECONDS * 1000);
}
export function toggleMusic() {
  if (status === 'playing') { wanted = false; pause(); }
  else { wanted = true; void start(); }
}
export function initializeMusic() {
  if (typeof AudioContext !== 'function') { publish('unavailable'); return () => {}; }
  try {
    player = new Audio('/audio/acceptance-relaxdaily.mp3');
    player.loop = true;
    player.autoplay = true;
    player.preload = 'auto';
    player.setAttribute('playsinline', '');
    context = new AudioContext();
    volume = context.createGain();
    loopEnvelope = context.createGain();
    volume.gain.value = 0;
    loopEnvelope.gain.value = 1;
    context.createMediaElementSource(player).connect(loopEnvelope).connect(volume).connect(context.destination);
  } catch { publish('unavailable'); return () => { player?.pause(); void context?.close(); }; }
  const failed = () => { pause(); publish('unavailable'); };
  const gesture = (event: Event) => {
    if (!event.isTrusted || (event.target instanceof Element && event.target.closest('[data-music-control]'))) return;
    if (event instanceof KeyboardEvent && (event.repeat || event.ctrlKey || event.altKey || event.metaKey)) return;
    if (wanted && status !== 'playing' && status !== 'unavailable') void start();
  };
  const contextChanged = () => {
    if (context?.state === 'running') confirmPlayback();
    else if (wanted && !document.hidden && status === 'playing') publish('blocked');
  };
  const visibility = () => { if (document.hidden) pause(); else if (wanted) void start(); };
  const pageHide = () => { pause(); player?.pause(); };
  player.addEventListener('error', failed);
  player.addEventListener('playing', confirmPlayback);
  context.addEventListener('statechange', contextChanged);
  // Capture clicks/taps even when a project dialog stops event propagation.
  const gestures = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'];
  for (const event of gestures) document.addEventListener(event, gesture, { capture: true, passive: true });
  document.addEventListener('visibilitychange', visibility);
  window.addEventListener('pagehide', pageHide);
  window.addEventListener('pageshow', visibility);
  if (wanted) void start();
  return () => {
    ++intent;
    clearTimeout(stopTimer);
    if (frame !== undefined) cancelAnimationFrame(frame);
    for (const event of gestures) document.removeEventListener(event, gesture, true);
    document.removeEventListener('visibilitychange', visibility);
    window.removeEventListener('pagehide', pageHide);
    window.removeEventListener('pageshow', visibility);
    player?.removeEventListener('error', failed);
    player?.removeEventListener('playing', confirmPlayback);
    context?.removeEventListener('statechange', contextChanged);
    player?.pause();
    player?.removeAttribute('src');
    player?.load();
    void context?.close().catch(() => {});
    player = null; context = null; volume = null; loopEnvelope = null;
    publish('off');
  };
}
