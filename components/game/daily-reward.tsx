"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Gift, Calendar, Star, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface DailyReward {
  day: number
  reward: {
    type: "coins" | "gems" | "card" | "booster"
    amount?: number
    name?: string
    rarity?: string
  }
  claimed: boolean
}

interface DailyRewardProps {
  currentStreak: number
  maxStreak: number
  lastClaimDate?: string
  onClaimReward: (day: number) => Promise<void>
}

export function DailyReward({ currentStreak, maxStreak, lastClaimDate, onClaimReward }: DailyRewardProps) {
  const [timeUntilReset, setTimeUntilReset] = useState("")
  const [canClaim, setCanClaim] = useState(false)

  const rewards: DailyReward[] = [
    { day: 1, reward: { type: "coins", amount: 100 }, claimed: currentStreak >= 1 },
    { day: 2, reward: { type: "gems", amount: 10 }, claimed: currentStreak >= 2 },
    { day: 3, reward: { type: "coins", amount: 200 }, claimed: currentStreak >= 3 },
    { day: 4, reward: { type: "card", name: "Fire Spell", rarity: "rare" }, claimed: currentStreak >= 4 },
    { day: 5, reward: { type: "gems", amount: 25 }, claimed: currentStreak >= 5 },
    { day: 6, reward: { type: "booster", name: "Premium Pack" }, claimed: currentStreak >= 6 },
    { day: 7, reward: { type: "card", name: "Legendary Dragon", rarity: "legendary" }, claimed: currentStreak >= 7 },
  ]

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const diff = tomorrow.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      setTimeUntilReset(`${hours}h ${minutes}m`)

      // Check if user can claim today's reward
      const lastClaim = lastClaimDate ? new Date(lastClaimDate) : null
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (!lastClaim || lastClaim < today) {
        setCanClaim(true)
      } else {
        setCanClaim(false)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [lastClaimDate])

  const handleClaimReward = async (day: number) => {
    try {
      await onClaimReward(day)
      const reward = rewards[day - 1].reward

      let message = ""
      if (reward.type === "coins") {
        message = `You received ${reward.amount} coins!`
      } else if (reward.type === "gems") {
        message = `You received ${reward.amount} gems!`
      } else if (reward.type === "card") {
        message = `You received a ${reward.rarity} card: ${reward.name}!`
      } else if (reward.type === "booster") {
        message = `You received a ${reward.name}!`
      }

      toast({
        title: "Daily Reward Claimed!",
        description: message,
      })
    } catch (error) {
      toast({
        title: "Failed to claim reward",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "coins":
        return "🪙"
      case "gems":
        return "💎"
      case "card":
        return "🃏"
      case "booster":
        return "📦"
      default:
        return "🎁"
    }
  }

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-500"
      case "rare":
        return "text-blue-500"
      case "epic":
        return "text-purple-500"
      case "legendary":
        return "text-yellow-500"
      default:
        return "text-foreground"
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-2xl">Daily Rewards</CardTitle>
              <CardDescription>Claim your daily rewards to maintain your streak!</CardDescription>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{currentStreak} day streak</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Resets in {timeUntilReset}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Streak Progress</span>
            <span>
              {currentStreak}/{maxStreak}
            </span>
          </div>
          <Progress value={(currentStreak / maxStreak) * 100} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
          {rewards.map((reward) => (
            <Card
              key={reward.day}
              className={`relative transition-all duration-300 ${
                reward.claimed
                  ? "bg-muted/50 border-green-500/50"
                  : reward.day === currentStreak + 1 && canClaim
                    ? "border-primary shadow-lg scale-105"
                    : "hover:shadow-md"
              }`}
            >
              <CardHeader className="pb-2 text-center">
                <div className="text-lg font-bold">Day {reward.day}</div>
                {reward.claimed && <Badge className="absolute -top-2 -right-2 bg-green-500">✓</Badge>}
              </CardHeader>

              <CardContent className="text-center space-y-3">
                <div className="text-3xl">{getRewardIcon(reward.reward.type)}</div>

                <div className="space-y-1">
                  {reward.reward.type === "coins" && (
                    <div>
                      <div className="font-medium">{reward.reward.amount} Coins</div>
                    </div>
                  )}

                  {reward.reward.type === "gems" && (
                    <div>
                      <div className="font-medium">{reward.reward.amount} Gems</div>
                    </div>
                  )}

                  {reward.reward.type === "card" && (
                    <div>
                      <div className={`font-medium ${getRarityColor(reward.reward.rarity)}`}>{reward.reward.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{reward.reward.rarity} Card</div>
                    </div>
                  )}

                  {reward.reward.type === "booster" && (
                    <div>
                      <div className="font-medium">{reward.reward.name}</div>
                      <div className="text-xs text-muted-foreground">Booster Pack</div>
                    </div>
                  )}
                </div>

                {reward.day === currentStreak + 1 && canClaim && !reward.claimed && (
                  <Button onClick={() => handleClaimReward(reward.day)} className="w-full" size="sm">
                    <Gift className="h-4 w-4 mr-1" />
                    Claim
                  </Button>
                )}

                {reward.claimed && <div className="text-xs text-green-600 font-medium">Claimed</div>}

                {reward.day > currentStreak + 1 && <div className="text-xs text-muted-foreground">Locked</div>}
              </CardContent>
            </Card>
          ))}
        </div>

        {currentStreak === maxStreak && (
          <div className="mt-6 text-center p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-yellow-600 dark:text-yellow-400">Perfect Week!</h3>
            <p className="text-sm text-muted-foreground">You've completed a full week of daily rewards. Keep it up!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
