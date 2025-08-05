"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "./use-auth"

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

// Mock API functions - replace with actual backend calls
const fetchUserNFTs = async (userId: string, type: string): Promise<NFT[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock data based on type
  const mockNFTs: Record<string, NFT[]> = {
    achievements: [
      {
        id: "achievement_1",
        name: "Pet Lover",
        description: "Awarded for giving 10 hugs to your pet",
        image: "/placeholder.svg?height=300&width=300",
        rarity: "rare",
        type: "achievement",
        attributes: [
          { trait_type: "Category", value: "Pet Care" },
          { trait_type: "Difficulty", value: "Easy" },
        ],
      },
    ],
    pets: [
      {
        id: "pet_1",
        name: "Fluffy Dragon",
        description: "A cute and friendly dragon companion",
        image: "/placeholder.svg?height=300&width=300",
        rarity: "epic",
        type: "pet",
        attributes: [
          { trait_type: "Species", value: "Dragon" },
          { trait_type: "Color", value: "Blue" },
          { trait_type: "Level", value: "5" },
        ],
      },
    ],
    cards: [
      {
        id: "card_1",
        name: "Fire Elemental",
        description: "A powerful fire-based trading card",
        image: "/placeholder.svg?height=300&width=300",
        rarity: "rare",
        type: "fire",
        attributes: [
          { trait_type: "Element", value: "Fire" },
          { trait_type: "Power", value: "85" },
          { trait_type: "Defense", value: "70" },
        ],
      },
      {
        id: "card_2",
        name: "Water Spirit",
        description: "A mystical water-based trading card",
        image: "/placeholder.svg?height=300&width=300",
        rarity: "common",
        type: "water",
        attributes: [
          { trait_type: "Element", value: "Water" },
          { trait_type: "Power", value: "60" },
          { trait_type: "Defense", value: "90" },
        ],
      },
    ],
  }

  if (type === "all") {
    return [...mockNFTs.achievements, ...mockNFTs.pets, ...mockNFTs.cards]
  }

  return mockNFTs[type] || []
}

export function useNFTs(type: "achievements" | "pets" | "cards" | "all") {
  const { user, isAuthenticated } = useAuth()

  const { data, loading, error, refetch } = useQuery({
    queryKey: ["nfts", user?.id, type],
    queryFn: () => fetchUserNFTs(user!.id, type),
    enabled: isAuthenticated && !!user,
  })

  // Separate the data by type for easier access
  const achievements =
    type === "achievements" || type === "all"
      ? data?.filter((nft) => nft.type === "achievement")
      : type === "achievements"
        ? data
        : undefined

  const pets =
    type === "pets" || type === "all" ? data?.filter((nft) => nft.type === "pet") : type === "pets" ? data : undefined

  const cards =
    type === "cards" || type === "all"
      ? data?.filter((nft) => nft.type && ["fire", "water", "earth", "air"].includes(nft.type))
      : type === "cards"
        ? data
        : undefined

  return {
    achievements,
    pets,
    cards,
    loading,
    error,
    refetch,
  }
}
