"use client"

import { useUser } from "@stackframe/stack"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AuthButton } from "@/components/auth/auth-button"
import { AuthModal } from "@/components/auth/auth-modal"
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Gamepad2, Trophy, Coins, Users } from "lucide-react"
import Link from "next/link"
import { DailyReward } from "@/components/game/daily-reward"
import { PetSelector } from "@/components/game/pet-selector"
import { CardGallery } from "@/components/game/card-gallery"
import { PetViewer } from "@/components/3d/pet-viewer"
import { useNFTs } from "@/hooks/use-nfts"
import { usePetInteraction } from "@/hooks/use-pet-interaction"

export default function HomePage() {
  const user = useUser()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { pets, isLoading: isLoadingNFTs } = useNFTs("pets")
  const [selectedPet, setSelectedPet] = useState<(typeof pets)[0] | null>(null)
  const { interactWithPet, isInteracting } = usePetInteraction()

  // Simulate first login pet assignment
  useEffect(() => {
    if (user && user.isSignedIn && !selectedPet && pets && pets.length > 0) {
      // Assign the first pet as default if none selected
      setSelectedPet(pets[0])
    }
  }, [user, pets, selectedPet])

  const handleRewardClaimed = (reward: { type: string; amount: number }) => {
    console.log(`Reward claimed: ${reward.amount} ${reward.type}`)
    // Here you would update user's balance in your backend/state
  }

  const gameFeatures = [
    {
      icon: <Gamepad2 className="h-8 w-8" />,
      title: "Interactive Games",
      description: "Play engaging card games and pet collection adventures",
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "NFT Rewards",
      description: "Earn unique NFT cards and pets as you progress",
    },
    {
      icon: <Coins className="h-8 w-8" />,
      title: "Daily Rewards",
      description: "Collect daily bonuses and special items",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community",
      description: "Trade and compete with other players",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-purple-400">NFT Game</h1>
        <nav className="flex items-center space-x-4">
          <Link href="/" passHref>
            <Button variant="ghost" className="text-white hover:text-purple-300">
              Home
            </Button>
          </Link>
          <Link href="/gallery" passHref>
            <Button variant="ghost" className="text-white hover:text-purple-300">
              Gallery
            </Button>
          </Link>
          <Link href="/game1" passHref>
            <Button variant="ghost" className="text-white hover:text-purple-300">
              Game 1
            </Button>
          </Link>
          <Link href="/game2" passHref>
            <Button variant="ghost" className="text-white hover:text-purple-300">
              Game 2
            </Button>
          </Link>
          <WalletConnectButton />
          <AuthButton />
          <ThemeToggle />
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        <section className="text-center space-y-4">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Welcome to the NFT Adventure!
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Collect unique digital assets, battle with powerful cards, and nurture your adorable 3D pets. Your journey
            into the blockchain gaming world starts here.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/gallery" passHref>
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                Explore NFTs
              </Button>
            </Link>
            <Link href="/game1" passHref>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-600 text-purple-400 hover:bg-purple-900 bg-transparent"
              >
                Start Playing
              </Button>
            </Link>
          </div>
        </section>

        <section className="space-y-8">
          <h3 className="text-4xl font-bold text-center text-purple-400">Your Digital Companions</h3>
          {user?.isSignedIn && pets && pets.length > 0 ? (
            <PetSelector pets={pets} selectedPet={selectedPet || undefined} onSelectPet={setSelectedPet} />
          ) : (
            <p className="text-muted-foreground">Sign in to see your pets!</p>
          )}
          {selectedPet && (
            <div className="mt-4 h-[400px]">
              <PetViewer
                key={selectedPet.id} // Key changes to remount and animate new pet
                petId={selectedPet.id}
                onHug={() => interactWithPet(selectedPet.id, "hug")}
                onFeed={() => interactWithPet(selectedPet.id, "feed")}
                isInteracting={isInteracting}
              />
            </div>
          )}
        </section>

        <section className="space-y-8">
          <h3 className="text-4xl font-bold text-center text-purple-400">Daily Rewards</h3>
          <DailyReward onRewardClaimed={handleRewardClaimed} />
        </section>

        <section className="space-y-8">
          <h3 className="text-4xl font-bold text-center text-purple-400">Featured Cards</h3>
          <CardGallery />
        </section>
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} NFT Game. All rights reserved.</p>
      </footer>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  )
}
