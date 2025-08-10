"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { WalletConnectModal } from "./wallet-connect-modal"
import { Wallet } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"

export function WalletConnectButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isConnected, address, disconnect } = useWallet()

  if (isConnected && address) {
    return (
      <Button variant="outline" onClick={disconnect} className="flex items-center gap-2 bg-transparent">
        <Wallet className="h-4 w-4" />
        {`${address.slice(0, 6)}...${address.slice(-4)}`}
      </Button>
    )
  }

  return (
    <>
      <Button variant="outline" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
      <WalletConnectModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}
