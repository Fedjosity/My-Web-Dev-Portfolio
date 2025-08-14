"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

function FloatingCode() {
  const meshRef = useRef<THREE.Group>(null);
  const symbols = useMemo(
    () => ["</>", "{ }", "fn()", "() =>", "const", "type", "<T>", "SQL", "API"],
    []
  );
  const items = useMemo(() => {
    return Array.from({ length: 28 }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8
      ),
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      color: Math.random() > 0.5 ? "#3b82f6" : "#10b981",
      size: 0.4 + Math.random() * 0.6,
      speed: 0.2 + Math.random() * 0.6,
    }));
  }, [symbols]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={meshRef}>
        <Text
          fontSize={1.5}
          color="#3b82f6"
          font="/fonts/Inter-Bold.woff"
          position={[0, 0, 0]}
        >
          {"</>"}
        </Text>
        {/* Floating programming symbols instead of particles */}
        {items.map((it, i) => (
          <group key={i} position={it.position.toArray()}>
            <Text
              fontSize={it.size}
              color={it.color}
              font="/fonts/Inter-Bold.woff"
            >
              {it.symbol}
            </Text>
          </group>
        ))}
      </group>
    </Float>
  );
}

export function Hero3D() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 8] }} className="w-full h-full">
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <FloatingCode />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
