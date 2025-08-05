"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Cookie, Trophy, ArrowLeft, Sparkles, Star } from "lucide-react"
import Link from "next/link"
import { PetViewer } from "@/components/3d/pet-viewer"
import { PetSelector } from "@/components/game/pet-selector"
import { useAuth } from "@/hooks/use-auth"
import { useNFTs } from "@/hooks/use-nfts"
import { usePetInteraction } from "@/hooks/use-pet-interaction"
import { toast } from "@/hooks/use-toast"

export default function Game1Page() {
  const { isAuthenticated } = useAuth()
  const { pets, loading: petsLoading, refetch: refetchPets } = useNFTs("pets")
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)
  const { petStats, hugPet, feedPet, loading: actionLoading, refetch: refetchStats } = usePetInteraction(selectedPetId)

  useEffect(() => {
    if (pets && pets.length > 0 && !selectedPetId) {
      setSelectedPetId(pets[0].id)
    }
  }, [pets, selectedPetId])

  const handleHug = async () => {
    if (!selectedPetId) return

    try {
      const result = await hugPet()
      if (result.achievementEarned) {
        toast({
          title: "🏆 Achievement Unlocked!",
          description: (
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>You've earned the 'Pet Lover' achievement NFT!</span>
            </div>
          ),
        })
      }
      toast({
        title: "🤗 Pet Hugged!",
        description: (
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span>Your pet feels loved! Hugs: {result.hugCount}/10</span>
          </div>
        ),
      })
      refetchStats()
      refetchPets()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to hug pet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFeed = async () => {
    if (!selectedPetId) return

    try {
      const result = await feedPet()
      toast({
        title: "🍪 Pet Fed!",
        description: (
          <div className="flex items-center space-x-2">
            <Cookie className="h-4 w-4 text-orange-500" />
            <span>Your pet is happy and well-fed! Fed: {result.feedCount} times</span>
          </div>
        ),
      })
      refetchStats()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to feed pet. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-green-500/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-md border-2 border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Authentication Required</CardTitle>
              <CardDescription>
                Please log in to access the Pet Adventure game and start your magical journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <Link href="/">
                  <Star className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (petsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-green-500/5">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
            <div
              className="absolute inset-0 rounded-full h-16 w-16 border-t-4 border-green-500 animate-spin mx-auto"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            ></div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Summoning your pets...</h3>
          <p className="text-muted-foreground">Preparing the magical realm</p>
        </motion.div>
      </div>
    )
  }

  const petLevel = petStats ? Math.floor((petStats.hugCount + petStats.feedCount) / 5) + 1 : 1
  const happiness = petStats ? Math.min(100, (petStats.hugCount + petStats.feedCount) * 5) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-500/5">
      {/* Enhanced Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Pet Adventure
              </h1>
              <p className="text-sm text-muted-foreground">Care for your magical companions</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20"
            >
              Game 1
            </Badge>
            {petStats && (
              <Badge variant="outline" className="border-yellow-500/30 text-yellow-600 dark:text-yellow-400">
                <Star className="h-3 w-3 mr-1" />
                Level {petLevel}
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enhanced Pet Viewer */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card className="h-[600px] overflow-hidden border-2 border-primary/10 bg-gradient-to-br from-card to-card/50">
                <CardHeader className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-b border-border/40">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <span>Your Magical Pet</span>
                    </div>
                    {petStats && (
                      <Badge
                        variant="outline"
                        className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Level {petLevel}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full p-0 relative">
                  <PetViewer petId={selectedPetId} className="w-full h-full rounded-b-lg" />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Enhanced Controls & Stats */}
          <div className="space-y-6">
            {/* Pet Selection */}
            {pets && pets.length > 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <div className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mr-2"></div>
                      Select Pet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PetSelector pets={pets} selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Enhanced Pet Stats */}
            {petStats && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-primary" />
                      Pet Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-1 text-red-500" />
                          Hugs Progress
                        </span>
                        <span className="font-semibold">{petStats.hugCount}/10</span>
                      </div>
                      <Progress value={(petStats.hugCount / 10) * 100} className="h-3" />
                      {petStats.hugCount >= 10 && (
                        <Badge
                          variant="secondary"
                          className="mt-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30"
                        >
                          <Trophy className="h-3 w-3 mr-1 text-yellow-600" />
                          Achievement Ready!
                        </Badge>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="flex items-center">
                          <Cookie className="h-4 w-4 mr-1 text-orange-500" />
                          Times Fed
                        </span>
                        <span className="font-semibold">{petStats.feedCount}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="flex items-center">
                          <Sparkles className="h-4 w-4 mr-1 text-blue-500" />
                          Happiness
                        </span>
                        <span className="font-semibold">{happiness}%</span>
                      </div>
                      <Progress value={happiness} className="h-3" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Enhanced Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-green-500 to-blue-500 mr-2"></div>
                    Pet Actions
                  </CardTitle>
                  <CardDescription>Interact with your pet to increase happiness and earn rewards!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleHug}
                    disabled={actionLoading}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0"
                    size="lg"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    {actionLoading ? "Hugging..." : "Give Hug"}
                  </Button>

                  <Button
                    onClick={handleFeed}
                    disabled={actionLoading}
                    variant="outline"
                    className="w-full bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/30 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-yellow-500/20"
                    size="lg"
                  >
                    <Cookie className="mr-2 h-5 w-5 text-orange-500" />
                    {actionLoading ? "Feeding..." : "Feed Pet"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Achievement Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
                <CardHeader>
                  <CardTitle className="text-yellow-600 dark:text-yellow-400 flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Achievement Goal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Give your pet 10 hugs to earn the "Pet Lover" achievement NFT!
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-yellow-600 dark:text-yellow-400">
                    <Sparkles className="h-3 w-3" />
                    <span>Exclusive NFT reward awaits!</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
