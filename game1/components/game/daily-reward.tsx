"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import Confetti from "@/components/ui/confetti"
import { useUser } from "@stackframe/stack"

interface DailyReward {
  day: number
  reward: string
  claimed: boolean
}

const mockRewards: DailyReward[] = [
  { day: 1, reward: "100 Gold", claimed: false },
  { day: 2, reward: "1x Common Card Pack", claimed: false },
  { day: 3, reward: "200 Gold", claimed: false },
  { day: 4, reward: "1x Uncommon Card Pack", claimed: false },
  { day: 5, reward: "300 Gold", claimed: false },
  { day: 6, reward: "1x Rare Card Pack", claimed: false },
  { day: 7, reward: "500 Gold + Bonus Item", claimed: false },
]

export function DailyReward() {
  const { isSignedIn } = useUser()
  const [rewards, setRewards] = useState<DailyReward[]>(mockRewards)
  const [currentDay, setCurrentDay] = useState(1) // Simulate current day
  const [showConfetti, setShowConfetti] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    // In a real app, fetch actual user's daily reward status from backend
    // For now, simulate loading from local storage or initial state
    const savedRewards = localStorage.getItem("dailyRewards")
    const savedDay = localStorage.getItem("currentDailyRewardDay")

    if (savedRewards) {
      setRewards(JSON.parse(savedRewards))
    }
    if (savedDay) {
      setCurrentDay(Number.parseInt(savedDay))
    }
  }, [])

  const handleClaimReward = (day: number) => {
    if (!isSignedIn) {
      toast({
        title: "Not Signed In",
        description: "Please sign in to claim your daily rewards.",
        variant: "destructive",
      })
      return
    }

    const rewardToClaim = rewards.find((r) => r.day === day)

    if (rewardToClaim && !rewardToClaim.claimed && day === currentDay) {
      // Simulate claiming reward
      const updatedRewards = rewards.map((r) => (r.day === day ? { ...r, claimed: true } : r))
      setRewards(updatedRewards)
      localStorage.setItem("dailyRewards", JSON.stringify(updatedRewards))

      toast({
        title: "Reward Claimed!",
        description: `You claimed ${rewardToClaim.reward} for Day ${day}.`,
        duration: 3000,
      })

      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000) // Hide confetti after 3 seconds

      // Move to next day (in a real app, this would be based on server time/logic)
      if (currentDay < mockRewards.length) {
        setCurrentDay(currentDay + 1)
        localStorage.setItem("currentDailyRewardDay", (currentDay + 1).toString())
      } else {
        // Reset for next week/cycle
        setCurrentDay(1)
        localStorage.setItem("currentDailyRewardDay", "1")
        setRewards(mockRewards.map((r) => ({ ...r, claimed: false })))
        localStorage.removeItem("dailyRewards")
      }
      setIsDialogOpen(false) // Close dialog after claiming
    } else if (rewardToClaim?.claimed) {
      toast({
        title: "Already Claimed",
        description: `You have already claimed the reward for Day ${day}.`,
        variant: "default",
      })
    } else if (day > currentDay) {
      toast({
        title: "Reward Not Available",
        description: `You can only claim rewards for Day ${currentDay} or earlier.`,
        variant: "destructive",
      })
    }
  }

  const progressValue = (currentDay / mockRewards.length) * 100

  return (
    <Card className="w-full max-w-2xl mx-auto">
      {showConfetti && <Confetti />}
      <CardHeader className="text-center">
        <CardTitle>Daily Rewards</CardTitle>
        <CardDescription>Claim your daily login bonuses!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Current Day: {currentDay}</p>
          <Progress value={progressValue} className="w-2/3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {rewards.map((reward) => (
            <Card
              key={reward.day}
              className={`text-center ${
                reward.day === currentDay && !reward.claimed
                  ? "border-primary ring-2 ring-primary"
                  : reward.claimed
                    ? "opacity-70"
                    : "border-dashed"
              }`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Day {reward.day}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium">{reward.reward}</p>
                <Button
                  size="sm"
                  onClick={() => handleClaimReward(reward.day)}
                  disabled={reward.claimed || reward.day > currentDay || !isSignedIn}
                >
                  {reward.claimed ? "Claimed" : "Claim"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mt-4">View All Rewards</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>All Daily Rewards</DialogTitle>
              <DialogDescription>Here's a list of all the rewards you can claim.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4 max-h-[400px] overflow-y-auto">
              {mockRewards.map((reward) => (
                <div key={reward.day} className="flex items-center justify-between p-3 border rounded-md">
                  <span className="font-medium">Day {reward.day}:</span>
                  <span>{reward.reward}</span>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
