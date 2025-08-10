"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface NftCardProps {
  name: string
  description: string
  imageUrl: string
  price: string
  owner: string
  onBuy?: () => void
}

export function NftCard({ name, description, imageUrl, price, owner, onBuy }: NftCardProps) {
  return (
    <Card className="w-[300px] overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
            quality={100}
            priority
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">{description}</CardDescription>
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">Price:</span>
          <span className="text-primary font-semibold">{price} HBAR</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">Owner:</span>
          <span className="text-muted-foreground">
            {owner.slice(0, 6)}...{owner.slice(-4)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {onBuy && (
          <Button onClick={onBuy} className="w-full">
            Buy Now
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
