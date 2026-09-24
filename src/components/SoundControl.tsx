import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { isSoundEnabled, playSound, setSoundEnabled, silenceSounds, supportsSound } from '@/lib/sounds';
import type { SoundEffect } from '@/lib/sounds';
import '@/styles/sound-control.css';

export default function SoundControl() {
  const [enabled, setEnabled] = useState(isSoundEnabled);
  const supported = supportsSound();
  useEffect(() => {
    const click = (event: MouseEvent) => {
      if (!event.isTrusted || !(event.target instanceof Element)) return;
      const target = event.target;
      if (target.closest('[disabled], [aria-disabled="true"], [inert], [data-sound="silent"], input, textarea, select, label')) return;
      // Dialog backdrops and carousel actions provide feedback in their own handlers.
      if (target.matches('dialog')) return;
      const effect = target.closest('[data-sound]')?.getAttribute('data-sound') as SoundEffect | null;
      playSound(effect ?? (target.closest('a[href]') ? 'navigate' : 'click'));
    };
    const hide = () => { if (document.hidden) silenceSounds(); };
    const sync = (event: StorageEvent) => {
      if (event.key === 'kasim-sound-enabled' || event.key === null) {
        const next = event.newValue !== 'false'; setSoundEnabled(next); setEnabled(next);
      }
    };
    document.addEventListener('click', click, true);
    document.addEventListener('visibilitychange', hide);
    window.addEventListener('storage', sync);
    return () => {
      document.removeEventListener('click', click, true);
      document.removeEventListener('visibilitychange', hide);
      window.removeEventListener('storage', sync);
      silenceSounds();
    };
  }, []);
  return <button type="button" className="sound-toggle" data-sound="silent" disabled={!supported}
    aria-label="Sound effects" aria-pressed={enabled && supported}
    title={!supported ? 'Sound effects unavailable in this browser' : enabled ? 'Mute sound effects' : 'Enable sound effects'}
    onClick={() => { const next = !enabled; setSoundEnabled(next); setEnabled(next); if (next) playSound('confirm'); }}>
    {enabled && supported ? <Volume2 size={17} aria-hidden="true" /> : <VolumeX size={17} aria-hidden="true" />}
    <span>Sound {enabled && supported ? 'on' : 'off'}</span>
  </button>;
}
