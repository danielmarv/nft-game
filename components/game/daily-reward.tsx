"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Clock } from "lucide-react"

interface DailyRewardProps {
  available: boolean
  onClaim: () => void
  loading: boolean
}

export function DailyReward({ available, onClaim, loading }: DailyRewardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Gift className="h-5 w-5 mr-2" />
          Daily Reward
        </CardTitle>
        <CardDescription>
          {available ? "Your daily reward is ready!" : "Come back tomorrow for your next reward"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
              available ? "bg-gradient-to-br from-yellow-400 to-orange-500" : "bg-muted"
            }`}
          >
            {available ? <Gift className="h-8 w-8 text-white" /> : <Clock className="h-8 w-8 text-muted-foreground" />}
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {available ? "Claim your daily card pack!" : "Next reward in 12h 34m"}
          </p>
          <Button size="sm" className="w-full" disabled={!available || loading} onClick={onClaim}>
            {loading ? "Claiming..." : available ? "Claim Reward" : "Not Available"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
