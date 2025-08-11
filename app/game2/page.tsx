import { CardGallery } from "@/components/game/card-gallery"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AuthButton } from "@/components/auth/auth-button"
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Game2Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-purple-400">Game 2: Card Battle</h1>
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
        <section className="text-center space-y-4">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Unleash Your Card Collection!
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Browse your powerful trading cards and prepare for strategic battles. Collect rare cards to build the
            ultimate deck!
          </p>
        </section>

        <section className="flex justify-center">
          <CardGallery />
        </section>
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} NFT Game. All rights reserved.</p>
      </footer>
    </div>
  )
}
