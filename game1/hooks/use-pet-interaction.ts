"use client"

import { useState, useCallback } from "react"
import { toast } from "@/hooks/use-toast"

export interface PetNFT {
  id: string
  name: string
  type: number
  glbUrl: string
}

export interface PetStats {
  happiness: number
  hunger: number
  energy: number
}

// Default stats for a new pet
const DEFAULT_STATS: PetStats = {
  happiness: 70,
  hunger: 50,
  energy: 80,
}

export function usePetInteraction(initialPets: PetNFT[]) {
  // Store all pets' stats in a dictionary: { [petId]: PetStats }
  const [petsStats, setPetsStats] = useState<Record<string, PetStats>>(
    () => Object.fromEntries(initialPets.map((p) => [p.id, { ...DEFAULT_STATS }]))
  )

  const [selectedPetId, setSelectedPetId] = useState<string>(
    initialPets.length > 0 ? initialPets[0].id : ""
  )

  const [lastInteraction, setLastInteraction] = useState<string | null>(null)

  // Interact with currently selected pet
  const interact = useCallback(
    (action: "hug" | "feed" | "play") => {
      if (!selectedPetId) return

      setPetsStats((prevStats) => {
        const stats = prevStats[selectedPetId] || { ...DEFAULT_STATS }
        let { happiness, hunger, energy } = stats

        switch (action) {
          case "hug":
            happiness = Math.min(100, happiness + 10)
            toast({ title: "Hugged!", description: "Your pet feels loved." })
            break
          case "feed":
            hunger = Math.max(0, hunger - 20)
            happiness = Math.min(100, happiness + 5)
            toast({ title: "Fed!", description: "Your pet is full and happy." })
            break
          case "play":
            happiness = Math.min(100, happiness + 15)
            energy = Math.max(0, energy - 10)
            toast({ title: "Played!", description: "Your pet had fun playing." })
            break
        }

        setLastInteraction(action)

        return {
          ...prevStats,
          [selectedPetId]: { happiness, hunger, energy },
        }
      })
    },
    [selectedPetId]
  )

  // Switch active pet
  const selectPet = useCallback((petId: string) => {
    if (!petsStats[petId]) {
      // Initialize new pet stats if not present
      setPetsStats((prev) => ({ ...prev, [petId]: { ...DEFAULT_STATS } }))
    }
    setSelectedPetId(petId)
  }, [petsStats])

  return {
    selectedPetId,
    petsStats,
    lastInteraction,
    interact,
    selectPet,
  }
}
