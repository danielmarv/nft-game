"use client"

import { useState, useCallback } from "react"
import { toast } from "@/hooks/use-toast"

interface PetStats {
  happiness: number
  hunger: number
  energy: number
}

const initialStats: PetStats = {
  happiness: 70,
  hunger: 50,
  energy: 80,
}

export function usePetInteraction(petId: string) {
  const [stats, setStats] = useState<PetStats>(initialStats)
  const [lastInteraction, setLastInteraction] = useState<string | null>(null)

  const interact = useCallback((action: "hug" | "feed" | "play") => {
    setStats((prevStats) => {
      let newHappiness = prevStats.happiness
      let newHunger = prevStats.hunger
      let newEnergy = prevStats.energy

      switch (action) {
        case "hug":
          newHappiness = Math.min(100, prevStats.happiness + 10)
          toast({ title: "Hugged!", description: "Your pet feels loved." })
          break
        case "feed":
          newHunger = Math.max(0, prevStats.hunger - 20)
          newHappiness = Math.min(100, prevStats.happiness + 5)
          toast({ title: "Fed!", description: "Your pet is full and happy." })
          break
        case "play":
          newHappiness = Math.min(100, prevStats.happiness + 15)
          newEnergy = Math.max(0, prevStats.energy - 10)
          toast({ title: "Played!", description: "Your pet had fun playing." })
          break
        default:
          break
      }

      setLastInteraction(action)
      return {
        happiness: newHappiness,
        hunger: newHunger,
        energy: newEnergy,
      }
    })
  }, [])

  // Simulate passive stat decay over time (e.g., every hour)
  // In a real app, this would be handled server-side or with more robust time tracking
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setStats(prevStats => ({
  //       happiness: Math.max(0, prevStats.happiness - 1),
  //       hunger: Math.min(100, prevStats.hunger + 2),
  //       energy: Math.max(0, prevStats.energy - 1),
  //     }));
  //   }, 3600000); // Every hour
  //   return () => clearInterval(interval);
  // }, []);

  return {
    stats,
    lastInteraction,
    interact,
  }
}
