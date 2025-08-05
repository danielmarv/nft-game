"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Trophy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface NFT {
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

interface NFTCardProps {
  nft: NFT
}

export function NFTCard({ nft }: NFTCardProps) {
  const hashscanUrl = `https://hashscan.io/mainnet/token/${nft.id}`

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative bg-gradient-to-br from-muted to-muted/50">
        <Image
          src={nft.image || `/placeholder.svg?height=300&width=300&query=${nft.name} NFT`}
          alt={nft.name}
          fill
          className="object-cover"
        />
        {nft.rarity && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            {nft.rarity}
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg truncate">{nft.name}</CardTitle>
          <Trophy className="h-4 w-4 text-primary flex-shrink-0" />
        </div>
        {nft.type && <CardDescription>{nft.type}</CardDescription>}
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{nft.description}</p>

        {nft.attributes && nft.attributes.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium">Attributes:</p>
            <div className="flex flex-wrap gap-1">
              {nft.attributes.slice(0, 3).map((attr, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {attr.trait_type}: {attr.value}
                </Badge>
              ))}
              {nft.attributes.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{nft.attributes.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
          <Link href={hashscanUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3 w-3 mr-2" />
            View on HashScan
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
