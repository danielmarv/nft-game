"use client"

import { useState, useEffect } from "react"
import { useUser } from "@stackframe/stack"
import { useNFTs } from "@/hooks/use-nfts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PetViewer } from "@/components/3d/pet-viewer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Pet {
  id: string
  name: string
  description: string
  image: string
  rarity?: string
  type?: string
  attributes?: Array<{
    trait_type: string
    value: string
  }>
}

export function PetSelector() {
  const { isSignedIn } = useUser()
  const { pets, isLoading, error } = useNFTs("pets")
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)
  const [currentPet, setCurrentPet] = useState<Pet | null>(null)

  useEffect(() => {
    if (isSignedIn && pets && pets.length > 0 && !selectedPetId) {
      // On first login, if no pet is selected, default to the first pet
      setSelectedPetId(pets[0].id)
      setCurrentPet(pets[0])
    } else if (selectedPetId && pets) {
      // Update currentPet if selectedPetId changes or pets data reloads
      const foundPet = pets.find((pet) => pet.id === selectedPetId)
      if (foundPet) {
        setCurrentPet(foundPet)
      } else if (pets.length > 0) {
        // If previously selected pet is no longer available, default to first
        setSelectedPetId(pets[0].id)
        setCurrentPet(pets[0])
      } else {
        // No pets available
        setSelectedPetId(null)
        setCurrentPet(null)
      }
    }
  }, [isSignedIn, pets, selectedPetId])

  const handlePetChange = (petId: string) => {
    setSelectedPetId(petId)
    const newPet = pets?.find((pet) => pet.id === petId)
    if (newPet) {
      setCurrentPet(newPet)
    }
  }

  if (!isSignedIn) {
    return (
      <Card className="w-full max-w-md mx-auto text-center p-6">
        <CardHeader>
          <CardTitle>Sign In to See Your Pets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please sign in to view and interact with your pets.</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
        <Skeleton className="h-10 w-full max-w-xs" />
        <Skeleton className="w-full h-[500px] rounded-lg" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto text-center p-6 border-red-500">
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Pets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error.message || "Failed to load pet data."}</p>
        </CardContent>
      </Card>
    )
  }

  if (!pets || pets.length === 0) {
    return (
      <Card className="w-full max-w-md mx-auto text-center p-6">
        <CardHeader>
          <CardTitle>No Pets Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            It looks like you don't have any pets yet. Log in for the first time to get your first pet!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {pets.length > 1 && (
        <div className="flex justify-center">
          <Select value={selectedPetId || ""} onValueChange={handlePetChange}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a pet" />
            </SelectTrigger>
            <SelectContent>
              {pets.map((pet) => (
                <SelectItem key={pet.id} value={pet.id}>
                  {pet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {currentPet ? (
        <div className="relative w-full h-[500px] bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg shadow-xl overflow-hidden">
          <PetViewer pet={currentPet} />
        </div>
      ) : (
        <Card className="w-full h-[500px] flex items-center justify-center">
          <CardContent className="text-center text-muted-foreground">
            <p>Select a pet to view it in 3D.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
