"use client"

import { useUser } from "@stackframe/stack"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AuthButton } from "@/components/auth/auth-button"
import { AuthModal } from "@/components/auth/auth-modal"
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useNFTs } from "@/hooks/use-nfts"

export default function HomePage() {
  const user = useUser()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { pets, isLoading: isLoadingNFTs } = useNFTs("pets")
  const [selectedPet, setSelectedPet] = useState<(typeof pets)[0] | null>(null)

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
          <Link href="/game" passHref>
            <Button variant="ghost" className="text-white hover:text-purple-300">
              Game
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
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} NFT Game. All rights reserved.</p>
      </footer>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  )
}
