"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gift, Trophy, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CardGallery } from "@/components/game/card-gallery"
import { DailyReward } from "@/components/game/daily-reward"
import { useAuth } from "@/hooks/use-auth"
import { useNFTs } from "@/hooks/use-nfts"
import { useCardGame } from "@/hooks/use-card-game"
import { toast } from "@/hooks/use-toast"

export default function Game2Page() {
  const { isAuthenticated } = useAuth()
  const { cards, loading: cardsLoading, refetch: refetchCards } = useNFTs("cards")
  const { checkDailyReward, claimDailyReward, checkAchievements, loading: gameLoading } = useCardGame()

  const [filterRarity, setFilterRarity] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [dailyRewardAvailable, setDailyRewardAvailable] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      checkDailyReward().then(setDailyRewardAvailable)
      checkAchievements().then((achievements) => {
        if (achievements.length > 0) {
          achievements.forEach((achievement) => {
            toast({
              title: "Achievement Unlocked! 🏆",
              description: `You've earned: ${achievement.name}`,
            })
          })
          refetchCards()
        }
      })
    }
  }, [isAuthenticated, checkDailyReward, checkAchievements, refetchCards])

  const handleClaimDailyReward = async () => {
    try {
      const result = await claimDailyReward()
      toast({
        title: "Daily Reward Claimed! 🎁",
        description: `You received: ${result.cardName}`,
      })
      setDailyRewardAvailable(false)
      refetchCards()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to claim daily reward. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredCards =
    cards?.filter((card) => {
      const rarityMatch = filterRarity === "all" || card.rarity === filterRarity
      const typeMatch = filterType === "all" || card.type === filterType
      return rarityMatch && typeMatch
    }) || []

  const cardStats = cards
    ? {
        total: cards.length,
        common: cards.filter((c) => c.rarity === "common").length,
        rare: cards.filter((c) => c.rarity === "rare").length,
        epic: cards.filter((c) => c.rarity === "epic").length,
        legendary: cards.filter((c) => c.rarity === "legendary").length,
      }
    : null

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access the Trading Card Game.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (cardsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your card collection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-500/5">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Trading Card Game</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">Game 2</Badge>
            {dailyRewardAvailable && (
              <Badge variant="default" className="animate-pulse">
                <Gift className="h-3 w-3 mr-1" />
                Reward Available
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Daily Reward */}
            <DailyReward available={dailyRewardAvailable} onClaim={handleClaimDailyReward} loading={gameLoading} />

            {/* Collection Stats */}
            {cardStats && (
              <Card>
                <CardHeader>
                  <CardTitle>Collection Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Cards:</span>
                    <Badge variant="outline">{cardStats.total}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Common:</span>
                      <span>{cardStats.common}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Rare:</span>
                      <span>{cardStats.rare}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Epic:</span>
                      <span>{cardStats.epic}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Legendary:</span>
                      <span>{cardStats.legendary}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Achievement Goals */}
            <Card className="border-yellow-500/20 bg-yellow-500/5">
              <CardHeader>
                <CardTitle className="text-yellow-600 dark:text-yellow-400">
                  <Trophy className="h-5 w-5 mr-2 inline" />
                  Achievement Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Collect 4 matching cards</p>
                <p>• Collect 3 different colors</p>
                <p>• Complete daily challenges</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="gallery" className="w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <TabsList>
                  <TabsTrigger value="gallery">Card Gallery</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>

                {/* Filters */}
                <div className="flex gap-2">
                  <Select value={filterRarity} onValueChange={setFilterRarity}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Rarity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rarities</SelectItem>
                      <SelectItem value="common">Common</SelectItem>
                      <SelectItem value="rare">Rare</SelectItem>
                      <SelectItem value="epic">Epic</SelectItem>
                      <SelectItem value="legendary">Legendary</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="fire">Fire</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="earth">Earth</SelectItem>
                      <SelectItem value="air">Air</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="gallery">
                <CardGallery cards={filteredCards} />
              </TabsContent>

              <TabsContent value="achievements">
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Master Achievements</CardTitle>
                      <CardDescription>Complete these challenges to earn special achievement NFTs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">Set Collector</h4>
                          <p className="text-sm text-muted-foreground">Collect 4 matching cards</p>
                        </div>
                        <Badge variant="outline">In Progress</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">Rainbow Master</h4>
                          <p className="text-sm text-muted-foreground">Collect 3 different colored cards</p>
                        </div>
                        <Badge variant="outline">In Progress</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">Daily Devotee</h4>
                          <p className="text-sm text-muted-foreground">Claim 7 daily rewards</p>
                        </div>
                        <Badge variant="outline">In Progress</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
