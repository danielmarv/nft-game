"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Share2, ExternalLink } from "lucide-react"
import { useState } from "react"

interface NFTCardProps {
  id: string
  name: string
  description: string
  image: string
  rarity: "common" | "rare" | "epic" | "legendary"
  price?: string
  owned?: boolean
}

export function NFTCard({ id, name, description, image, rarity, price, owned = false }: NFTCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  const rarityColors = {
    common: "bg-gray-500",
    rare: "bg-blue-500",
    epic: "bg-purple-500",
    legendary: "bg-yellow-500",
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={image || `/placeholder.svg?height=200&width=200&query=${name}`}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge className={`${rarityColors[rarity]} text-white`}>
            {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
          </Badge>
          {owned && <Badge variant="secondary">Owned</Badge>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 bg-black/20 hover:bg-black/40"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`} />
        </Button>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          {price && <div className="text-lg font-semibold text-primary">{price} HBAR</div>}
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!owned && price && <Button className="w-full mt-3">Buy Now</Button>}
      </CardContent>
    </Card>
  )
}
