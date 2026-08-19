'use client';

import { Float, MeshDistortMaterial } from '@react-three/drei';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import type { Group, Mesh } from 'three';
import { MathUtils } from 'three';

interface SculptureProps {
  scroll: number;
  reducedMotion?: boolean;
}

function Sculpture({ scroll, reducedMotion }: SculptureProps) {
  const groupRef = useRef<Group>(null);
  const core = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current || !core.current) return;

    const pointerX = reducedMotion ? 0 : state.pointer.x * 0.28;
    const pointerY = reducedMotion ? 0 : state.pointer.y * 0.18;
    const speed = Math.min(delta * 3.2, 1);

    groupRef.current.rotation.y = MathUtils.lerp(
      groupRef.current.rotation.y,
      pointerX + scroll * 1.25,
      speed
    );
    groupRef.current.rotation.x = MathUtils.lerp(
      groupRef.current.rotation.x,
      pointerY - scroll * 0.42,
      speed
    );
    groupRef.current.rotation.y = MathUtils.lerp(
      groupRef.current.rotation.y,
      -pointerY * 0.75,
      speed
    );

    if (!reducedMotion) {
      core.current.rotation.z += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.15, -0.35, -0.1]}>
      <Float
        speed={reducedMotion ? 0 : 1.15}
        rotationIntensity={reducedMotion ? 0 : 0.18}
        floatIntensity={reducedMotion ? 0 : 0.35}
      >
        <mesh ref={core} scale={1.75}>
          <icosahedronGeometry args={[1, 18]} />
          <MeshDistortMaterial
            color="#2864ff"
            roughness={0.16}
            metalness={0.92}
            distort={reducedMotion ? 0.18 : 0.38}
            speed={reducedMotion ? 0 : 1.45}
          />
        </mesh>
        <mesh scale={2.02} rotation={[0.35, 0.2, 0.55]}>
          <torusGeometry args={[1, 0.012, 12, 180]} />
          <meshBasicMaterial color="#f2f2ed" transparent opacity={0.52} />
        </mesh>
        <mesh scale={2.25} rotation={[-0.65, 0.4, -0.25]}>
          <torusGeometry args={[1, 0.006, 8, 180]} />
          <meshBasicMaterial color="#2864ff" transparent opacity={0.78} />
        </mesh>
      </Float>
    </group>
  );
}

function canCreateWebGLContext() {
  try {
    const canvas = document.createElement('canvas');
    const context =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) ??
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true });

    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

let cachedWebGLSupport: boolean | null = null;

function getWebGLSnapshot() {
  if (cachedWebGLSupport === null && typeof window !== 'undefined') {
    cachedWebGLSupport = canCreateWebGLContext();
  }
  return cachedWebGLSupport ?? false;
}

const emptySubscribe = () => () => {};

function subscribeReducedMotion(callback: () => void) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

export default function SculptureThree({ scroll }: { scroll: number }) {
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const webGLAvailable = useSyncExternalStore(emptySubscribe, getWebGLSnapshot, () => false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '120px',
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-sculpture" aria-hidden="true">
      <div className="hero-sculpture-fallback" />
      {webGLAvailable ? (
        <Canvas
          frameloop={visible ? 'always' : 'never'}
          dpr={[1, 1.15]}
          camera={{ position: [0, 0, 6.2], fov: 42 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.55} />
          <directionalLight position={[4, 5, 5]} intensity={4.2} color="#f2f2ed" />
          <pointLight position={[-4, -2, 3]} intensity={12} color="#2864ff" />
          <Sculpture scroll={scroll} reducedMotion={reducedMotion} />
        </Canvas>
      ) : null}
    </div>
  );
}
