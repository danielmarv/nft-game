"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Star, Heart, Zap, Coins, Crown, Sparkles, Gift, Gamepad2, Users, Award } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { EnhancedPetModel } from "./pet-model"

interface NFTPet {
  id: string
  name: string
  type: "Dragon" | "Unicorn" | "Phoenix" | "Griffin" | "Pegasus"
  rarity: "Common" | "Rare" | "Epic" | "Legendary" | "Mythic"
  level: number
  experience: number
  stats: {
    happiness: number
    energy: number
    strength: number
    magic: number
    speed: number
  }
  traits: string[]
  value: number
  breeding: {
    canBreed: boolean
    cooldown: number
  }
}

const ENHANCED_PETS: NFTPet[] = [
  {
    id: "1",
    name: "Ember",
    type: "Dragon",
    rarity: "Legendary",
    level: 18,
    experience: 850,
    stats: { happiness: 88, energy: 92, strength: 98, magic: 90, speed: 75 },
    traits: ["Fire Breath", "Ancient Wisdom", "Treasure Guardian", "Battle Fury"],
    value: 3.2,
    breeding: { canBreed: true, cooldown: 0 },
  },
  {
    id: "2",
    name: "Stardust",
    type: "Unicorn",
    rarity: "Epic",
    level: 15,
    experience: 720,
    stats: { happiness: 98, energy: 88, strength: 65, magic: 100, speed: 88 },
    traits: ["Healing Aura", "Pure Heart", "Rainbow Mane", "Celestial Magic"],
    value: 2.1,
    breeding: { canBreed: true, cooldown: 0 },
  },
  {
    id: "3",
    name: "Blaze",
    type: "Phoenix",
    rarity: "Mythic",
    level: 25,
    experience: 1200,
    stats: { happiness: 95, energy: 100, strength: 90, magic: 98, speed: 95 },
    traits: ["Rebirth", "Solar Flare", "Eternal Flame", "Phoenix Rising", "Immortal Spirit"],
    value: 7.8,
    breeding: { canBreed: false, cooldown: 48 },
  },
  {
    id: "4",
    name: "Storm",
    type: "Griffin",
    rarity: "Rare",
    level: 10,
    experience: 450,
    stats: { happiness: 80, energy: 85, strength: 88, magic: 70, speed: 92 },
    traits: ["Wind Walker", "Eagle Eye", "Lion's Courage"],
    value: 1.4,
    breeding: { canBreed: true, cooldown: 0 },
  },
]

const ENHANCED_ACHIEVEMENTS = [
  {
    id: 1,
    name: "First Bond",
    description: "Form your first connection with a pet",
    unlocked: true,
    reward: 150,
    icon: Heart,
  },
  {
    id: 2,
    name: "Master Breeder",
    description: "Successfully breed 10 unique pets",
    unlocked: false,
    reward: 750,
    icon: Users,
  },
  {
    id: 3,
    name: "Battle Champion",
    description: "Win 25 battles in the arena",
    unlocked: false,
    reward: 1500,
    icon: Trophy,
  },
  {
    id: 4,
    name: "Legendary Collector",
    description: "Own 5 Legendary or Mythic pets",
    unlocked: false,
    reward: 3000,
    icon: Crown,
  },
  {
    id: 5,
    name: "Pet Whisperer",
    description: "Reach max happiness with 5 pets",
    unlocked: true,
    reward: 500,
    icon: Sparkles,
  },
  { id: 6, name: "Arena Master", description: "Achieve a 20-win streak", unlocked: false, reward: 2500, icon: Award },
]

