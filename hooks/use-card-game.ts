"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "./use-auth"

interface DailyRewardResult {
  cardName: string
  rarity: string
}

interface Achievement {
  id: string
  name: string
  description: string
}

// Mock API functions
const checkDailyRewardAPI = async (userId: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock check - in real app, check backend for last claim time
  const lastClaim = localStorage.getItem(`daily_claim_${userId}`)
  if (!lastClaim) return true

  const lastClaimDate = new Date(lastClaim)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return lastClaimDate < today
}

const claimDailyRewardAPI = async (userId: string): Promise<DailyRewardResult> => {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock reward
  const cards = [
    { name: "Fire Bolt", rarity: "common" },
    { name: "Ice Shard", rarity: "common" },
    { name: "Lightning Strike", rarity: "rare" },
    { name: "Earth Quake", rarity: "epic" },
  ]

  const reward = cards[Math.floor(Math.random() * cards.length)]

  // Store claim time
  localStorage.setItem(`daily_claim_${userId}`, new Date().toISOString())

  return reward
}

const checkAchievementsAPI = async (userId: string): Promise<Achievement[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock achievement check - in real app, backend would check conditions
  const achievements: Achievement[] = []

  // Random chance for demo purposes
  if (Math.random() > 0.7) {
    achievements.push({
      id: "set_collector",
      name: "Set Collector",
      description: "Collected 4 matching cards",
    })
  }

  return achievements
}

export function useCardGame() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const dailyRewardMutation = useMutation({
    mutationFn: () => claimDailyRewardAPI(user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nfts", user?.id] })
    },
  })

  const checkDailyReward = async (): Promise<boolean> => {
    if (!user) return false
    return checkDailyRewardAPI(user.id)
  }

  const claimDailyReward = dailyRewardMutation.mutateAsync

  const checkAchievements = async (): Promise<Achievement[]> => {
    if (!user) return []
    return checkAchievementsAPI(user.id)
  }

  return {
    checkDailyReward,
    claimDailyReward,
    checkAchievements,
    loading: dailyRewardMutation.isPending,
  }
}
