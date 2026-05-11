"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Line } from "@react-three/drei";
import * as THREE from "three";

// Agent node positions (spherical distribution)
const NODE_POSITIONS = [
  [2, 0.5, 0],
  [-1.5, 1.2, 1],
  [1, -1, 1.5],
  [-2, -0.5, 0.5],
  [0.5, 1.8, -1],
  [-0.8, -1.5, -1.2],
];

const NODE_COLORS = [
  "#10b981", // emerald-500
  "#34d399", // emerald-400
  "#6ee7b7", // emerald-300
  "#a1a1aa", // zinc-400
  "#fafafa", // white
  "#d4d4d8", // zinc-300
];

function CentralSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 1.5) * 0.05;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Glow layer */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.08} />
      </mesh>
      {/* Core sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      {/* Inner ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.015, 8, 64]} />
        <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={0.3} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.7, 0.01, 8, 64]} />
        <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={0.2} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function AgentNode({ position, color, index }: { position: number[]; color: string; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime() * 0.3 + index * 1.2;
      meshRef.current.position.y = position[1] + Math.sin(t) * 0.15;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.4 + index;
    }
  });

  return (
    <mesh ref={meshRef} position={position as [number, number, number]}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.6}
      />
    </mesh>
  );
}

function Connections() {
  const linesRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = clock.getElapsedTime() * 0.08;
    }
  });

  const lineGeometries = useMemo(() => {
    return NODE_POSITIONS.map((pos) => {
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(pos[0], pos[1], pos[2])];
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, []);

  return (
    <group ref={linesRef}>
      {lineGeometries.map((geo, i) => {
        const pos1 = geo.attributes.position.array as Float32Array;
        return (
          <Line
            key={i}
            points={[
              [pos1[0], pos1[1], pos1[2]],
              [pos1[3], pos1[4], pos1[5]],
            ]}
            color="#10b981"
            transparent
            opacity={0.15}
            lineWidth={0.5}
          />
        );
      })}
    </group>
  );
}

function Particles({ count = 400 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);

  return (
    <Points positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#3f3f46"
        size={0.025}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  const isMobile = viewport.width < 5;

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.3} />

      {/* Key light */}
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />

      {/* Fill light */}
      <pointLight position={[-3, 2, -2]} intensity={0.5} color="#10b981" />

      {/* Central structure */}
      <group ref={groupRef}>
        <CentralSphere />
        <Connections />

        {/* Agent nodes */}
        {(isMobile ? NODE_POSITIONS.slice(0, 4) : NODE_POSITIONS).map((pos, i) => (
          <AgentNode
            key={i}
            position={pos}
            color={NODE_COLORS[i]}
            index={i}
          />
        ))}
      </group>

      {/* Background particles */}
      <Particles count={isMobile ? 200 : 400} />
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
