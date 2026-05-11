"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODE_POSITIONS = [
  [2.2, 0.3, 0],
  [-1.8, 1.0, 1.2],
  [1.0, -0.8, 1.6],
  [-2.2, -0.3, 0.6],
  [0.6, 1.6, -1.2],
  [-0.8, -1.3, -1.4],
];

const NODE_COLORS = [
  "#10b981", "#34d399", "#6ee7b7", "#a1a1aa", "#fafafa", "#d4d4d8",
];

function MorphingCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame(({ clock }) => {
    timeRef.current = clock.getElapsedTime();
    const t = timeRef.current;

    if (meshRef.current) {
      // Morph between icosahedron and sphere
      const morph = Math.sin(t * 0.3) * 0.5 + 0.5;
      const geo = meshRef.current.geometry as THREE.IcosahedronGeometry;
      const pos = geo.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        const len = Math.sqrt(x * x + y * y + z * z);
        const target = 0.55 + morph * 0.1;
        const current = len;
        const newLen = current + (target - current) * 0.02;
        pos.setXYZ(i, (x / current) * newLen, (y / current) * newLen, (z / current) * newLen);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();

      meshRef.current.rotation.y = t * 0.12;
      meshRef.current.rotation.x = Math.sin(t * 0.15) * 0.1;
    }

    if (wireRef.current) {
      wireRef.current.rotation.y = -t * 0.08;
      wireRef.current.rotation.z = t * 0.05;
    }

    if (glowRef.current) {
      const pulse = 0.7 + Math.sin(t * 1.5) * 0.15;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.04} />
      </mesh>

      {/* Wireframe shell */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[0.75, 1]} />
        <meshStandardMaterial
          color="#10b981"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Core solid */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.55, 2]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={0.6}
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>

      {/* Inner ring 1 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.008, 6, 80]} />
        <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={0.4} />
      </mesh>

      {/* Inner ring 2 */}
      <mesh rotation={[0, Math.PI / 3, Math.PI / 6]}>
        <torusGeometry args={[0.85, 0.005, 6, 80]} />
        <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={0.25} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function AgentNode({ position, color, index }: { position: number[]; color: string; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      const floatY = Math.sin(t * 0.5 + index * 1.3) * 0.12;
      meshRef.current.position.y = position[1] + floatY;
      meshRef.current.rotation.y = t * 0.35 + index;
      meshRef.current.rotation.x = t * 0.2 + index * 0.5;

      const pulse = 0.9 + Math.sin(t * 2 + index) * 0.1;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh ref={meshRef} position={position as [number, number, number]}>
      <octahedronGeometry args={[0.1, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  );
}

function Connections() {
  const groupRef = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    return NODE_POSITIONS.map((pos) => ({
      start: new THREE.Vector3(0, 0, 0),
      end: new THREE.Vector3(pos[0], pos[1], pos[2]),
    }));
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => {
        const dir = new THREE.Vector3().subVectors(line.end, line.start);
        const len = dir.length();
        const mid = new THREE.Vector3().addVectors(line.start, line.end).multiplyScalar(0.5);

        return (
          <mesh key={i} position={mid.toArray() as [number, number, number]}>
            <cylinderGeometry args={[0.003, 0.003, len, 4]} />
            <meshStandardMaterial
              color="#10b981"
              transparent
              opacity={0.1 + Math.sin(i) * 0.05}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Particles({ count = 300 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 15;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.02;
      ref.current.rotation.x = clock.getElapsedTime() * 0.008;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#3f3f46"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 4, 4]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-3, 2, -2]} intensity={0.8} color="#10b981" />
      <pointLight position={[2, -2, 2]} intensity={0.4} color="#34d399" />

      <MorphingCore />
      <Connections />

      {NODE_POSITIONS.map((pos, i) => (
        <AgentNode key={i} position={pos} color={NODE_COLORS[i]} index={i} />
      ))}

      <Particles count={300} />
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
