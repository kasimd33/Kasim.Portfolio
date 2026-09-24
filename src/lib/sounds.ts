export type SoundEffect = 'click' | 'navigate' | 'open' | 'close' | 'step' | 'notice' | 'confirm';
const preferenceKey = 'kasim-sound-enabled';
let context: AudioContext | undefined;
let master: GainNode | undefined;
let lastPlayed = -Infinity;
let enabled = true;
try { enabled = localStorage.getItem(preferenceKey) !== 'false'; } catch { /* Storage is optional. */ }
const voices = new Set<AudioScheduledSourceNode>();
export const isSoundEnabled = () => enabled;
export const supportsSound = () => typeof window.AudioContext === 'function';

function stopVoices() {
  for (const voice of voices) { try { voice.stop(); } catch { /* Already finished. */ } voice.disconnect(); }
  voices.clear();
}
export function setSoundEnabled(value: boolean) {
  enabled = value;
  if (!value) stopVoices();
  try { localStorage.setItem(preferenceKey, String(value)); } catch { /* Keep the in-memory preference. */ }
}
export function silenceSounds() { stopVoices(); }

function track(source: AudioScheduledSourceNode, gain: GainNode) {
  voices.add(source);
  source.onended = () => { source.disconnect(); gain.disconnect(); voices.delete(source); };
}
function tone(frequency: number, endFrequency: number, offset: number, duration: number, volume = 0.18) {
  if (!context || !master) return;
  const start = context.currentTime + offset;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain); gain.connect(master); track(oscillator, gain);
  oscillator.start(start); oscillator.stop(start + duration + 0.01);
}
function click() {
  if (!context || !master) return;
  const length = Math.ceil(context.sampleRate * 0.022);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const samples = buffer.getChannelData(0);
  // A short damped impulse gives the click a tactile, mechanical sound.
  for (let i = 0; i < length; i++) samples[i] = (Math.random() * 2 - 1) * Math.exp(-i / (length * 0.13));
  const source = context.createBufferSource();
  const gain = context.createGain();
  source.buffer = buffer; gain.gain.value = 0.28;
  source.connect(gain); gain.connect(master); track(source, gain);
  source.start(); source.stop(context.currentTime + 0.025);
  tone(240, 100, 0, 0.035, 0.22);
}
export function playSound(effect: SoundEffect = 'click') {
  if (!enabled || document.hidden || !supportsSound()) return;
  const requested = performance.now();
  if (requested - lastPlayed < 45) return;
  lastPlayed = requested;
  try {
    if (!context) {
      context = new AudioContext(); master = context.createGain();
      master.gain.value = 0.2; master.connect(context.destination);
    }
    const play = () => {
      if (!enabled || document.hidden || performance.now() - requested > 1000 || context?.state !== 'running') return;
      switch (effect) {
        case 'click': click(); break;
        case 'navigate': tone(330, 660, 0, 0.12); tone(880, 660, 0.045, 0.11, 0.09); break;
        case 'open': tone(440, 440, 0, 0.16); tone(660, 660, 0.055, 0.19, 0.13); break;
        case 'close': tone(520, 260, 0, 0.13, 0.16); break;
        case 'step': tone(620, 400, 0, 0.055, 0.17); break;
        case 'notice': tone(220, 180, 0, 0.15, 0.14); break;
        case 'confirm': tone(520, 520, 0, 0.13); tone(780, 780, 0.06, 0.18, 0.13); break;
      }
    };
    if (context.state === 'running') play();
    else void context.resume().then(play).catch(() => {});
  } catch { /* Audio must never block navigation or other controls. */ }
}
