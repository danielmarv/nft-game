"use client"

import { useState } from "react"
import { Suspense, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html, ContactShadows, Float, Sparkles, Sphere } from "@react-three/drei"
import * as THREE from "three"
import { cn } from "@/lib/utils"

interface PetViewerProps {
  petId: string | null
  className?: string
}

function PetModel({ petId }: { petId: string | null }) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2
      // Subtle rotation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1

      // Scale animation when hovered
      const targetScale = hovered ? 1.1 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  // Create a cute procedural pet using Three.js geometry
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={meshRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} scale={1.5}>
        {/* Pet Body - Main sphere */}
        <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#60a5fa"
            metalness={0.1}
            roughness={0.3}
            emissive="#3b82f6"
            emissiveIntensity={0.1}
          />
        </Sphere>

        {/* Pet Head - Smaller sphere on top */}
        <Sphere args={[0.7, 32, 32]} position={[0, 1.2, 0.2]}>
          <meshStandardMaterial
            color="#7c3aed"
            metalness={0.1}
            roughness={0.3}
            emissive="#6366f1"
            emissiveIntensity={0.1}
          />
        </Sphere>

        {/* Eyes */}
        <Sphere args={[0.15, 16, 16]} position={[-0.25, 1.4, 0.6]}>
          <meshStandardMaterial color="#ffffff" />
        </Sphere>
        <Sphere args={[0.15, 16, 16]} position={[0.25, 1.4, 0.6]}>
          <meshStandardMaterial color="#ffffff" />
        </Sphere>

        {/* Eye pupils */}
        <Sphere args={[0.08, 16, 16]} position={[-0.25, 1.4, 0.7]}>
          <meshStandardMaterial color="#000000" />
        </Sphere>
        <Sphere args={[0.08, 16, 16]} position={[0.25, 1.4, 0.7]}>
          <meshStandardMaterial color="#000000" />
        </Sphere>

        {/* Nose */}
        <Sphere args={[0.08, 16, 16]} position={[0, 1.2, 0.7]}>
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.2} />
        </Sphere>

        {/* Ears */}
        <mesh position={[-0.4, 1.7, 0]} rotation={[0, 0, -0.3]}>
          <coneGeometry args={[0.2, 0.6, 8]} />
          <meshStandardMaterial color="#8b5cf6" />
        </mesh>
        <mesh position={[0.4, 1.7, 0]} rotation={[0, 0, 0.3]}>
          <coneGeometry args={[0.2, 0.6, 8]} />
          <meshStandardMaterial color="#8b5cf6" />
        </mesh>

        {/* Wings */}
        <mesh position={[-0.8, 0.3, -0.2]} rotation={[0.2, -0.5, 0]}>
          <planeGeometry args={[0.8, 1.2]} />
          <meshStandardMaterial
            color="#f59e0b"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
            emissive="#f59e0b"
            emissiveIntensity={0.1}
          />
        </mesh>
        <mesh position={[0.8, 0.3, -0.2]} rotation={[0.2, 0.5, 0]}>
          <planeGeometry args={[0.8, 1.2]} />
          <meshStandardMaterial
            color="#f59e0b"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
            emissive="#f59e0b"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Tail */}
        <mesh position={[0, -0.2, -1]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.3, 1, 8]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.1} />
        </mesh>

        {/* Magical sparkles around the pet */}
        <Sparkles count={50} scale={3} size={2} speed={0.4} color="#60a5fa" />

        {/* Glowing aura effect */}
        <mesh scale={1.5}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.05} side={THREE.BackSide} />
        </mesh>

        {/* Energy rings */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <torusGeometry args={[1.8, 0.05, 8, 32]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.3} transparent opacity={0.6} />
        </mesh>

        <mesh rotation={[0, 0, Math.PI / 4]} position={[0, 0, 0]}>
          <torusGeometry args={[2, 0.03, 8, 32]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.4} transparent opacity={0.4} />
        </mesh>
      </group>
    </Float>
  )
}

function PetEnvironment() {
  return (
    <>
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#60a5fa" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} castShadow />

      {/* Ground plane with contact shadows */}
      <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />

      {/* Floating geometric shapes for ambiance */}
      <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
        <mesh position={[-4, 3, -3]} rotation={[0, 0, Math.PI / 4]}>
          <octahedronGeometry args={[0.3]} />
          <meshStandardMaterial color="#8b5cf6" transparent opacity={0.6} emissive="#8b5cf6" emissiveIntensity={0.2} />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.3}>
        <mesh position={[4, 2, -2]} rotation={[Math.PI / 4, 0, 0]}>
          <tetrahedronGeometry args={[0.4]} />
          <meshStandardMaterial color="#f59e0b" transparent opacity={0.7} emissive="#f59e0b" emissiveIntensity={0.2} />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.4}>
        <mesh position={[0, 4, -4]}>
          <dodecahedronGeometry args={[0.2]} />
          <meshStandardMaterial color="#10b981" transparent opacity={0.5} emissive="#10b981" emissiveIntensity={0.3} />
        </mesh>
      </Float>

      {/* Magical portal effect */}
      <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.1}>
        <mesh position={[0, -1.5, -5]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2, 0.1, 16, 32]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.5} transparent opacity={0.3} />
        </mesh>
      </Float>
    </>
  )
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="text-center p-6 bg-background/90 backdrop-blur-sm rounded-xl border border-primary/20 shadow-2xl">
        <div className="relative mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div
            className="absolute inset-0 rounded-full h-12 w-12 border-t-2 border-purple-500 animate-spin mx-auto"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
          <div
            className="absolute inset-0 rounded-full h-12 w-12 border-r-2 border-pink-500 animate-spin mx-auto"
            style={{ animationDuration: "2s" }}
          ></div>
        </div>
        <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Summoning Your Pet
        </h3>
        <p className="text-sm text-muted-foreground font-medium mb-3">Preparing the magical realm...</p>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </Html>
  )
}

export function PetViewer({ petId, className }: PetViewerProps) {
  return (
    <div className={cn("w-full h-full min-h-[400px] relative overflow-hidden rounded-lg", className)}>
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none z-10" />

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce opacity-50"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
      </div>

      <Canvas
        camera={{ position: [0, 2, 8], fov: 45 }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <PetModel petId={petId} />
          <PetEnvironment />

          {/* Premium HDR environment */}
          <Environment preset="sunset" background={false} blur={0.8} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          maxDistance={15}
          minDistance={3}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Enhanced UI Overlay */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-primary/20 shadow-lg">
          <p className="text-xs text-muted-foreground flex items-center">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Click and drag to rotate • Scroll to zoom
          </p>
        </div>
      </div>

      {/* Pet Info Overlay */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-primary/20 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <p className="text-xs font-medium text-primary">Magical Companion</p>
          </div>
        </div>
      </div>
    </div>
  )
}
