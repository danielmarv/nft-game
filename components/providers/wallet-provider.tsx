"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface WalletContextType {
  connectedAccount: string | null
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  showQRCode: boolean
  setShowQRCode: (show: boolean) => void
}

const WalletContext = createContext<WalletContextType | null>(null)

export function useWalletContext() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWalletContext must be used within WalletProvider")
  }
  return context
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)

  useEffect(() => {
    // Check for existing wallet connection
    const storedAccount = localStorage.getItem("connected_wallet")
    if (storedAccount) {
      setConnectedAccount(storedAccount)
    }
  }, [])

  const connect = async () => {
    try {
      setIsConnecting(true)

      // Mock wallet connection - in real app, integrate with WalletConnect
      // This would show QR code for mobile or connect to HashPack for desktop
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate connection delay

      const mockAccount = "0.0.123456"
      localStorage.setItem("connected_wallet", mockAccount)
      setConnectedAccount(mockAccount)
      setShowQRCode(false)
    } catch (error) {
      console.error("Wallet connection failed:", error)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    localStorage.removeItem("connected_wallet")
    setConnectedAccount(null)
    setShowQRCode(false)
  }

  const value: WalletContextType = {
    connectedAccount,
    isConnecting,
    connect,
    disconnect,
    showQRCode,
    setShowQRCode,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}
