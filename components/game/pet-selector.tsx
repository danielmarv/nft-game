"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Zap, Shield, Star } from "lucide-react"

interface Pet {
  id: string
  name: string
  type: string
  level: number
  health: number
  maxHealth: number
  energy: number
  maxEnergy: number
  defense: number
  rarity: "common" | "rare" | "epic" | "legendary"
  image: string
  abilities: string[]
}

interface PetSelectorProps {
  pets: Pet[]
  selectedPet?: Pet
  onSelectPet: (pet: Pet) => void
}

export function PetSelector({ pets, selectedPet, onSelectPet }: PetSelectorProps) {
  const [hoveredPet, setHoveredPet] = useState<string | null>(null)

  const rarityColors = {
    common: "bg-gray-500",
    rare: "bg-blue-500",
    epic: "bg-purple-500",
    legendary: "bg-yellow-500",
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Battle Pet</h2>
        <p className="text-muted-foreground">Select a pet to join you in battle</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map((pet) => (
          <Card
            key={pet.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedPet?.id === pet.id ? "ring-2 ring-primary" : ""
            } ${hoveredPet === pet.id ? "scale-105" : ""}`}
            onMouseEnter={() => setHoveredPet(pet.id)}
            onMouseLeave={() => setHoveredPet(null)}
            onClick={() => onSelectPet(pet)}
          >
            <CardHeader className="pb-2">
              <div className="relative">
                <img
                  src={pet.image || `/placeholder.svg?height=120&width=120&query=${pet.name}`}
                  alt={pet.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Badge className={`absolute top-2 right-2 ${rarityColors[pet.rarity]} text-white`}>{pet.rarity}</Badge>
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 rounded px-2 py-1">
                  <Star className="h-3 w-3 text-yellow-400" />
                  <span className="text-white text-sm">{pet.level}</span>
                </div>
              </div>
              <CardTitle className="text-lg">{pet.name}</CardTitle>
              <CardDescription>{pet.type}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Health</span>
                  </div>
                  <span>
                    {pet.health}/{pet.maxHealth}
                  </span>
                </div>
                <Progress value={(pet.health / pet.maxHealth) * 100} className="h-2" />

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>Energy</span>
                  </div>
                  <span>
                    {pet.energy}/{pet.maxEnergy}
                  </span>
                </div>
                <Progress value={(pet.energy / pet.maxEnergy) * 100} className="h-2" />

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span>Defense</span>
                  </div>
                  <span>{pet.defense}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Abilities</h4>
                <div className="flex flex-wrap gap-1">
                  {pet.abilities.map((ability, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {ability}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button className="w-full" variant={selectedPet?.id === pet.id ? "default" : "outline"}>
                {selectedPet?.id === pet.id ? "Selected" : "Select Pet"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
