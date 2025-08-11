"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { NftCard } from "@/components/nft/nft-card"
import { useNFTs } from "@/hooks/use-nfts"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function CardGallery() {
  const { cards, isLoading, error } = useNFTs("cards") // Specify "cards" type
  const [searchTerm, setSearchTerm] = useState("")

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-0">
              <Skeleton className="w-full h-48 rounded-t-lg" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-1/2 mb-3" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4 border border-red-300 rounded-md">
        <p>Error loading NFTs: {error.message || "Unknown error"}</p>
      </div>
    )
  }

  // Ensure cards is an array before filtering
  const filteredCards = (cards || []).filter((card) => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4">
        <p>No trading cards found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Input
          type="text"
          placeholder="Search cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <NftCard
              key={card.id}
              name={card.name}
              description={card.description}
              imageUrl={card.image} // Use 'image' property from NFT type
              rarity={card.rarity}
              // Assuming cards don't have price/owner in this context, or add if needed
              // price={card.price}
              // owner={card.owner}
              // onBuy={() => console.log(`Buying ${card.name}`)}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground p-4">
            <p>No cards match your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
