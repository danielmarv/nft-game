"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { HederaSessionEvent, HederaJsonRpcMethod, DAppConnector, HederaChainId } from "@hashgraph/hedera-wallet-connect"
import { LedgerId } from "@hashgraph/sdk"

interface WalletContextType {
  connectedAccount: string | null
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  dAppConnector: DAppConnector | null
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
  const [dAppConnector, setDAppConnector] = useState<DAppConnector | null>(null)

  useEffect(() => {
    const initializeConnector = async () => {
      try {
        const metadata = {
          name: "Hedera Gaming Platform",
          description: "A Web3 gaming platform built on Hedera",
          url: window.location.origin,
          icons: [`${window.location.origin}/favicon.ico`],
        }

        const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id"

        const connector = new DAppConnector(
          metadata,
          LedgerId.TESTNET, // Use TESTNET for development
          projectId,
          Object.values(HederaJsonRpcMethod),
          [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
          [HederaChainId.Testnet], // Use Testnet for development
        )

        await connector.init({ logger: "error" })
        setDAppConnector(connector)

        // Check for existing session
        const existingSession = connector.signers?.[0]
        if (existingSession) {
          setConnectedAccount(existingSession.getAccountId()?.toString() || null)
        }

        // Listen for session events
        connector.onSessionIframeCreated = (session) => {
          console.log("Session created:", session)
        }
      } catch (error) {
        console.error("Failed to initialize DApp connector:", error)
      }
    }

    initializeConnector()
  }, [])

  const connect = async () => {
    if (!dAppConnector) {
      throw new Error("DApp connector not initialized")
    }

    try {
      setIsConnecting(true)
      await dAppConnector.openModal()

      // Wait for connection
      const signer = dAppConnector.signers?.[0]
      if (signer) {
        const accountId = signer.getAccountId()?.toString()
        setConnectedAccount(accountId || null)
      }
    } catch (error) {
      console.error("Wallet connection failed:", error)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    if (dAppConnector) {
      dAppConnector.disconnectAll()
    }
    setConnectedAccount(null)
  }

  const value: WalletContextType = {
    connectedAccount,
    isConnecting,
    connect,
    disconnect,
    dAppConnector,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}
