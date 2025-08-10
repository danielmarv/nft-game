"use client"

import { useUser } from "@stackframe/stack"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthButton } from "@/components/auth/auth-button"
import { AuthModal } from "@/components/auth/auth-modal"
import { ThemeToggle } from "@/components/theme-toggle"
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button"
import { Gamepad2, Trophy, Sparkles, Users, Zap, Star } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const user = useUser()
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const features = [
    {
      icon: <Gamepad2 className="h-8 w-8" />,
      title: "Interactive Games",
      description: "Play engaging card games and pet interaction experiences",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "NFT Collection",
      description: "Collect, trade, and showcase your unique digital assets",
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "3D Experience",
      description: "Immersive 3D environments and magical backgrounds",
      color: "bg-pink-500/10 text-pink-500",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community",
      description: "Connect with other players and share your achievements",
      color: "bg-green-500/10 text-green-500",
    },
  ]

  const games = [
    {
      title: "Card Battle Arena",
      description: "Strategic card battles with your NFT collection",
      route: "/game1",
      difficulty: "Medium",
      players: "1-4",
    },
    {
      title: "Pet Adventure",
      description: "Explore magical worlds with your virtual companions",
      route: "/game2",
      difficulty: "Easy",
      players: "1",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              NFT Gaming Platform
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <WalletConnectButton />
            <ThemeToggle />
            {user ? (
              <AuthButton />
            ) : (
              <Button onClick={() => setAuthModalOpen(true)} variant="default">
                Get Started
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Star className="h-4 w-4 mr-1" />
            Web3 Gaming Platform
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
            Enter the Future of Gaming
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Collect NFTs, battle with cards, raise virtual pets, and explore immersive 3D worlds in our revolutionary
            gaming ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Button size="lg" asChild>
                  <Link href="/gallery">View Collection</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/game1">Start Playing</Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" onClick={() => setAuthModalOpen(true)}>
                  Join Now
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/gallery">Explore Gallery</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Platform Features</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover what makes our platform unique and engaging for players of all levels.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div
                  className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-4`}
                >
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Games Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Available Games</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose your adventure and start playing our exciting games.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {games.map((game, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5" />
                  {game.title}
                </CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="outline">Difficulty: {game.difficulty}</Badge>
                  <Badge variant="outline">Players: {game.players}</Badge>
                </div>
                <Button asChild className="w-full">
                  <Link href={game.route}>Play Now</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto text-center bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Start Your Journey?</CardTitle>
              <CardDescription>Join thousands of players in the ultimate Web3 gaming experience.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" onClick={() => setAuthModalOpen(true)}>
                Create Your Account
              </Button>
            </CardContent>
          </Card>
        </section>
      )}

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  )
}
