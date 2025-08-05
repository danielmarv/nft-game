"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gift, Clock } from "lucide-react"

interface DailyRewardProps {
  available: boolean
  onClaim: () => Promise<void>
  loading: boolean
}

export function DailyReward({ available, onClaim, loading }: DailyRewardProps) {
  const getTimeUntilNextReward = () => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const diff = tomorrow.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  return (
    <Card className={available ? "border-green-500/20 bg-green-500/5" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Gift className="h-5 w-5 mr-2" />
          Daily Reward
          {available && (
            <Badge variant="default" className="ml-2 animate-pulse">
              Available!
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {available ? "Claim your daily card reward!" : "Come back tomorrow for your next reward"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {available ? (
          <Button onClick={onClaim} disabled={loading} className="w-full">
            {loading ? "Claiming..." : "Claim Reward"}
          </Button>
        ) : (
          <div className="text-center">
            <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Next reward in: {getTimeUntilNextReward()}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
