"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sword, Shield, Zap } from "lucide-react"
import Image from "next/image"

interface GameCard {
  id: string
  name: string
  description: string
  image: string
  rarity: "common" | "rare" | "epic" | "legendary"
  type: "fire" | "water" | "earth" | "air"
  attack: number
  defense: number
  cost: number
}

interface CardGalleryProps {
  cards: GameCard[]
}

const rarityColors = {
  common: "bg-gray-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-yellow-500",
}

const typeColors = {
  fire: "text-red-500",
  water: "text-blue-500",
  earth: "text-green-500",
  air: "text-purple-500",
}

export function CardGallery({ cards }: CardGalleryProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🃏</div>
        <h3 className="text-lg font-semibold mb-2">No Cards Yet</h3>
        <p className="text-muted-foreground mb-4">Open card packs to start building your collection!</p>
        <Button>Open First Pack</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative aspect-[3/4]">
            <Image
              src={card.image || "/placeholder.svg?height=400&width=300&query=trading card"}
              alt={card.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge className={`${rarityColors[card.rarity]} text-white`}>{card.rarity}</Badge>
            </div>
            <div className="absolute top-2 left-2">
              <Badge variant="outline" className="bg-background/80">
                <Zap className="h-3 w-3 mr-1" />
                {card.cost}
              </Badge>
            </div>
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{card.name}</CardTitle>
            <CardDescription className="text-xs line-clamp-2">{card.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className={typeColors[card.type]}>
                {card.type}
              </Badge>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Sword className="h-3 w-3 text-red-500" />
                  <span>{card.attack}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-blue-500" />
                  <span>{card.defense}</span>
                </div>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full bg-transparent">
              Add to Deck
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
