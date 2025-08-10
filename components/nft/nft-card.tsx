"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Eye, Share2 } from "lucide-react"
import Image from "next/image"

interface NFT {
  id: string
  name: string
  description: string
  image: string
  rarity: "common" | "rare" | "epic" | "legendary"
  type: string
  price?: number
  owner?: string
}

interface NFTCardProps {
  nft: NFT
}

const rarityColors = {
  common: "bg-gray-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-yellow-500",
}

export function NFTCard({ nft }: NFTCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square">
        <Image
          src={nft.image || "/placeholder.svg?height=300&width=300&query=nft card"}
          alt={nft.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className={`${rarityColors[nft.rarity]} text-white`}>{nft.rarity}</Badge>
        </div>
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{nft.name}</CardTitle>
        <CardDescription className="text-sm line-clamp-2">{nft.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline">{nft.type}</Badge>
          {nft.price && <span className="text-sm font-medium">{nft.price} ETH</span>}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button size="sm" variant="outline">
            <Heart className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline">
            <Share2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
