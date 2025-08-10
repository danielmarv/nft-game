"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Grid, List } from "lucide-react"

interface GameCard {
  id: string
  name: string
  description: string
  image: string
  rarity: "common" | "rare" | "epic" | "legendary"
  type: string
  cost: number
  attack?: number
  defense?: number
  abilities: string[]
}

interface CardGalleryProps {
  cards: GameCard[]
  onCardSelect?: (card: GameCard) => void
  selectedCards?: GameCard[]
  maxSelection?: number
}

export function CardGallery({ cards, onCardSelect, selectedCards = [], maxSelection }: CardGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [rarityFilter, setRarityFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const rarityColors = {
    common: "bg-gray-500",
    rare: "bg-blue-500",
    epic: "bg-purple-500",
    legendary: "bg-yellow-500",
  }

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRarity = rarityFilter === "all" || card.rarity === rarityFilter
    const matchesType = typeFilter === "all" || card.type === typeFilter

    return matchesSearch && matchesRarity && matchesType
  })

  const uniqueTypes = Array.from(new Set(cards.map((card) => card.type)))

  const isCardSelected = (card: GameCard) => selectedCards.some((selected) => selected.id === card.id)
  const canSelectMore = !maxSelection || selectedCards.length < maxSelection

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Card Collection</h2>
          <p className="text-muted-foreground">
            {filteredCards.length} cards available
            {maxSelection && ` • ${selectedCards.length}/${maxSelection} selected`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={rarityFilter} onValueChange={setRarityFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Rarity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rarities</SelectItem>
            <SelectItem value="common">Common</SelectItem>
            <SelectItem value="rare">Rare</SelectItem>
            <SelectItem value="epic">Epic</SelectItem>
            <SelectItem value="legendary">Legendary</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {uniqueTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cards Grid/List */}
      <div
        className={
          viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-4"
        }
      >
        {filteredCards.map((card) => (
          <Card
            key={card.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              isCardSelected(card) ? "ring-2 ring-primary" : ""
            } ${viewMode === "list" ? "flex" : ""}`}
            onClick={() => {
              if (onCardSelect && (canSelectMore || isCardSelected(card))) {
                onCardSelect(card)
              }
            }}
          >
            <div className={viewMode === "list" ? "w-32 flex-shrink-0" : ""}>
              <img
                src={card.image || `/placeholder.svg?height=200&width=200&query=${card.name}`}
                alt={card.name}
                className={`object-cover ${viewMode === "list" ? "w-full h-32" : "w-full h-48"} rounded-t-lg`}
              />
            </div>

            <div className="flex-1">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{card.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{card.description}</CardDescription>
                  </div>
                  <Badge className={`${rarityColors[card.rarity]} text-white ml-2`}>{card.rarity}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="outline">{card.type}</Badge>
                  <span className="font-medium">{card.cost} mana</span>
                </div>

                {(card.attack !== undefined || card.defense !== undefined) && (
                  <div className="flex gap-4 text-sm">
                    {card.attack !== undefined && (
                      <div className="flex items-center gap-1">
                        <span className="text-red-500">⚔️</span>
                        <span>{card.attack}</span>
                      </div>
                    )}
                    {card.defense !== undefined && (
                      <div className="flex items-center gap-1">
                        <span className="text-blue-500">🛡️</span>
                        <span>{card.defense}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-muted-foreground">Abilities</h4>
                  <div className="flex flex-wrap gap-1">
                    {card.abilities.slice(0, 3).map((ability, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {ability}
                      </Badge>
                    ))}
                    {card.abilities.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{card.abilities.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {onCardSelect && (
                  <Button
                    className="w-full"
                    variant={isCardSelected(card) ? "default" : "outline"}
                    disabled={!canSelectMore && !isCardSelected(card)}
                  >
                    {isCardSelected(card) ? "Selected" : "Select Card"}
                  </Button>
                )}
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No cards found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}
