"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Sphere, Box, Cylinder, Cone } from "@react-three/drei"
import * as THREE from "three"

interface NFTPet {
  id: string
  name: string
  type: "Dragon" | "Unicorn" | "Phoenix" | "Griffin" | "Pegasus"
  rarity: "Common" | "Rare" | "Epic" | "Legendary" | "Mythic"
  level: number
  stats: {
    happiness: number
    energy: number
    strength: number
    magic: number
    speed: number
  }
}

interface EnhancedPetModelProps {
  pet: NFTPet
  isInteracting: boolean
  lastInteraction: string | null
}

export function EnhancedPetModel({ pet, isInteracting, lastInteraction }: EnhancedPetModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Mesh>(null)
  const eyesRef = useRef<THREE.Group>(null)

  // Enhanced color schemes based on pet type and rarity
  const colors = useMemo(() => {
    const baseColors = {
      Dragon: { primary: "#ff4444", secondary: "#cc2222", accent: "#ff6666" },
      Unicorn: { primary: "#ffffff", secondary: "#f0f0ff", accent: "#e6e6ff" },
      Phoenix: { primary: "#ff8800", secondary: "#ff6600", accent: "#ffaa44" },
      Griffin: { primary: "#8b4513", secondary: "#654321", accent: "#a0522d" },
      Pegasus: { primary: "#f5f5f5", secondary: "#e0e0e0", accent: "#ffffff" },
    }

    const rarityMultipliers = {
      Common: 1.0,
      Rare: 1.1,
      Epic: 1.2,
      Legendary: 1.3,
      Mythic: 1.5,
    }

    const base = baseColors[pet.type]
    const multiplier = rarityMultipliers[pet.rarity]

    return {
      primary: base.primary,
      secondary: base.secondary,
      accent: base.accent,
      glow: pet.rarity === "Mythic" ? "#ff00ff" : pet.rarity === "Legendary" ? "#ffff00" : base.accent,
      intensity: multiplier,
    }
  }, [pet.type, pet.rarity])

  // Floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }

    // Interaction animations
    if (isInteracting && bodyRef.current) {
      switch (lastInteraction) {
        case "hug":
          bodyRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 8) * 0.05)
          break
        case "feed":
          bodyRef.current.position.y = Math.sin(state.clock.elapsedTime * 6) * 0.1
          break
        case "play":
          groupRef.current.rotation.y += 0.1
          break
        case "train":
          bodyRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 10) * 0.1)
          break
      }
    }

    // Eye blinking animation
    if (eyesRef.current) {
      const blinkTime = Math.sin(state.clock.elapsedTime * 3)
      if (blinkTime > 0.95) {
        eyesRef.current.scale.y = 0.1
      } else {
        eyesRef.current.scale.y = 1
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main body */}
      <Sphere ref={bodyRef} args={[0.8, 32, 32]} position={[0, 0, 0]}>
        <meshPhongMaterial
          color={colors.primary}
          shininess={100}
          emissive={pet.rarity === "Mythic" ? colors.glow : "#000000"}
          emissiveIntensity={pet.rarity === "Mythic" ? 0.2 : 0}
        />
      </Sphere>

      {/* Head */}
      <Sphere args={[0.5, 32, 32]} position={[0, 1, 0.2]}>
        <meshPhongMaterial color={colors.primary} shininess={100} />
      </Sphere>

      {/* Eyes */}
      <group ref={eyesRef}>
        <Sphere args={[0.08, 16, 16]} position={[-0.15, 1.1, 0.45]}>
          <meshBasicMaterial color="#00aaff" />
        </Sphere>
        <Sphere args={[0.08, 16, 16]} position={[0.15, 1.1, 0.45]}>
          <meshBasicMaterial color="#00aaff" />
        </Sphere>
      </group>

      {/* Type-specific features */}
      {pet.type === "Dragon" && (
        <>
          {/* Wings */}
          <Box args={[0.1, 0.8, 1.2]} position={[-0.6, 0.2, -0.3]} rotation={[0, 0, Math.PI / 6]}>
            <meshPhongMaterial color={colors.secondary} transparent opacity={0.8} />
          </Box>
          <Box args={[0.1, 0.8, 1.2]} position={[0.6, 0.2, -0.3]} rotation={[0, 0, -Math.PI / 6]}>
            <meshPhongMaterial color={colors.secondary} transparent opacity={0.8} />
          </Box>

          {/* Spikes */}
          {[0, 1, 2].map((i) => (
            <Cone key={i} args={[0.1, 0.3]} position={[0, 0.5 + i * 0.2, -0.8 - i * 0.1]}>
              <meshPhongMaterial color={colors.accent} />
            </Cone>
          ))}
        </>
      )}

      {pet.type === "Unicorn" && (
        <>
          {/* Horn */}
          <Cylinder args={[0.02, 0.15, 0.6]} position={[0, 1.5, 0]} rotation={[Math.PI / 12, 0, 0]}>
            <meshPhongMaterial color="#ffd700" emissive="#ffaa00" emissiveIntensity={0.3} shininess={200} />
          </Cylinder>
        </>
      )}

      {pet.type === "Phoenix" && (
        <>
          {/* Flame crown */}
          {[0, 1, 2, 3, 4].map((i) => (
            <Cylinder
              key={i}
              args={[0.05, 0.15, 0.4]}
              position={[Math.sin((i * Math.PI * 2) / 5) * 0.3, 1.4, Math.cos((i * Math.PI * 2) / 5) * 0.3]}
            >
              <meshBasicMaterial color="#ff4400" emissive="#ff6600" emissiveIntensity={0.5} />
            </Cylinder>
          ))}
        </>
      )}

      {/* Pet name floating above */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.2}
        color={colors.glow}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        {pet.name}
      </Text>

      {/* Level indicator */}
      <Text
        position={[0, 1.8, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Regular.ttf"
      >
        Level {pet.level}
      </Text>

      {/* Rarity glow effect for Mythic pets */}
      {pet.rarity === "Mythic" && (
        <Sphere args={[1.2, 32, 32]} position={[0, 0, 0]}>
          <meshBasicMaterial color={colors.glow} transparent opacity={0.1} side={THREE.BackSide} />
        </Sphere>
      )}
    </group>
  )
}
