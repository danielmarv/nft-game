"use client"

import { useQuery } from "@tanstack/react-query"
import { toast } from "@/hooks/use-toast"

interface PublicNFT {
  id: string
  name: string
  description: string
  imageUrl: string
  price: string
  owner: string
}

// Mock API function for fetching public NFTs
const fetchPublicNFTs = async (): Promise<PublicNFT[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return [
    {
      id: "public_nft_1",
      name: "Cosmic Shard",
      description: "A fragment of a fallen star, radiating ancient energy.",
      imageUrl: "/placeholder.svg?height=400&width=300&text=Cosmic Shard",
      price: "0.5",
      owner: "0xabc...123",
    },
    {
      id: "public_nft_2",
      name: "Enchanted Scroll",
      description: "Contains forgotten spells and powerful incantations.",
      imageUrl: "/placeholder.svg?height=400&width=300&text=Enchanted Scroll",
      price: "1.2",
      owner: "0xdef...456",
    },
    {
      id: "public_nft_3",
      name: "Guardian's Amulet",
      description: "Protects its wearer from dark magic.",
      imageUrl: "/placeholder.svg?height=400&width=300&text=Guardian Amulet",
      price: "0.8",
      owner: "0xghi...789",
    },
    {
      id: "public_nft_4",
      name: "Whispering Blade",
      description: "A legendary sword that whispers secrets to its wielder.",
      imageUrl: "/placeholder.svg?height=400&width=300&text=Whispering Blade",
      price: "2.0",
      owner: "0xjkl...012",
    },
  ]
}

export function usePublicNfts() {
  const { data, isLoading, error, refetch } = useQuery<PublicNFT[], Error>({
    queryKey: ["publicNfts"],
    queryFn: fetchPublicNFTs,
    staleTime: 1000 * 60 * 10, // Data considered fresh for 10 minutes
    onError: (err) => {
      toast({
        title: "Error fetching public NFTs",
        description: err.message || "Failed to load public NFT data.",
        variant: "destructive",
      })
    },
  })

  return {
    publicNfts: data,
    isLoading,
    error,
    refetch,
  }
}
