"use client"

import { useState } from "react"
import { useNFTs } from "@/hooks/use-nfts"
import { NftCard } from "@/components/nft/nft-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function GalleryPage() {
  const { achievements, pets, cards, isLoading, error } = useNFTs("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const allNfts = [...(achievements || []), ...(pets || []), ...(cards || [])]

  const filteredNfts = allNfts.filter((nft) => {
    const matchesSearch =
      nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType =
      filterType === "all" ||
      (filterType === "achievements" && nft.type === "achievement") ||
      (filterType === "pets" && nft.type === "pet") ||
      (filterType === "cards" && ["fire", "water", "earth", "air"].includes(nft.type || ""))

    return matchesSearch && matchesType
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <Skeleton className="h-10 w-full sm:w-1/3" />
          <Skeleton className="h-10 w-full sm:w-1/4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
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
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        <p>Error loading NFTs: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-purple-400">NFT Gallery</h1>
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="outline" className="bg-gray-800 text-white border-gray-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Input
            type="text"
            placeholder="Search NFTs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm bg-gray-800 text-white border-gray-700 placeholder:text-gray-500"
          />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px] bg-gray-800 text-white border-gray-700">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pets">Pets</SelectItem>
              <SelectItem value="cards">Cards</SelectItem>
              <SelectItem value="achievements">Achievements</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredNfts.length === 0 ? (
          <div className="text-center text-muted-foreground p-8">
            <p>No NFTs found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredNfts.map((nft) => (
              <NftCard
                key={nft.id}
                name={nft.name}
                description={nft.description}
                imageUrl={nft.image}
                rarity={nft.rarity}
                // Add price/owner if applicable to all NFT types or conditionally
              />
            ))}
          </div>
        )}
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} NFT Game. All rights reserved.</p>
      </footer>
    </div>
  )
}
