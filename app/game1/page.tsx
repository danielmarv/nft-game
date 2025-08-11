"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useCardGame } from "@/hooks/use-card-game"
import { ArrowLeft, Swords, Shield, Heart, Zap, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

export default function CardGamePage() {
  const {
    playerHealth,
    enemyHealth,
    playerEnergy,
    enemyEnergy,
    playerHand,
    enemyHand,
    playerDeckCount,
    enemyDeckCount,
    playerDiscardCount,
    enemyDiscardCount,
    isPlayerTurn,
    gameLog,
    playCard,
    endTurn,
    resetGame,
    isGameOver,
    gameResult,
  } = useCardGame()

  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null)

  const handlePlayCard = () => {
    if (selectedCardIndex !== null) {
      playCard(selectedCardIndex)
      setSelectedCardIndex(null) // Deselect card after playing
    } else {
      toast({
        title: "No Card Selected",
        description: "Please select a card from your hand to play.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-center">Card Battle Arena</h1>
          <Button onClick={resetGame} variant="secondary">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Game
          </Button>
        </div>

        {isGameOver && (
          <Card className="mb-6 bg-blue-900/50 border-blue-700 text-center">
            <CardHeader>
              <CardTitle className="text-3xl">Game Over!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-4">{gameResult}</p>
              <Button onClick={resetGame} size="lg">
                Play Again
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enemy Area */}
          <Card className="lg:col-span-3 bg-red-900/30 border-red-700/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Enemy</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Heart className="h-5 w-5 text-red-400" />
                    <span>{enemyHealth}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <span>{enemyEnergy}</span>
                  </div>
                </div>
              </CardTitle>
              <CardDescription>
                <Progress value={(enemyHealth / 100) * 100} className="h-2 bg-red-500" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Enemy Hand ({enemyHand.length} cards)</h3>
              <div className="flex flex-wrap gap-2">
                {enemyHand.map((card, index) => (
                  <Card key={index} className="w-24 h-32 bg-gray-700 flex items-center justify-center text-sm">
                    Enemy Card
                  </Card>
                ))}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Deck: {enemyDeckCount} | Discard: {enemyDiscardCount}
              </div>
            </CardContent>
          </Card>

          {/* Game Log */}
          <Card className="lg:col-span-1 bg-gray-800/50 border-gray-700/50">
            <CardHeader>
              <CardTitle>Game Log</CardTitle>
            </CardHeader>
            <CardContent className="h-64 overflow-y-auto text-sm">
              {gameLog.map((log, index) => (
                <p key={index} className="mb-1">
                  {log}
                </p>
              ))}
            </CardContent>
          </Card>

          {/* Player Area */}
          <Card className="lg:col-span-2 bg-blue-900/30 border-blue-700/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Player</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Heart className="h-5 w-5 text-red-400" />
                    <span>{playerHealth}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <span>{playerEnergy}</span>
                  </div>
                </div>
              </CardTitle>
              <CardDescription>
                <Progress value={(playerHealth / 100) * 100} className="h-2 bg-blue-500" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Your Hand ({playerHand.length} cards)</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {playerHand.map((card, index) => (
                  <Card
                    key={index}
                    className={`w-28 h-40 cursor-pointer transition-all duration-200 ${
                      selectedCardIndex === index ? "ring-2 ring-yellow-400 scale-105" : ""
                    } ${!isPlayerTurn ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => isPlayerTurn && setSelectedCardIndex(index)}
                  >
                    <CardHeader className="p-2 pb-0">
                      <CardTitle className="text-md">{card.name}</CardTitle>
                      <CardDescription className="text-xs">Cost: {card.cost}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-2 text-xs">
                      <p>{card.description}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {card.type === "attack" && <Swords className="h-3 w-3" />}
                        {card.type === "defense" && <Shield className="h-3 w-3" />}
                        <span>{card.value}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Deck: {playerDeckCount} | Discard: {playerDiscardCount}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handlePlayCard} disabled={!isPlayerTurn || selectedCardIndex === null}>
                    Play Card
                  </Button>
                  <Button onClick={endTurn} disabled={!isPlayerTurn} variant="secondary">
                    End Turn
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
