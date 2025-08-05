"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, Trophy, Wallet, Sparkles } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button"
import { AuthButton } from "@/components/auth/auth-button"
import { MagicalBackground } from "@/components/3d/magical-background"
import { useAuth } from "@/hooks/use-auth"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen relative">
      <MagicalBackground />

      <div className="relative z-10 bg-gradient-to-br from-background/80 via-background/90 to-primary/5 backdrop-blur-sm">
        {/* Header */}
        <header className="border-b border-border/40 backdrop-blur-sm bg-background/80">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <div className="relative">
                <Sparkles className="h-8 w-8 text-primary" />
                <div className="absolute inset-0 h-8 w-8 bg-primary/20 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  NFT Gaming
                </h1>
                <p className="text-xs text-muted-foreground">Web3 Adventure Platform</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <WalletConnectButton />
              <AuthButton />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <motion.section
          className="container mx-auto px-4 py-20 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Badge
              variant="secondary"
              className="mb-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Web3 Gaming Platform
            </Badge>
          </motion.div>

          <motion.h2
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Play, Collect, Earn
          </motion.h2>

          <motion.p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" variants={itemVariants}>
            Experience the future of gaming with NFT-powered adventures. Collect unique pets, trade cards, and earn
            achievements on the Hedera network.
          </motion.p>

          {isAuthenticated && (
            <motion.div
              className="mb-8 p-6 bg-gradient-to-r from-card/50 to-primary/5 rounded-xl border border-primary/20 max-w-md mx-auto backdrop-blur-sm"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center space-x-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-muted-foreground">Welcome back,</p>
              </div>
              <p className="font-semibold text-primary text-lg">{user?.displayName || "Player"}</p>
            </motion.div>
          )}

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
            {isAuthenticated ? (
              <>
                <Button
                  asChild
                  size="lg"
                  className="glow-animation bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 border-0"
                >
                  <Link href="/game1">
                    <Gamepad2 className="mr-2 h-5 w-5" />
                    Pet Adventure
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20"
                >
                  <Link href="/game2">
                    <Trophy className="mr-2 h-5 w-5" />
                    Card Battle
                  </Link>
                </Button>
              </>
            ) : (
              <Button size="lg" disabled className="bg-gradient-to-r from-gray-500 to-gray-600">
                <Wallet className="mr-2 h-5 w-5" />
                Connect to Start Playing
              </Button>
            )}
          </motion.div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          className="container mx-auto px-4 py-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h3 className="text-3xl font-bold text-center mb-12" variants={itemVariants}>
            Game Features
          </motion.h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div variants={itemVariants}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-primary/20 bg-gradient-to-br from-card to-green-500/5 group">
                <CardHeader>
                  <div className="relative mb-4">
                    <Gamepad2 className="h-12 w-12 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 h-12 w-12 bg-green-500/20 rounded-full animate-ping group-hover:animate-pulse"></div>
                  </div>
                  <CardTitle>Pet Interaction</CardTitle>
                  <CardDescription>Adopt and care for unique NFT pets. Feed, hug, and watch them grow!</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>3D interactive pets
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>Achievement rewards
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>Multiple pet collection
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-primary/20 bg-gradient-to-br from-card to-purple-500/5 group">
                <CardHeader>
                  <div className="relative mb-4">
                    <Trophy className="h-12 w-12 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 h-12 w-12 bg-purple-500/20 rounded-full animate-ping group-hover:animate-pulse"></div>
                  </div>
                  <CardTitle>Trading Cards</CardTitle>
                  <CardDescription>Collect rare cards, complete sets, and battle other players.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>Daily card rewards
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>3D card animations
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Rarity-based gameplay
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-primary/20 bg-gradient-to-br from-card to-yellow-500/5 group">
                <CardHeader>
                  <div className="relative mb-4">
                    <Sparkles className="h-12 w-12 text-yellow-500 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 h-12 w-12 bg-yellow-500/20 rounded-full animate-ping group-hover:animate-pulse"></div>
                  </div>
                  <CardTitle>NFT Achievements</CardTitle>
                  <CardDescription>
                    Earn unique achievement NFTs by completing challenges and milestones.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>Milestone rewards
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>Public gallery
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>Hedera blockchain
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="container mx-auto px-4 py-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="max-w-2xl mx-auto border-primary/20 bg-gradient-to-r from-primary/5 via-purple-600/5 to-pink-600/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 mr-2 text-primary" />
                Ready to Start Your Adventure?
              </CardTitle>
              <CardDescription className="text-lg">
                Join thousands of players in the ultimate Web3 gaming experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0"
                >
                  <Link href="/gallery">
                    <Trophy className="mr-2 h-5 w-5" />
                    View Gallery
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30"
                >
                  <Link href="/profile">
                    <Wallet className="mr-2 h-5 w-5" />
                    My Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}