export default function PremiumNFTPetGame() {
  const [pets] = useState<NFTPet[]>(ENHANCED_PETS)
  const [selectedPet, setSelectedPet] = useState<NFTPet>(ENHANCED_PETS[0])
  const [activeTab, setActiveTab] = useState("game")
  const [coins, setCoins] = useState(2150)
  const [lastInteraction, setLastInteraction] = useState<string | null>(null)
  const [isInteracting, setIsInteracting] = useState(false)
  const [playerLevel, setPlayerLevel] = useState(12)
  const [playerExp, setPlayerExp] = useState(680)

  const interact = useCallback(
    (action: "hug" | "feed" | "play" | "train" | "battle") => {
      let coinsEarned = 0
      let expGained = 0

      setIsInteracting(true)
      setTimeout(() => setIsInteracting(false), 2000)

      switch (action) {
        case "hug":
          coinsEarned = 15
          expGained = 8
          toast({
            title: "💖 Loving Bond!",
            description: `${selectedPet.name} feels deeply loved! +${coinsEarned} coins, +${expGained} exp`,
          })
          break

        case "feed":
          coinsEarned = 25
          expGained = 12
          toast({
            title: "🍎 Nourished!",
            description: `${selectedPet.name} is well-fed and energized! +${coinsEarned} coins, +${expGained} exp`,
          })
          break

        case "play":
          coinsEarned = 35
          expGained = 18
          toast({
            title: "🎾 Joyful Play!",
            description: `${selectedPet.name} had an amazing time! +${coinsEarned} coins, +${expGained} exp`,
          })
          break

        case "train":
          coinsEarned = 45
          expGained = 25
          toast({
            title: "💪 Intense Training!",
            description: `${selectedPet.name} grew significantly stronger! +${coinsEarned} coins, +${expGained} exp`,
          })
          break

        case "battle":
          coinsEarned = 60
          expGained = 35
          toast({
            title: "⚔️ Victory!",
            description: `${selectedPet.name} won the battle! +${coinsEarned} coins, +${expGained} exp`,
          })
          break
      }

      setCoins((prev) => prev + coinsEarned)
      setPlayerExp((prev) => prev + expGained)
      setLastInteraction(action)

      // Level up logic
      if (playerExp + expGained >= 1000) {
        setPlayerLevel((prev) => prev + 1)
        setPlayerExp((prev) => prev + expGained - 1000)
        toast({
          title: "🎉 Level Up!",
          description: `Congratulations! You reached level ${playerLevel + 1}!`,
        })
      }

      // Update pet stats
      setSelectedPet((prev) => ({
        ...prev,
        experience: prev.experience + expGained,
        stats: {
          ...prev.stats,
          happiness: Math.min(100, prev.stats.happiness + Math.floor(Math.random() * 10) + 5),
          energy:
            action === "train" || action === "battle"
              ? Math.max(0, prev.stats.energy - 15)
              : Math.min(100, prev.stats.energy + 5),
        },
      }))
    },
    [selectedPet, playerLevel, playerExp],
  )

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-gray-500"
      case "Rare":
        return "bg-blue-500"
      case "Epic":
        return "bg-purple-500"
      case "Legendary":
        return "bg-yellow-600"
      case "Mythic":
        return "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "shadow-lg shadow-yellow-500/50"
      case "Mythic":
        return "shadow-xl shadow-purple-500/50 animate-pulse"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Enhanced Header */}
      <div className="bg-card/90 backdrop-blur-md border-b border-border/50 p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Crown className="h-10 w-10 text-primary animate-pulse" />
              <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-spin" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                CryptoCreatures Elite
              </h1>
              <p className="text-sm text-muted-foreground">Next-Gen NFT Pet Universe</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-gradient-to-r from-primary/20 to-accent/20 px-4 py-2 rounded-full border border-primary/30">
              <Coins className="h-5 w-5 text-primary animate-bounce" />
              <span className="font-bold text-primary-foreground text-lg">{coins.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 rounded-full border border-purple-500/30">
              <Star className="h-5 w-5 text-purple-400" />
              <span className="font-semibold text-purple-100">Level {playerLevel}</span>
            </div>
            <Badge variant="secondary" className="bg-accent/30 text-accent-foreground px-3 py-1">
              {selectedPet.name}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="game" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
              <Gamepad2 className="h-4 w-4" />
              Game
            </TabsTrigger>
            <TabsTrigger value="collection" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
              <Star className="h-4 w-4" />
              Collection
            </TabsTrigger>
            <TabsTrigger value="breeding" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
              <Heart className="h-4 w-4" />
              Breeding
            </TabsTrigger>
            <TabsTrigger value="battle" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
              <Trophy className="h-4 w-4" />
              Arena
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
              <Award className="h-4 w-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Enhanced 3D Viewport */}
              <div className="lg:col-span-2">
                <Card className={`overflow-hidden ${getRarityGlow(selectedPet.rarity)}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={`${getRarityColor(selectedPet.rarity)} text-white px-3 py-1`}>
                          {selectedPet.rarity}
                        </Badge>
                        <div>
                          <CardTitle className="text-xl">{selectedPet.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {selectedPet.type} • Level {selectedPet.level}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {pets.map((pet) => (
                          <Button
                            key={pet.id}
                            variant={selectedPet.id === pet.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedPet(pet)}
                            className="text-xs"
                          >
                            {pet.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="w-full h-[500px] bg-gradient-to-b from-slate-800 to-slate-900">
                      <EnhancedPetModel
                        pet={selectedPet}
                        isInteracting={isInteracting}
                        lastInteraction={lastInteraction}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Controls */}
              <div className="space-y-4">
                {/* Player Progress */}
                <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      Player Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Level {playerLevel}</span>
                          <span>{playerExp}/1000 EXP</span>
                        </div>
                        <Progress value={(playerExp / 1000) * 100} className="h-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pet Stats */}
                <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Pet Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3 text-pink-500" />
                            Happiness
                          </span>
                          <span>{selectedPet.stats.happiness}/100</span>
                        </div>
                        <Progress value={selectedPet.stats.happiness} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-yellow-500" />
                            Energy
                          </span>
                          <span>{selectedPet.stats.energy}/100</span>
                        </div>
                        <Progress value={selectedPet.stats.energy} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Experience</span>
                          <span>{selectedPet.experience}/1000</span>
                        </div>
                        <Progress value={(selectedPet.experience / 1000) * 100} className="h-2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div className="bg-gradient-to-b from-red-500/20 to-red-600/20 p-3 rounded-lg border border-red-500/30">
                        <div className="font-bold text-red-400 text-lg">{selectedPet.stats.strength}</div>
                        <div className="text-muted-foreground text-xs">Strength</div>
                      </div>
                      <div className="bg-gradient-to-b from-purple-500/20 to-purple-600/20 p-3 rounded-lg border border-purple-500/30">
                        <div className="font-bold text-purple-400 text-lg">{selectedPet.stats.magic}</div>
                        <div className="text-muted-foreground text-xs">Magic</div>
                      </div>
                      <div className="bg-gradient-to-b from-blue-500/20 to-blue-600/20 p-3 rounded-lg border border-blue-500/30">
                        <div className="font-bold text-blue-400 text-lg">{selectedPet.stats.speed}</div>
                        <div className="text-muted-foreground text-xs">Speed</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Interactions */}
                <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Interactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => interact("hug")}
                        className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg"
                        size="sm"
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        Hug
                      </Button>
                      <Button
                        onClick={() => interact("feed")}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                        size="sm"
                      >
                        <Gift className="h-4 w-4 mr-1" />
                        Feed
                      </Button>
                      <Button
                        onClick={() => interact("play")}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                        size="sm"
                      >
                        <Sparkles className="h-4 w-4 mr-1" />
                        Play
                      </Button>
                      <Button
                        onClick={() => interact("train")}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
                        size="sm"
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        Train
                      </Button>
                      <Button
                        onClick={() => interact("battle")}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg col-span-2"
                        size="sm"
                        disabled={selectedPet.stats.energy < 20}
                      >
                        <Trophy className="h-4 w-4 mr-1" />
                        Battle Arena
                      </Button>
                    </div>
                    {lastInteraction && (
                      <div className="mt-3 text-sm text-center p-2 bg-primary/10 rounded-lg">
                        <span className="text-primary font-medium">Last: {lastInteraction}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Pet Traits */}
                <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Special Traits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedPet.traits.map((trait, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-accent/20 text-accent-foreground">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span>Market Value:</span>
                        <span className="font-bold text-primary">{selectedPet.value} ETH</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="collection" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <Card
                  key={pet.id}
                  className={`overflow-hidden hover:shadow-xl transition-all duration-300 ${getRarityGlow(pet.rarity)}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{pet.name}</CardTitle>
                      <Badge className={`${getRarityColor(pet.rarity)} text-white text-xs`}>{pet.rarity}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        {pet.type} • Level {pet.level}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Happiness: {pet.stats.happiness}</div>
                        <div>Energy: {pet.stats.energy}</div>
                        <div>Strength: {pet.stats.strength}</div>
                        <div>Magic: {pet.stats.magic}</div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {pet.traits.slice(0, 2).map((trait, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {trait}
                          </Badge>
                        ))}
                        {pet.traits.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{pet.traits.length - 2} more
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-semibold text-primary">{pet.value} ETH</span>
                        <Button
                          size="sm"
                          onClick={() => setSelectedPet(pet)}
                          variant={selectedPet.id === pet.id ? "default" : "outline"}
                        >
                          {selectedPet.id === pet.id ? "Active" : "Select"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="breeding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Breeding Laboratory</CardTitle>
                <p className="text-muted-foreground">Combine two pets to create unique offspring with mixed traits</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Heart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Breeding System</h3>
                  <p>Select two compatible pets to create new generations</p>
                  <Button className="mt-4" disabled>
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="battle" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Battle Arena</CardTitle>
                <p className="text-muted-foreground">Pit your pets against others in thrilling battles</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Trophy className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Battle System</h3>
                  <p>Engage in strategic battles and earn rewards</p>
                  <Button className="mt-4" disabled>
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ENHANCED_ACHIEVEMENTS.map((achievement) => {
                const IconComponent = achievement.icon
                return (
                  <Card
                    key={achievement.id}
                    className={`${achievement.unlocked ? "border-primary bg-primary/5" : "opacity-75"} transition-all duration-300`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-3">
                          <IconComponent
                            className={`h-6 w-6 ${achievement.unlocked ? "text-primary" : "text-muted-foreground"}`}
                          />
                          {achievement.name}
                        </CardTitle>
                        {achievement.unlocked && (
                          <Badge className="bg-primary text-primary-foreground">
                            <Trophy className="h-3 w-3 mr-1" />
                            Unlocked
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3">{achievement.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{achievement.reward} coins</span>
                        </div>
                        {achievement.unlocked ? (
                          <Button size="sm" variant="outline" disabled>
                            <Trophy className="h-3 w-3 mr-1" />
                            Claimed
                          </Button>
                        ) : (
                          <Badge variant="secondary">Locked</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
