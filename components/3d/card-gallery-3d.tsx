"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { Card3D } from "./card-3d"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import * as THREE from "three"

interface GameCard {
  id: string
  name: string
  imageUrl: string
  description: string
  rarity: string
}

interface CardGallery3DProps {
  cards: GameCard[]
}

const CARD_SPACING = 2.5 // Horizontal spacing between cards

function Carousel({ cards }: { cards: GameCard[] }) {
  const groupRef = useRef<THREE.Group>(null!)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Animate the carousel position
  useFrame(() => {
    if (groupRef.current) {
      const targetX = -currentIndex * CARD_SPACING
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1)
    }
  })

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, cards.length - 1))
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  return (
    <>
      <group ref={groupRef}>
        {cards.map((card, index) => (
          <Card3D
            key={card.id}
            imageUrl={card.imageUrl}
            position={[index * CARD_SPACING, 0, 0]}
            onClick={() => console.log("Clicked card:", card.name)}
          />
        ))}
      </group>

      {/* UI for navigation */}
      <Html position={[0, -2.5, 0]} center>
        <div className="flex space-x-4 mt-4">
          <Button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            onClick={goToNext}
            disabled={currentIndex === cards.length - 1}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </Html>
    </>
  )
}

export function CardGallery3D({ cards }: CardGallery3DProps) {
  if (!cards || cards.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-800 rounded-lg text-muted-foreground">
        No cards to display in 3D.
      </div>
    )
  }

  return (
    <div className="w-full h-[500px] bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-xl">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={1} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={1} />
        <Environment preset="warehouse" background /> {/* Adds a nice background environment */}
        <Carousel cards={cards} />
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  )
}
