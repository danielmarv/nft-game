"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "@/hooks/use-toast"

interface Card {
  id: string
  name: string
  description: string
  type: "attack" | "defense" | "heal" | "energy"
  value: number
  cost: number
}

const initialDeck: Card[] = [
  { id: "strike", name: "Strike", description: "Deal 10 damage.", type: "attack", value: 10, cost: 1 },
  { id: "defend", name: "Defend", description: "Gain 8 block.", type: "defense", value: 8, cost: 1 },
  { id: "fireball", name: "Fireball", description: "Deal 15 damage.", type: "attack", value: 15, cost: 2 },
  { id: "shield", name: "Shield Wall", description: "Gain 12 block.", type: "defense", value: 12, cost: 2 },
  { id: "heal", name: "Heal", description: "Restore 10 health.", type: "heal", value: 10, cost: 2 },
  { id: "energize", name: "Energize", description: "Gain 2 energy.", type: "energy", value: 2, cost: 0 },
  { id: "heavy_strike", name: "Heavy Strike", description: "Deal 20 damage.", type: "attack", value: 20, cost: 3 },
  { id: "fortify", name: "Fortify", description: "Gain 15 block.", type: "defense", value: 15, cost: 3 },
  { id: "drain", name: "Drain Life", description: "Deal 8 damage, heal 4.", type: "attack", value: 8, cost: 2 },
  { id: "meditate", name: "Meditate", description: "Gain 3 energy.", type: "energy", value: 3, cost: 1 },
]

