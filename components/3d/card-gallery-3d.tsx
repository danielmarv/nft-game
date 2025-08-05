"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Html } from "@react-three/drei"
import { Card3D } from "./card-3d"

interface Card3DGalleryProps {
  cards: Array<{
    id: string
    name: string
    rarity: string
    type: string
    image: string
  }>
  flippedCards: Set<string>
  onCardFlip: (cardId: string) => void
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading cards...</p>
      </div>
    </Html>
  )
}

export function Card3DGallery({ cards, flippedCards, onCardFlip }: Card3DGalleryProps) {
  return (
    <div className="h-96 w-full rounded-lg overflow-hidden bg-gradient-to-br from-background to-primary/5">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} shadows>
        <Suspense fallback={<LoadingFallback />}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#60a5fa" />

          {/* Cards arranged in a grid */}
          {cards.slice(0, 6).map((card, index) => {
            const x = (index % 3) * 3 - 3
            const y = Math.floor(index / 3) * 4 - 2

            return (
              <Float key={card.id} speed={1 + index * 0.1} rotationIntensity={0.1} floatIntensity={0.2}>
                <group position={[x, y, 0]}>
                  <Card3D card={card} isFlipped={flippedCards.has(card.id)} onFlip={() => onCardFlip(card.id)} />
                </group>
              </Float>
            )
          })}

          <Environment preset="studio" background={false} />
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          maxDistance={12}
          minDistance={4}
          autoRotate
          autoRotateSpeed={0.2}
        />
      </Canvas>
    </div>
  )
}
