import { useSyncExternalStore } from 'react';
import { Music2, Pause, Play } from 'lucide-react';
import { getMusicStatus, subscribeMusic, toggleMusic } from '@/lib/background-music';
export default function MusicControl() {
  const status = useSyncExternalStore(subscribeMusic, getMusicStatus);
  const playing = status === 'playing';
  return <button type="button" className="sound-toggle music-toggle" data-sound="silent" data-music-control
    aria-label="Background music" aria-pressed={playing} disabled={status === 'unavailable'}
    title={status === 'unavailable' ? 'Music is unavailable' : playing ? 'Pause background music' : 'Play background music'}
    onClick={toggleMusic}>
    <Music2 size={16} aria-hidden="true" /><span>{playing ? 'Music on' : 'Play music'}</span>
    {playing ? <Pause className="music-state" size={12} aria-hidden="true" /> : <Play className="music-state" size={12} aria-hidden="true" />}
  </button>;
}
