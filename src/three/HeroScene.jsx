import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import FloatingObjects from './FloatingObjects';
import SceneLoader from './SceneLoader';
import { useMediaQuery } from '../hooks/useMediaQuery';

export default function HeroScene({ active }) {
  const compact = useMediaQuery('(max-width: 1100px)');
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [lost, setLost] = useState(false);
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  if (lost) return <SceneLoader />;
  return <Canvas camera={{ position: [0, 0, 6.5], fov: 39 }} dpr={compact ? 1 : [1, 1.5]} frameloop={active && pageVisible ? 'always' : 'never'} gl={{ antialias: !compact, alpha: true, powerPreference: 'low-power' }} fallback={<SceneLoader />} onCreated={({ gl }) => { gl.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); setLost(true); }, { once: true }); }}>
    <ambientLight intensity={0.5} />
    <directionalLight position={[3, 4, 5]} intensity={3} />
    <Environment resolution={128} frames={1}>
      <Lightformer intensity={4} position={[0, 4, -3]} scale={[7, 2, 1]} />
      <Lightformer intensity={3} position={[-5, 0, 2]} rotation={[0, Math.PI / 2, 0]} scale={[6, 3, 1]} />
      <Lightformer intensity={2} position={[5, 1, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[4, 5, 1]} />
    </Environment>
    <FloatingObjects compact={compact} />
  </Canvas>;
}
