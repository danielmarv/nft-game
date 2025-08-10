"use client"

import { useWallet as useWalletContext } from "@/components/providers/wallet-provider"

export function useWallet() {
  return useWalletContext()
}