const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function useCardGame() {
  const [playerHealth, setPlayerHealth] = useState(100)
  const [enemyHealth, setEnemyHealth] = useState(100)
  const [playerEnergy, setPlayerEnergy] = useState(3)
  const [enemyEnergy, setEnemyEnergy] = useState(3)
  const [playerDeck, setPlayerDeck] = useState<Card[]>([])
  const [playerHand, setPlayerHand] = useState<Card[]>([])
  const [playerDiscard, setPlayerDiscard] = useState<Card[]>([])
  const [enemyDeck, setEnemyDeck] = useState<Card[]>([])
  const [enemyHand, setEnemyHand] = useState<Card[]>([])
  const [enemyDiscard, setEnemyDiscard] = useState<Card[]>([])
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameLog, setGameLog] = useState<string[]>([])
  const [isGameOver, setIsGameOver] = useState(false)
  const [gameResult, setGameResult] = useState("")

  const addLog = useCallback((message: string) => {
    setGameLog((prev) => [...prev, message].slice(-10)) // Keep last 10 logs
  }, [])

  const drawCards = useCallback(
    (deck: Card[], hand: Card[], discard: Card[], count: number) => {
      let newDeck = [...deck]
      const newHand = [...hand]
      let newDiscard = [...discard]

      for (let i = 0; i < count; i++) {
        if (newDeck.length === 0) {
          if (newDiscard.length === 0) {
            addLog("No more cards to draw!")
            break
          }
          newDeck = shuffle(newDiscard)
          newDiscard = []
          addLog("Shuffling discard pile into new deck.")
        }
        const card = newDeck.shift()
        if (card) {
          newHand.push(card)
        }
      }
      return { newDeck, newHand, newDiscard }
    },
    [addLog],
  )

  const initializeGame = useCallback(() => {
    setPlayerHealth(100)
    setEnemyHealth(100)
    setPlayerEnergy(3)
    setEnemyEnergy(3)
    setGameLog([])
    setIsGameOver(false)
    setGameResult("")

    const shuffledPlayerDeck = shuffle([...initialDeck, ...initialDeck]) // Start with 2 copies of each card
    const shuffledEnemyDeck = shuffle([...initialDeck, ...initialDeck])

    const { newDeck: pDeck, newHand: pHand } = drawCards(shuffledPlayerDeck, [], [], 5)
    const { newDeck: eDeck, newHand: eHand } = drawCards(shuffledEnemyDeck, [], [], 5)

    setPlayerDeck(pDeck)
    setPlayerHand(pHand)
    setPlayerDiscard([])
    setEnemyDeck(eDeck)
    setEnemyHand(eHand)
    setEnemyDiscard([])
    setIsPlayerTurn(true)
    addLog("Game started! Your turn.")
  }, [addLog, drawCards])

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  useEffect(() => {
    if (playerHealth <= 0 && !isGameOver) {
      setGameResult("You Lost!")
      setIsGameOver(true)
      addLog("Player health dropped to 0. You lost!")
      toast({
        title: "Game Over",
        description: "You were defeated!",
        variant: "destructive",
      })
    } else if (enemyHealth <= 0 && !isGameOver) {
      setGameResult("You Won!")
      setIsGameOver(true)
      addLog("Enemy health dropped to 0. You won!")
      toast({
        title: "Game Over",
        description: "Congratulations! You won!",
        variant: "default",
      })
    }
  }, [playerHealth, enemyHealth, isGameOver, addLog])

  const playCard = useCallback(
    (cardIndex: number) => {
      if (!isPlayerTurn || isGameOver) {
        toast({
          title: "Invalid Action",
          description: "It's not your turn or the game is over.",
          variant: "destructive",
        })
        return
      }

      const cardToPlay = playerHand[cardIndex]
      if (!cardToPlay) return

      if (playerEnergy < cardToPlay.cost) {
        toast({
          title: "Not Enough Energy",
          description: `You need ${cardToPlay.cost} energy to play ${cardToPlay.name}.`,
          variant: "destructive",
        })
        addLog(`Not enough energy to play ${cardToPlay.name}.`)
        return
      }

      setPlayerEnergy((prev) => prev - cardToPlay.cost)
      setPlayerHand((prev) => prev.filter((_, i) => i !== cardIndex))
      setPlayerDiscard((prev) => [...prev, cardToPlay])
      addLog(`You played ${cardToPlay.name}.`)

      switch (cardToPlay.type) {
        case "attack":
          setEnemyHealth((prev) => Math.max(0, prev - cardToPlay.value))
          addLog(`Enemy took ${cardToPlay.value} damage.`)
          if (cardToPlay.name === "Drain Life") {
            setPlayerHealth((prev) => Math.min(100, prev + cardToPlay.value / 2))
            addLog(`You healed for ${cardToPlay.value / 2} health.`)
          }
          break
        case "defense":
          // For simplicity, defense acts as temporary shield, not reducing health directly
          // In a real game, you'd track block and apply it before damage
          addLog(`You gained ${cardToPlay.value} block. (Not fully implemented)`)
          break
        case "heal":
          setPlayerHealth((prev) => Math.min(100, prev + cardToPlay.value))
          addLog(`You healed for ${cardToPlay.value} health.`)
          break
        case "energy":
          setPlayerEnergy((prev) => prev + cardToPlay.value)
          addLog(`You gained ${cardToPlay.value} energy.`)
          break
      }
    },
    [isPlayerTurn, playerEnergy, playerHand, isGameOver, addLog],
  )

  const endTurn = useCallback(() => {
    if (!isPlayerTurn || isGameOver) {
      toast({
        title: "Invalid Action",
        description: "It's not your turn or the game is over.",
        variant: "destructive",
      })
      return
    }

    addLog("Your turn ended.")
    setIsPlayerTurn(false)
    setPlayerEnergy(3) // Reset energy for next turn

    // Enemy turn logic
    setTimeout(() => {
      addLog("Enemy's turn.")
      let currentEnemyEnergy = 3
      let enemyCardsPlayed = 0

      const playableCards = enemyHand.filter((card) => card.cost <= currentEnemyEnergy)
      const sortedPlayable = playableCards.sort((a, b) => b.value - a.value) // Play highest value cards first

      for (const card of sortedPlayable) {
        if (currentEnemyEnergy >= card.cost) {
          currentEnemyEnergy -= card.cost
          setEnemyHand((prev) => prev.filter((c) => c.id !== card.id || c.name !== card.name)) // Remove one instance
          setEnemyDiscard((prev) => [...prev, card])
          addLog(`Enemy played ${card.name}.`)
          enemyCardsPlayed++

          switch (card.type) {
            case "attack":
              setPlayerHealth((prev) => Math.max(0, prev - card.value))
              addLog(`You took ${card.value} damage.`)
              break
            case "defense":
              addLog(`Enemy gained ${card.value} block. (Not fully implemented)`)
              break
            case "heal":
              setEnemyHealth((prev) => Math.min(100, prev + card.value))
              addLog(`Enemy healed for ${card.value} health.`)
              break
            case "energy":
              currentEnemyEnergy += card.value
              addLog(`Enemy gained ${card.value} energy.`)
              break
          }
        }
      }

      if (enemyCardsPlayed === 0) {
        addLog("Enemy could not play any cards.")
      }

      // Enemy draws cards for next turn
      const { newDeck: eDeck, newHand: eHand, newDiscard: eDiscard } = drawCards(enemyDeck, enemyHand, enemyDiscard, 3)
      setEnemyDeck(eDeck)
      setEnemyHand(eHand)
      setEnemyDiscard(eDiscard)

      addLog("Enemy turn ended. Your turn.")
      setIsPlayerTurn(true)
    }, 2000) // Simulate enemy thinking time
  }, [isPlayerTurn, isGameOver, playerEnergy, enemyHand, enemyDeck, enemyDiscard, addLog, drawCards])

  return {
    playerHealth,
    enemyHealth,
    playerEnergy,
    enemyEnergy,
    playerHand,
    enemyHand,
    playerDeckCount: playerDeck.length,
    enemyDeckCount: enemyDeck.length,
    playerDiscardCount: playerDiscard.length,
    enemyDiscardCount: enemyDiscard.length,
    isPlayerTurn,
    gameLog,
    playCard,
    endTurn,
    resetGame: initializeGame,
    isGameOver,
    gameResult,
  }
}
