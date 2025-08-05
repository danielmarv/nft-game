"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Pet {
  id: string
  name: string
  image: string
  rarity?: string
  type?: string
  description?: string
  attributes?: Array<{
    trait_type: string
    value: string
  }>
}

interface PetSelectorProps {
  pets: Pet[]
  selectedPetId: string | null
  onSelectPet: (petId: string) => void
}

export function PetSelector({ pets, selectedPetId, onSelectPet }: PetSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {pets.map((pet) => (
        <Card
          key={pet.id}
          className={cn(
            "cursor-pointer transition-all hover:shadow-md",
            selectedPetId === pet.id && "ring-2 ring-primary",
          )}
          onClick={() => onSelectPet(pet.id)}
        >
          <CardContent className="p-3">
            <div className="aspect-square bg-muted rounded-lg mb-2 flex items-center justify-center">
              <span className="text-2xl">🐾</span>
            </div>
            <div className="text-center">
              <p className="font-medium text-sm truncate">{pet.name}</p>
              <Badge variant="outline" className="text-xs mt-1">
                {pet.rarity || "common"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
