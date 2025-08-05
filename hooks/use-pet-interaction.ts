"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "./use-auth"

interface PetStats {
  hugCount: number
  feedCount: number
  lastInteraction: string
}

interface InteractionResult {
  hugCount: number
  feedCount: number
  achievementEarned?: boolean
}

// Mock API functions
const fetchPetStats = async (userId: string, petId: string): Promise<PetStats> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock stats - in real app, fetch from backend
  return {
    hugCount: Math.floor(Math.random() * 8), // Random between 0-7 for demo
    feedCount: Math.floor(Math.random() * 15),
    lastInteraction: new Date().toISOString(),
  }
}

const hugPetAPI = async (userId: string, petId: string): Promise<InteractionResult> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock response - in real app, call backend endpoint
  const newHugCount = Math.floor(Math.random() * 10) + 1
  return {
    hugCount: newHugCount,
    feedCount: Math.floor(Math.random() * 15),
    achievementEarned: newHugCount >= 10,
  }
}

const feedPetAPI = async (userId: string, petId: string): Promise<InteractionResult> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock response
  return {
    hugCount: Math.floor(Math.random() * 10),
    feedCount: Math.floor(Math.random() * 20) + 1,
  }
}

export function usePetInteraction(petId: string | null) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: petStats, refetch } = useQuery({
    queryKey: ["pet-stats", user?.id, petId],
    queryFn: () => fetchPetStats(user!.id, petId!),
    enabled: !!user && !!petId,
  })

  const hugMutation = useMutation({
    mutationFn: () => hugPetAPI(user!.id, petId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pet-stats", user?.id, petId] })
      queryClient.invalidateQueries({ queryKey: ["nfts", user?.id] })
    },
  })

  const feedMutation = useMutation({
    mutationFn: () => feedPetAPI(user!.id, petId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pet-stats", user?.id, petId] })
    },
  })

  return {
    petStats,
    hugPet: hugMutation.mutateAsync,
    feedPet: feedMutation.mutateAsync,
    loading: hugMutation.isPending || feedMutation.isPending,
    refetch,
  }
}
