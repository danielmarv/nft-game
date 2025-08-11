"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html, Text3D } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Heart, Utensils } from "lucide-react"

interface Pet {
  id: string
  name: string
  description: string
  image: string
  rarity?: string
  type?: string
  attributes?: Array<{
    trait_type: string
    value: string
  }>
}

interface PetViewerProps {
  pet: Pet
}

type PetAnimation = "idle" | "hug" | "feed"

function PetModel({ pet, currentAnimation }: { pet: Pet; currentAnimation: PetAnimation }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [animationState, setAnimationState] = useState<PetAnimation>(currentAnimation)

  useEffect(() => {
    setAnimationState(currentAnimation)
    if (currentAnimation !== "idle") {
      const timer = setTimeout(() => setAnimationState("idle"), 1500) // Reset to idle after 1.5s
      return () => clearTimeout(timer)
    }
  }, [currentAnimation])

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Basic idle animation
      meshRef.current.rotation.y += delta * 0.2
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.5 // Floating effect

      // Specific animations
      if (animationState === "hug") {
        meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1)
        meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 10) * 0.1 // Wiggle
      } else if (animationState === "feed") {
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 5) * 0.2 + 0.5 // Bob up and down
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 7) * 0.05
      } else {
        // Reset to default scale/rotation if not in specific animation
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
        meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.1)
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.1)
      }
    }
  })

  // Simple procedural pet model (replace with actual GLB/GLTF model if available)
  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={pet.attributes?.find((attr) => attr.trait_type === "Color")?.value || "#8A2BE2"} />{" "}
      {/* Default purple */}
      {/* Eyes */}
      <mesh position={[0.4, 0.3, 0.9]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.4, 0.3, 0.9]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Pupils */}
      <mesh position={[0.4, 0.3, 0.95]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-0.4, 0.3, 0.95]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
      {/* Mouth */}
      <mesh position={[0, -0.3, 0.9]}>
        <torusGeometry args={[0.2, 0.05, 16, 100, Math.PI]} />
        <meshStandardMaterial color="red" />
      </mesh>
      {/* Ears (simple cones) */}
      <mesh position={[0.8, 1.0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.3, 0.8, 16]} />
        <meshStandardMaterial color={pet.attributes?.find((attr) => attr.trait_type === "Color")?.value || "#8A2BE2"} />
      </mesh>
      <mesh position={[-0.8, 1.0, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <coneGeometry args={[0.3, 0.8, 16]} />
        <meshStandardMaterial color={pet.attributes?.find((attr) => attr.trait_type === "Color")?.value || "#8A2BE2"} />
      </mesh>
    </mesh>
  )
}

export function PetViewer({ pet }: PetViewerProps) {
  const [currentAnimation, setCurrentAnimation] = useState<PetAnimation>("idle")

  const handleHug = () => {
    setCurrentAnimation("hug")
    console.log(`${pet.name} received a hug!`)
  }

  const handleFeed = () => {
    setCurrentAnimation("feed")
    console.log(`${pet.name} was fed!`)
  }

  return (
    <Canvas camera={{ position: [0, 1.5, 3], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={1} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={1} />
      <Environment preset="park" background /> {/* A nice outdoor environment */}
      <PetModel pet={pet} currentAnimation={currentAnimation} />
      {/* Pet Name */}
      <Text3D
        font="/fonts/Geist-Bold.ttf"
        size={0.4}
        height={0.05}
        curveSegments={12}
        position={[0, 2, 0]}
        rotation={[0, 0, 0]}
        bevelEnabled
        bevelSize={0.01}
        bevelThickness={0.01}
        castShadow
      >
        {pet.name}
        <meshStandardMaterial color="#FFD700" /> {/* Gold color for name */}
      </Text3D>
      {/* Interaction Buttons */}
      <Html position={[0, -1.5, 1.5]} center>
        <div className="flex space-x-4 p-4 bg-black/50 rounded-lg backdrop-blur-sm">
          <Button onClick={handleHug} className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white">
            <Heart className="h-5 w-5" /> Hug
          </Button>
          <Button onClick={handleFeed} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
            <Utensils className="h-5 w-5" /> Feed
          </Button>
        </div>
      </Html>
      <OrbitControls enableZoom={true} enablePan={true} />
    </Canvas>
  )
}
