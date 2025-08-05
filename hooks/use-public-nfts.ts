"use client"

import { useQuery } from "@tanstack/react-query"

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

// Mock API function for fetching public NFTs by account ID
const fetchPublicNFTs = async (
  accountId: string,
): Promise<{
  achievements: NFT[]
  pets: NFT[]
  cards: NFT[]
}> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock validation
  if (!accountId.match(/^0\.0\.\d+$/)) {
    throw new Error("Invalid Hedera account ID format")
  }

  // Mock data - in real app, this would fetch from Hedera Mirror Node API
  return {
    achievements: [
      {
        id: "pub_achievement_1",
        name: "Pet Master",
        description: "Achieved mastery in pet care",
        image: "/placeholder.svg?height=300&width=300",
        rarity: "legendary",
        type: "achievement",
      },
      {
        id: "pub_achievement_2",
        name: "Card Collector",
        description: "Collected 50 unique cards",
        image: "/placeholder.svg?height=300&width=300",
        rarity: "epic",
        type: "achievement",
      },
    ],
    pets: [
      {
        id: "pub_pet_1",
        name: "Golden Phoenix",
        description: "A rare golden phoenix companion",
        image: "/placeholder.svg?height=300&width=300",
        rarity: "legendary",
        type: "pet",
      },
    ],
    cards: [
      {
        id: "pub_card_1",
        name: "Lightning Strike",
        description: "A powerful lightning attack card",
        image: "/placeholder.svg?height=300&width=300",
        rarity: "epic",
        type: "air",
      },
      {
        id: "pub_card_2",
        name: "Earth Shield",
        description: "A defensive earth-based card",
        image: "/placeholder.svg?height=300&width=300",
        rarity: "rare",
        type: "earth",
      },
    ],
  }
}

export function usePublicNFTs(accountId: string | null) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["public-nfts", accountId],
    queryFn: () => fetchPublicNFTs(accountId!),
    enabled: !!accountId,
    retry: 1,
  })

  return {
    achievements: data?.achievements,
    pets: data?.pets,
    cards: data?.cards,
    loading: isLoading,
    error: error?.message,
  }
}
