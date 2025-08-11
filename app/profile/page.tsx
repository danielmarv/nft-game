"use client"

import { useUser } from "@stackframe/stack"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useNFTs } from "@/hooks/use-nfts"
import { NftCard } from "@/components/nft/nft-card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button"
import { AuthButton } from "@/components/auth/auth-button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ProfilePage() {
  const { isSignedIn, user, signOut } = useUser()
  const { achievements, pets, cards, isLoading, error } = useNFTs("all")

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to view your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <AuthButton />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
        <div className="container mx-auto space-y-8">
          <Skeleton className="h-24 w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="p-0">
                  <Skeleton className="w-full h-48 rounded-t-lg" />
                </CardHeader>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md text-center border-red-500">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Profile</CardTitle>
            <CardDescription>{error.message || "Failed to load profile data."}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-purple-400">My Profile</h1>
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

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Card className="p-6 flex flex-col sm:flex-row items-center gap-6 bg-gray-800 border-gray-700">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user?.image || "/placeholder-avatar.jpg"} alt={user?.name || "User"} />
            <AvatarFallback className="text-4xl">{user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <CardTitle className="text-3xl font-bold text-purple-300">{user?.name || "Guest User"}</CardTitle>
            <CardDescription className="text-gray-400">{user?.email}</CardDescription>
            <Button
              onClick={() => signOut()}
              variant="outline"
              className="mt-4 border-red-500 text-red-400 hover:bg-red-900"
            >
              Sign Out
            </Button>
          </div>
        </Card>

        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-purple-300">My Pets</h2>
          {pets && pets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {pets.map((nft) => (
                <NftCard
                  key={nft.id}
                  name={nft.name}
                  description={nft.description}
                  imageUrl={nft.image}
                  rarity={nft.rarity}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">You don't have any pets yet.</p>
          )}
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-purple-300">My Cards</h2>
          {cards && cards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cards.map((nft) => (
                <NftCard
                  key={nft.id}
                  name={nft.name}
                  description={nft.description}
                  imageUrl={nft.image}
                  rarity={nft.rarity}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">You don't have any cards yet.</p>
          )}
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-purple-300">My Achievements</h2>
          {achievements && achievements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {achievements.map((nft) => (
                <NftCard
                  key={nft.id}
                  name={nft.name}
                  description={nft.description}
                  imageUrl={nft.image}
                  rarity={nft.rarity}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">You don't have any achievements yet.</p>
          )}
        </section>
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} NFT Game. All rights reserved.</p>
      </footer>
    </div>
  )
}
