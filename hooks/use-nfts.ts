"use client"

import { useQuery } from "@tanstack/react-query"
import { useUser } from "@stackframe/stack" // Using useUser from StackAuth
import { toast } from "@/hooks/use-toast"

interface NFT {
  id: string
  name: string
  description: string
  image: string // Changed from imageUrl to image to match mock data
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
        image: "/placeholder.svg?height=300&width=300&text=Achievement 1",
        rarity: "rare",
        type: "achievement",
        attributes: [
          { trait_type: "Category", value: "Pet Care" },
          { trait_type: "Difficulty", value: "Easy" },
        ],
      },
      {
        id: "achievement_2",
        name: "Card Master",
        description: "Awarded for winning 5 card battles",
        image: "/placeholder.svg?height=300&width=300&text=Achievement 2",
        rarity: "epic",
        type: "achievement",
        attributes: [
          { trait_type: "Category", value: "Gaming" },
          { trait_type: "Difficulty", value: "Medium" },
        ],
      },
    ],
    pets: [
      {
        id: "pet_1",
        name: "Fluffy Dragon",
        description: "A cute and friendly dragon companion",
        image: "/placeholder.svg?height=300&width=300&text=Fluffy Dragon",
        rarity: "epic",
        type: "pet",
        attributes: [
          { trait_type: "Species", value: "Dragon" },
          { trait_type: "Color", value: "#8A2BE2" }, // BlueViolet
          { trait_type: "Level", value: "5" },
        ],
      },
      {
        id: "pet_2",
        name: "Sparkle Unicorn",
        description: "A majestic unicorn with a shimmering mane",
        image: "/placeholder.svg?height=300&width=300&text=Sparkle Unicorn",
        rarity: "legendary",
        type: "pet",
        attributes: [
          { trait_type: "Species", value: "Unicorn" },
          { trait_type: "Color", value: "#FF69B4" }, // HotPink
          { trait_type: "Level", value: "7" },
        ],
      },
      {
        id: "pet_3",
        name: "Glimmer Golem",
        description: "A sturdy golem made of enchanted crystals",
        image: "/placeholder.svg?height=300&width=300&text=Glimmer Golem",
        rarity: "rare",
        type: "pet",
        attributes: [
          { trait_type: "Species", value: "Golem" },
          { trait_type: "Color", value: "#00CED1" }, // DarkTurquoise
          { trait_type: "Level", value: "3" },
        ],
      },
    ],
    cards: [
      {
        id: "card_1",
        name: "Fire Elemental",
        description: "A powerful fire-based trading card",
        image: "/placeholder.svg?height=300&width=200&text=Fire Card",
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
        image: "/placeholder.svg?height=300&width=200&text=Water Card",
        rarity: "common",
        type: "water",
        attributes: [
          { trait_type: "Element", value: "Water" },
          { trait_type: "Power", value: "60" },
          { trait_type: "Defense", value: "90" },
        ],
      },
      {
        id: "card_3",
        name: "Earth Guardian",
        description: "A resilient earth-based trading card",
        image: "/placeholder.svg?height=300&width=200&text=Earth Card",
        rarity: "epic",
        type: "earth",
        attributes: [
          { trait_type: "Element", value: "Earth" },
          { trait_type: "Power", value: "75" },
          { trait_type: "Defense", value: "95" },
        ],
      },
      {
        id: "card_4",
        name: "Air Weaver",
        description: "A swift air-based trading card",
        image: "/placeholder.svg?height=300&width=200&text=Air Card",
        rarity: "rare",
        type: "air",
        attributes: [
          { trait_type: "Element", value: "Air" },
          { trait_type: "Power", value: "90" },
          { trait_type: "Defense", value: "65" },
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
  const user = useUser() // Get user from StackAuth

  const { data, isLoading, error, refetch } = useQuery<NFT[], Error>({
    queryKey: ["nfts", user?.id, type],
    queryFn: () => fetchUserNFTs(user!.id, type),
    enabled: user?.isSignedIn && !!user?.id, // Only fetch if user is signed in and has an ID
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
    onError: (err) => {
      toast({
        title: "Error fetching NFTs",
        description: err.message || "Failed to load NFT data.",
        variant: "destructive",
      })
    },
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
    isLoading,
    error,
    refetch,
  }
}
