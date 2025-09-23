"use client"

import { useEffect, useState } from "react"

interface NFTPet {
  id: string
  name: string
  type: "Dragon" | "Unicorn" | "Phoenix" | "Griffin" | "Pegasus"
  rarity: "Common" | "Rare" | "Epic" | "Legendary" | "Mythic"
  level: number
  stats: {
    happiness: number
    energy: number
    strength: number
    magic: number
    speed: number
  }
}

interface EnhancedPetModelProps {
  pet: NFTPet
  isInteracting: boolean
  lastInteraction: string | null
}

export function EnhancedPetModel({ pet, isInteracting, lastInteraction }: EnhancedPetModelProps) {
  const [animationClass, setAnimationClass] = useState("")

  useEffect(() => {
    if (isInteracting && lastInteraction) {
      switch (lastInteraction) {
        case "hug":
          setAnimationClass("animate-pulse")
          break
        case "feed":
          setAnimationClass("animate-bounce")
          break
        case "play":
          setAnimationClass("animate-spin")
          break
        case "train":
          setAnimationClass("animate-ping")
          break
        case "battle":
          setAnimationClass("animate-pulse")
          break
      }

      const timer = setTimeout(() => setAnimationClass(""), 2000)
      return () => clearTimeout(timer)
    }
  }, [isInteracting, lastInteraction])

  const getPetEmoji = (type: string) => {
    switch (type) {
      case "Dragon":
        return "🐉"
      case "Unicorn":
        return "🦄"
      case "Phoenix":
        return "🔥"
      case "Griffin":
        return "🦅"
      case "Pegasus":
        return "🐴"
      default:
        return "🐾"
    }
  }

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "shadow-lg shadow-gray-500/50"
      case "Rare":
        return "shadow-lg shadow-blue-500/50"
      case "Epic":
        return "shadow-lg shadow-purple-500/50"
      case "Legendary":
        return "shadow-xl shadow-yellow-500/70 animate-pulse"
      case "Mythic":
        return "shadow-2xl shadow-pink-500/80 animate-pulse"
      default:
        return ""
    }
  }

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "border-gray-400"
      case "Rare":
        return "border-blue-400"
      case "Epic":
        return "border-purple-400"
      case "Legendary":
        return "border-yellow-400"
      case "Mythic":
        return "border-gradient-to-r from-pink-400 via-purple-400 to-cyan-400"
      default:
        return "border-gray-400"
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-800/50 to-slate-900/50">
      {/* Pet Container */}
      <div className={`relative ${animationClass}`}>
        {/* Main Pet Display */}
        <div
          className={`
          relative w-48 h-48 rounded-full border-4 ${getRarityBorder(pet.rarity)} ${getRarityGlow(pet.rarity)}
          bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800
          flex items-center justify-center transform hover:scale-105 transition-all duration-300
          ${pet.rarity === "Mythic" ? "animate-pulse" : ""}
        `}
        >
          {/* Pet Emoji/Icon */}
          <div className="text-8xl filter drop-shadow-2xl">{getPetEmoji(pet.type)}</div>

          {/* Rarity Sparkles for high-tier pets */}
          {(pet.rarity === "Legendary" || pet.rarity === "Mythic") && (
            <>
              <div className="absolute top-2 right-2 text-yellow-400 animate-ping">✨</div>
              <div className="absolute bottom-2 left-2 text-purple-400 animate-ping delay-500">✨</div>
              <div className="absolute top-1/2 left-2 text-cyan-400 animate-ping delay-1000">✨</div>
            </>
          )}
        </div>

        {/* Pet Name */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30">
            <span className="text-white font-bold text-lg">{pet.name}</span>
          </div>
        </div>

        {/* Level Badge */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full border border-primary-foreground/20">
            <span className="text-primary-foreground font-semibold text-sm">Level {pet.level}</span>
          </div>
        </div>

        {/* Type-specific Effects */}
        {pet.type === "Dragon" && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-4 text-red-500 animate-bounce delay-300">🔥</div>
            <div className="absolute top-4 right-4 text-orange-500 animate-bounce delay-700">🔥</div>
          </div>
        )}

        {pet.type === "Phoenix" && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-orange-400 animate-ping">🔥</div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-red-400 animate-ping delay-500">
              🔥
            </div>
          </div>
        )}

        {pet.type === "Unicorn" && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-2xl animate-pulse">🌟</div>
        )}

        {/* Interaction Feedback */}
        {isInteracting && lastInteraction && (
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              {lastInteraction === "hug" && "💖 Hugged!"}
              {lastInteraction === "feed" && "🍎 Fed!"}
              {lastInteraction === "play" && "🎾 Playing!"}
              {lastInteraction === "train" && "💪 Training!"}
              {lastInteraction === "battle" && "⚔️ Battling!"}
            </div>
          </div>
        )}

        {/* Stats Indicators */}
        <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 space-y-2">
          <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded text-xs">
            <span className="text-pink-400">❤️</span>
            <span className="text-white">{pet.stats.happiness}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded text-xs">
            <span className="text-yellow-400">⚡</span>
            <span className="text-white">{pet.stats.energy}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded text-xs">
            <span className="text-red-400">💪</span>
            <span className="text-white">{pet.stats.strength}</span>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-ping delay-1000"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-accent/40 rounded-full animate-ping delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-secondary/30 rounded-full animate-ping delay-3000"></div>
      </div>
    </div>
  )
}
