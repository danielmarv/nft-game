import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { StackProvider, StackTheme } from "@stackframe/stack"
import { stackServerApp } from "@/lib/stack-auth"
import { WalletProvider } from "@/components/providers/wallet-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { Toaster } from "@/components/ui/toaster"
import { MagicalBackground } from "@/components/3d/magical-background"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NFT Gaming Platform",
  description: "A Web3 gaming platform with NFT cards and virtual pets",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <QueryProvider>
                <WalletProvider>
                  <MagicalBackground />
                  {children}
                  <Toaster />
                </WalletProvider>
              </QueryProvider>
            </ThemeProvider>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  )
}
