"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Star } from "lucide-react"
import Image from "next/image"

interface Pet {
  id: string
  name: string
  type: string
  level: number
  image: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface PetSelectorProps {
  pets: Pet[]
  selectedPetId: string | null
  onSelectPet: (petId: string) => void
}

const rarityColors = {
  common: "bg-gray-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-yellow-500",
}

export function PetSelector({ pets, selectedPetId, onSelectPet }: PetSelectorProps) {
  return (
    <div className="space-y-3">
      {pets.map((pet) => (
        <Card
          key={pet.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedPetId === pet.id ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onSelectPet(pet.id)}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={pet.image || "/placeholder.svg?height=48&width=48&query=pet avatar"}
                  alt={pet.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium truncate">{pet.name}</h3>
                  <Badge className={`${rarityColors[pet.rarity]} text-white text-xs`}>{pet.rarity}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{pet.type}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <span>Lv.{pet.level}</span>
                  </div>
                </div>
              </div>
              {selectedPetId === pet.id && <Heart className="h-4 w-4 text-primary fill-current" />}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
