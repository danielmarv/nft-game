"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn, truncateAddress } from "@/lib/utils"

interface NftCardProps {
  name: string
  description: string
  imageUrl: string
  price?: string
  owner?: string
  rarity?: string
  onBuy?: () => void
}

export function NftCard({ name, description, imageUrl, price, owner, rarity, onBuy }: NftCardProps) {
  const getRarityColor = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case "common":
        return "text-gray-500"
      case "uncommon":
        return "text-green-500"
      case "rare":
        return "text-blue-500"
      case "epic":
        return "text-purple-500"
      case "legendary":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={imageUrl || "/placeholder.svg?height=300&width=200"}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
            quality={100}
            priority
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-bold mb-1">{name}</CardTitle>
        <CardDescription className="text-sm mb-2 line-clamp-2">{description}</CardDescription>
        {rarity && <p className={cn("text-sm font-semibold mb-1", getRarityColor(rarity))}>Rarity: {rarity}</p>}
        {price && <p className="text-md font-semibold mb-1">Price: {price} ETH</p>}
        {owner && <p className="text-sm text-muted-foreground mb-3">Owner: {truncateAddress(owner)}</p>}
        {onBuy && (
          <Button onClick={onBuy} className="w-full">
            Buy Now
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
