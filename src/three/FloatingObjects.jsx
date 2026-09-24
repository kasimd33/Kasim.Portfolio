import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { MathUtils } from 'three';

export default function FloatingObjects({ compact }) {
  const sculpture = useRef(null);
  useFrame(({ clock, pointer }, delta) => {
    if (!sculpture.current) return;
    const t = clock.getElapsedTime();
    sculpture.current.rotation.y = MathUtils.damp(sculpture.current.rotation.y, t * 0.065 + pointer.x * 0.18, 3, delta);
    sculpture.current.rotation.x = MathUtils.damp(sculpture.current.rotation.x, 0.45 + pointer.y * 0.12 + Math.min(window.scrollY / 1800, 0.6), 3, delta);
  });
  return <>
    <Float speed={1.3} rotationIntensity={0.08} floatIntensity={0.25}>
      <mesh ref={sculpture} rotation={[0.45, 0.3, -0.5]}>
        <torusKnotGeometry args={[1.22, 0.38, compact ? 100 : 160, compact ? 14 : 24, 2, 3]} />
        <meshStandardMaterial color="#babbbc" metalness={0.82} roughness={0.26} />
      </mesh>
    </Float>
    <mesh position={[1.95, 1.4, -0.8]} rotation={[0.4, 0.4, 0.3]}><icosahedronGeometry args={[0.2, 0]} /><meshStandardMaterial color="#d3a87c" metalness={0.4} roughness={0.5} wireframe /></mesh>
    <mesh position={[-1.8, -1.4, -0.3]} rotation={[0.4, 0.4, 0.3]}><octahedronGeometry args={[0.12]} /><meshStandardMaterial color="#999999" wireframe /></mesh>
  </>;
}
