"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Wallet, Trophy, ArrowLeft, ExternalLink, Settings } from "lucide-react"
import Link from "next/link"
import { NFTCard } from "@/components/nft/nft-card"
import { useAuth } from "@/hooks/use-auth"
import { useWallet } from "@/hooks/use-wallet"
import { useNFTs } from "@/hooks/use-nfts"
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button"

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth()
  const { connectedAccount, disconnect } = useWallet()
  const { achievements, pets, cards, loading: nftsLoading } = useNFTs("all")

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to view your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalNFTs = (achievements?.length || 0) + (pets?.length || 0) + (cards?.length || 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">My Profile</h1>
          </div>
          <Badge variant="secondary">Profile</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card>
                <CardHeader className="text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback>
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{user?.name}</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Provider:</span>
                    <Badge variant="outline">{user?.provider}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Member since:</span>
                    <span className="text-sm text-muted-foreground">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <Button onClick={logout} variant="outline" className="w-full bg-transparent">
                    <Settings className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Wallet Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wallet className="h-5 w-5 mr-2" />
                    Wallet Connection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {connectedAccount ? (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Connected Account:</p>
                        <div className="flex items-center justify-between">
                          <code className="text-sm bg-muted px-2 py-1 rounded">{connectedAccount}</code>
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`https://hashscan.io/mainnet/account/${connectedAccount}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                      <Button onClick={disconnect} variant="outline" className="w-full bg-transparent">
                        Disconnect Wallet
                      </Button>
                    </>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Connect your Hedera wallet to view and manage your NFTs
                      </p>
                      <WalletConnectButton />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Collection Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total NFTs:</span>
                    <Badge variant="outline">{totalNFTs}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Achievements:</span>
                    <Badge variant="secondary">{achievements?.length || 0}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Pets:</span>
                    <Badge variant="secondary">{pets?.length || 0}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Cards:</span>
                    <Badge variant="secondary">{cards?.length || 0}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Tabs defaultValue="achievements" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="achievements">Achievements ({achievements?.length || 0})</TabsTrigger>
                  <TabsTrigger value="pets">Pets ({pets?.length || 0})</TabsTrigger>
                  <TabsTrigger value="cards">Cards ({cards?.length || 0})</TabsTrigger>
                </TabsList>

                <TabsContent value="achievements" className="mt-6">
                  {nftsLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>Loading achievements...</p>
                    </div>
                  ) : achievements && achievements.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-6">
                      {achievements.map((nft) => (
                        <NFTCard key={nft.id} nft={nft} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">No achievements yet</p>
                        <Button asChild>
                          <Link href="/game1">Start Playing</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="pets" className="mt-6">
                  {nftsLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>Loading pets...</p>
                    </div>
                  ) : pets && pets.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-6">
                      {pets.map((nft) => (
                        <NFTCard key={nft.id} nft={nft} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <div className="text-6xl mb-4">🐾</div>
                        <p className="text-muted-foreground mb-4">No pets yet</p>
                        <Button asChild>
                          <Link href="/game1">Adopt Your First Pet</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="cards" className="mt-6">
                  {nftsLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>Loading cards...</p>
                    </div>
                  ) : cards && cards.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {cards.map((nft) => (
                        <NFTCard key={nft.id} nft={nft} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <div className="text-6xl mb-4">🃏</div>
                        <p className="text-muted-foreground mb-4">No cards yet</p>
                        <Button asChild>
                          <Link href="/game2">Get Starter Cards</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
