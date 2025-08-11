"use client"

import type React from "react"
import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Text } from "@react-three/drei"
import type * as THREE from "three"

interface EnhancedSceneProps {
  children: React.ReactNode
  title?: string
  cameraPosition?: [number, number, number]
}

function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
    }
  })
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}

export function EnhancedScene({ children, title, cameraPosition = [0, 0, 5] }: EnhancedSceneProps) {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-black">
      <Canvas camera={{ position: cameraPosition, fov: 75 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={1} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={1} />
        <Environment preset="sunset" background /> {/* Use a different preset for variety */}
        {title && (
          <Text
            position={[0, 2, -3]}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="/fonts/Geist-Bold.ttf" // Using Geist-Bold font
          >
            {title}
          </Text>
        )}
        {children}
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  )
}
