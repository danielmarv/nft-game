"use client"

import { useUser } from "@stackframe/stack"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthButton } from "@/components/auth/auth-button"
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { MagicalBackground } from "@/components/3d/magical-background"
import { Play, Trophy, Users, Sparkles, Gamepad2, Coins } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const user = useUser()

  const gameStats = [
    { label: "Active Players", value: "12,847", icon: Users },
    { label: "Games Played", value: "1.2M", icon: Gamepad2 },
    { label: "Rewards Distributed", value: "₿ 45,231", icon: Coins },
    { label: "Tournaments", value: "156", icon: Trophy },
  ]

  const featuredGames = [
    {
      id: "card-battle",
      title: "Card Battle Arena",
      description: "Strategic card battles with NFT rewards",
      image: "/placeholder.svg?height=200&width=300",
      players: "2.1k",
      status: "Live",
      href: "/game1",
    },
    {
      id: "pet-adventure",
      title: "Pet Adventure Quest",
      description: "Collect and battle with magical creatures",
      image: "/placeholder.svg?height=200&width=300",
      players: "1.8k",
      status: "Live",
      href: "/game2",
    },
    {
      id: "nft-gallery",
      title: "NFT Gallery",
      description: "Showcase and trade your digital collectibles",
      image: "/placeholder.svg?height=200&width=300",
      players: "956",
      status: "Beta",
      href: "/gallery",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <MagicalBackground />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Hedera Gaming</h1>
          </div>

          <div className="flex items-center space-x-4">
            <WalletConnectButton />
            <AuthButton />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Play. Earn. Own.
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Experience the future of gaming on Hedera. Battle with NFT cards, collect rare pets, and earn real rewards
            in our decentralized gaming ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {user ? (
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Link href="/game1">
                  <Play className="mr-2 h-5 w-5" />
                  Start Playing
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Link href="/handler/signup">
                  <Play className="mr-2 h-5 w-5" />
                  Get Started
                </Link>
              </Button>
            )}

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/gallery">
                <Trophy className="mr-2 h-5 w-5" />
                View Gallery
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {gameStats.map((stat, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <stat.icon className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Games</h3>
          <p className="text-gray-300 text-lg">Discover our most popular gaming experiences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredGames.map((game) => (
            <Card
              key={game.id}
              className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 group"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={game.image || "/placeholder.svg"}
                  alt={game.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge className={game.status === "Live" ? "bg-green-500" : "bg-yellow-500"}>{game.status}</Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    <Users className="h-3 w-3 mr-1" />
                    {game.players}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-white">{game.title}</CardTitle>
                <CardDescription className="text-gray-300">{game.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <Button asChild className="w-full">
                  <Link href={game.href}>
                    <Play className="mr-2 h-4 w-4" />
                    Play Now
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Start Your Adventure?</h3>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of players in the ultimate Web3 gaming experience. Connect your wallet, collect NFTs, and
              start earning today.
            </p>

            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Link href="/handler/signup">Create Account</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Link href="/handler/signin">Sign In</Link>
                </Button>
              </div>
            ) : (
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
                <Link href="/profile">View Profile</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
