"use client"

import type React from "react"
import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, OrbitControls, Stars, Sparkles, Cloud } from "@react-three/drei"
import * as THREE from "three"

interface MagicalBackgroundProps {
  children?: React.ReactNode
}

function FloatingSpheres() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05
      groupRef.current.rotation.x += delta * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      {[...Array(10)].map((_, i) => (
        <Sphere
          key={i}
          position={[Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5]}
          args={[0.2 + Math.random() * 0.5, 16, 16]}
        >
          <meshStandardMaterial color={new THREE.Color(Math.random() * 0xffffff)} transparent opacity={0.8} />
        </Sphere>
      ))}
    </group>
  )
}

export function MagicalBackground({ children }: MagicalBackgroundProps) {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-900 to-indigo-900">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
        <Sparkles count={200} size={2} scale={[20, 20, 20]} color={"#FFD700"} speed={0.5} opacity={0.7} />
        <Cloud
          opacity={0.5}
          speed={0.4} // Rotation speed
          width={10} // Width of the cloud
          depth={1.5} // Depth of the cloud
          segments={20} // Number of segments
          position={[0, 0, -5]}
          color="#ffffff"
        />

        <FloatingSpheres />

        {children}

        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  )
}
