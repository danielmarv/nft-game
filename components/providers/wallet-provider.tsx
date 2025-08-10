"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  connect: (walletId: string) => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)

  const connect = async (walletId: string) => {
    try {
      // Mock wallet connection - replace with actual wallet integration
      if (walletId === "metamask") {
        // Simulate MetaMask connection
        setAddress("0x1234567890123456789012345678901234567890")
        setIsConnected(true)
      } else if (walletId === "walletconnect") {
        // Simulate WalletConnect connection
        setAddress("0x0987654321098765432109876543210987654321")
        setIsConnected(true)
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw error
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress(null)
  }

  return (
    <WalletContext.Provider value={{ isConnected, address, connect, disconnect }}>{children}</WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
