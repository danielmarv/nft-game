"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Card3D } from "@/components/3d/card-3d"

interface GameCard {
  id: string
  name: string
  rarity: string
  type: string
  image: string
  description: string
}

interface CardGalleryProps {
  cards: GameCard[]
}

export function CardGallery({ cards }: CardGalleryProps) {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set())

  const toggleCardFlip = (cardId: string) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  const flipAllCards = () => {
    if (flippedCards.size === cards.length) {
      setFlippedCards(new Set())
    } else {
      setFlippedCards(new Set(cards.map((card) => card.id)))
    }
  }

  if (cards.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-6xl mb-4">🃏</div>
          <p className="text-muted-foreground">No cards found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Your Card Collection</h3>
        <Button onClick={flipAllCards} variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          {flippedCards.size === cards.length ? "Flip All Back" : "Flip All Cards"}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-muted to-muted/50">
                <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                  <ambientLight intensity={0.6} />
                  <pointLight position={[5, 5, 5]} />
                  <Card3D card={card} isFlipped={flippedCards.has(card.id)} onFlip={() => toggleCardFlip(card.id)} />
                  <Environment preset="studio" />
                  <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
                </Canvas>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold truncate">{card.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {card.rarity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{card.type}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{card.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
