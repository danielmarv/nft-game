"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Sparkles } from "@react-three/drei"
import * as THREE from "three"

function FloatingOrbs() {
  const orbsRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (orbsRef.current) {
      orbsRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={orbsRef}>
      {Array.from({ length: 20 }, (_, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20]}>
            <sphereGeometry args={[0.1 + Math.random() * 0.2, 16, 16]} />
            <meshStandardMaterial
              color={new THREE.Color().setHSL(Math.random(), 0.7, 0.6)}
              emissive={new THREE.Color().setHSL(Math.random(), 0.5, 0.3)}
              emissiveIntensity={0.5}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

export function MagicalBackground() {
  return (
    <div className="fixed inset-0 -z-10 opacity-30">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        <FloatingOrbs />

        <Sparkles count={100} scale={20} size={1} speed={0.2} color="#60a5fa" />
      </Canvas>
    </div>
  )
}
