"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useSpring, animated } from "@react-spring/three"
import { Text, RoundedBox, Sparkles } from "@react-three/drei"
import * as THREE from "three"

interface Card3DProps {
  card: {
    id: string
    name: string
    rarity: string
    type: string
    image: string
  }
  isFlipped: boolean
  onFlip: () => void
}

export function Card3D({ card, isFlipped, onFlip }: Card3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  const { rotation, scale } = useSpring({
    rotation: isFlipped ? ([0, Math.PI, 0] as [number, number, number]) : ([0, 0, 0] as [number, number, number]),
    scale: hovered ? 1.1 : 1,
    config: { mass: 1, tension: 280, friction: 60 },
  })

  useFrame((state) => {
    if (groupRef.current && !hovered) {
      groupRef.current.rotation.y += 0.003
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "#9ca3af"
      case "rare":
        return "#3b82f6"
      case "epic":
        return "#8b5cf6"
      case "legendary":
        return "#f59e0b"
      default:
        return "#6b7280"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "fire":
        return "#ef4444"
      case "water":
        return "#06b6d4"
      case "earth":
        return "#84cc16"
      case "air":
        return "#a855f7"
      default:
        return "#6b7280"
    }
  }

  return (
    <animated.group
      ref={groupRef}
      scale={scale}
      rotation={rotation as any}
      onClick={onFlip}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Card Front */}
      <group position={[0, 0, 0.02]}>
        <RoundedBox args={[2.2, 3.2, 0.1]} radius={0.1}>
          <meshStandardMaterial
            color={getRarityColor(card.rarity)}
            metalness={0.3}
            roughness={0.4}
            envMapIntensity={0.8}
          />
        </RoundedBox>

        {/* Inner card content */}
        <RoundedBox args={[2, 3, 0.05]} radius={0.08} position={[0, 0, 0.06]}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.8} />
        </RoundedBox>

        {/* Card artwork area */}
        <RoundedBox args={[1.6, 1.6, 0.02]} radius={0.05} position={[0, 0.4, 0.08]}>
          <meshStandardMaterial
            color={getTypeColor(card.type)}
            transparent
            opacity={0.8}
            emissive={getTypeColor(card.type)}
            emissiveIntensity={0.1}
          />
        </RoundedBox>

        {/* Card name */}
        <Text
          position={[0, -0.6, 0.09]}
          fontSize={0.18}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.ttf"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {card.name}
        </Text>

        {/* Card type and rarity */}
        <Text
          position={[0, -0.9, 0.09]}
          fontSize={0.12}
          color="#d1d5db"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Regular.ttf"
        >
          {card.type.toUpperCase()}
        </Text>

        <Text
          position={[0, -1.1, 0.09]}
          fontSize={0.1}
          color={getRarityColor(card.rarity)}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.ttf"
        >
          {card.rarity.toUpperCase()}
        </Text>

        {/* Rarity sparkles for epic and legendary */}
        {(card.rarity === "epic" || card.rarity === "legendary") && (
          <Sparkles
            count={card.rarity === "legendary" ? 30 : 20}
            scale={2.5}
            size={1}
            speed={0.3}
            color={getRarityColor(card.rarity)}
          />
        )}
      </group>

      {/* Card Back */}
      <group position={[0, 0, -0.02]} rotation={[0, Math.PI, 0]}>
        <RoundedBox args={[2.2, 3.2, 0.1]} radius={0.1}>
          <meshStandardMaterial color="#1f2937" metalness={0.5} roughness={0.3} envMapIntensity={1} />
        </RoundedBox>

        {/* Back design */}
        <RoundedBox args={[1.8, 2.8, 0.05]} radius={0.08} position={[0, 0, 0.06]}>
          <meshStandardMaterial color="#374151" metalness={0.2} roughness={0.6} />
        </RoundedBox>

        {/* Mystical symbol */}
        <mesh position={[0, 0, 0.08]}>
          <torusGeometry args={[0.3, 0.05, 8, 16]} />
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.2} />
        </mesh>

        <mesh position={[0, 0, 0.08]} rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[0.2, 0.03, 8, 16]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Hover glow effect */}
      {hovered && (
        <mesh scale={1.3}>
          <sphereGeometry args={[1.8, 32, 32]} />
          <meshBasicMaterial color={getRarityColor(card.rarity)} transparent opacity={0.1} side={THREE.BackSide} />
        </mesh>
      )}
    </animated.group>
  )
}
