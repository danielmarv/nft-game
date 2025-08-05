"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ExternalLink, Trophy, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { NFTCard } from "@/components/nft/nft-card"
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button"
import { useWallet } from "@/hooks/use-wallet"
import { usePublicNFTs } from "@/hooks/use-public-nfts"

export default function GalleryPage() {
  const { connectedAccount } = useWallet()
  const [searchAccount, setSearchAccount] = useState("")
  const [activeAccount, setActiveAccount] = useState<string | null>(null)

  const { achievements, pets, cards, loading, error } = usePublicNFTs(activeAccount)

  const handleSearch = () => {
    if (searchAccount.trim()) {
      setActiveAccount(searchAccount.trim())
    }
  }

  const handleUseConnectedWallet = () => {
    if (connectedAccount) {
      setActiveAccount(connectedAccount)
      setSearchAccount(connectedAccount)
    }
  }

  const totalNFTs = (achievements?.length || 0) + (pets?.length || 0) + (cards?.length || 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-500/5">
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
            <h1 className="text-2xl font-bold">NFT Gallery</h1>
          </div>
          <Badge variant="secondary">Public Gallery</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <motion.div className="max-w-2xl mx-auto mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center">
                <Trophy className="h-6 w-6 mr-2 text-primary" />
                Explore NFT Collections
              </CardTitle>
              <CardDescription>Enter a Hedera account ID to view their gaming achievements and NFTs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Hedera Account ID (e.g., 0.0.123456)"
                  value={searchAccount}
                  onChange={(e) => setSearchAccount(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={!searchAccount.trim()}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              {connectedAccount && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Or use your connected wallet:</p>
                  <div className="flex items-center justify-center gap-2">
                    <WalletConnectButton />
                    {connectedAccount && (
                      <Button variant="outline" onClick={handleUseConnectedWallet}>
                        Use My Wallet
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        {activeAccount && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading NFT collection...</p>
              </div>
            ) : error ? (
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle className="text-destructive">Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{error}</p>
                  <Button onClick={() => setActiveAccount(null)} variant="outline" className="w-full">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Account Info */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Account: {activeAccount}</CardTitle>
                        <CardDescription>Total NFTs: {totalNFTs}</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`https://hashscan.io/mainnet/account/${activeAccount}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          HashScan
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                {/* NFT Tabs */}
                <Tabs defaultValue="achievements" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="achievements">Achievements ({achievements?.length || 0})</TabsTrigger>
                    <TabsTrigger value="pets">Pets ({pets?.length || 0})</TabsTrigger>
                    <TabsTrigger value="cards">Cards ({cards?.length || 0})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="achievements" className="mt-6">
                    {achievements && achievements.length > 0 ? (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {achievements.map((nft) => (
                          <NFTCard key={nft.id} nft={nft} />
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="text-center py-12">
                          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No achievement NFTs found</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="pets" className="mt-6">
                    {pets && pets.length > 0 ? (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {pets.map((nft) => (
                          <NFTCard key={nft.id} nft={nft} />
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="text-center py-12">
                          <div className="text-6xl mb-4">🐾</div>
                          <p className="text-muted-foreground">No pet NFTs found</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="cards" className="mt-6">
                    {cards && cards.length > 0 ? (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {cards.map((nft) => (
                          <NFTCard key={nft.id} nft={nft} />
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="text-center py-12">
                          <div className="text-6xl mb-4">🃏</div>
                          <p className="text-muted-foreground">No card NFTs found</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!activeAccount && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-2">Discover Amazing Collections</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Search for any Hedera account to explore their gaming achievements, pets, and trading cards.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
