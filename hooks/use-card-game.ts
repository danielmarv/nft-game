"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { toast } from "@/hooks/use-toast"

export interface Card {
  id: string
  name: string
  description: string
  type: "attack" | "defense" | "heal" | "energy"
  value: number
  cost: number
}

const MAX_HEALTH = 100
const TURN_START_ENERGY = 3
const INITIAL_HAND_SIZE = 5
const ENEMY_THINK_MS = 900 // how long enemy 'thinks' between plays

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

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * drawCards: attempts to draw `count` cards from deck into hand.
 * If deck runs out and discard exists, shuffle discard into new deck (classic mechanic).
 * Returns updated { deck, hand, discard } (new arrays).
 */
const drawCards = (deck: Card[], hand: Card[], discard: Card[], count: number) => {
  let newDeck = [...deck]
  const newHand = [...hand]
  let newDiscard = [...discard]

  for (let i = 0; i < count; i++) {
    if (newDeck.length === 0) {
      if (newDiscard.length === 0) {
        // nothing left to draw
        break
      }
      newDeck = shuffle(newDiscard)
      newDiscard = []
    }
    const card = newDeck.shift()
    if (card) newHand.push(card)
  }

  return { newDeck, newHand, newDiscard }
}

export function useCardGame() {
  // core stats
  const [playerHealth, setPlayerHealth] = useState<number>(MAX_HEALTH)
  const [enemyHealth, setEnemyHealth] = useState<number>(MAX_HEALTH)

  // block (temporary shield that resets only when used by damage)
  const [playerBlock, setPlayerBlock] = useState<number>(0)
  const [enemyBlock, setEnemyBlock] = useState<number>(0)

  // energy
  const [playerEnergy, setPlayerEnergy] = useState<number>(TURN_START_ENERGY)
  const [enemyEnergy, setEnemyEnergy] = useState<number>(TURN_START_ENERGY)

  // decks/hands/discards
  const [playerDeck, setPlayerDeck] = useState<Card[]>([])
  const [playerHand, setPlayerHand] = useState<Card[]>([])
  const [playerDiscard, setPlayerDiscard] = useState<Card[]>([])

  const [enemyDeck, setEnemyDeck] = useState<Card[]>([])
  const [enemyHand, setEnemyHand] = useState<Card[]>([])
  const [enemyDiscard, setEnemyDiscard] = useState<Card[]>([])

  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true)
  const [gameLog, setGameLog] = useState<string[]>([])
  const [isGameOver, setIsGameOver] = useState<boolean>(false)
  const [gameResult, setGameResult] = useState<string>("")

  // housekeeping for timeouts
  const enemyTimeoutRef = useRef<number | null>(null)

  const addLog = useCallback((message: string) => {
    setGameLog((prev) => {
      const next = [...prev, message]
      // keep last 12 logs to avoid memory/DOM bloat
      return next.slice(-12)
    })
  }, [])

  // Initialize game (fresh)
  const initializeGame = useCallback(() => {
    setPlayerHealth(MAX_HEALTH)
    setEnemyHealth(MAX_HEALTH)
    setPlayerBlock(0)
    setEnemyBlock(0)
    setPlayerEnergy(TURN_START_ENERGY)
    setEnemyEnergy(TURN_START_ENERGY)
    setIsGameOver(false)
    setGameResult("")
    setGameLog([])

    // start with 2 copies of deck
    const shuffledP = shuffle([...initialDeck, ...initialDeck])
    const shuffledE = shuffle([...initialDeck, ...initialDeck])

    // draw initial hands
    const { newDeck: pDeck, newHand: pHand, newDiscard: pDiscard } = drawCards(shuffledP, [], [], INITIAL_HAND_SIZE)
    const { newDeck: eDeck, newHand: eHand, newDiscard: eDiscard } = drawCards(shuffledE, [], [], INITIAL_HAND_SIZE)

    setPlayerDeck(pDeck)
    setPlayerHand(pHand)
    setPlayerDiscard(pDiscard)

    setEnemyDeck(eDeck)
    setEnemyHand(eHand)
    setEnemyDiscard(eDiscard)

    setIsPlayerTurn(true)
    addLog("Game started! Your turn.")
  }, [addLog])

  useEffect(() => {
    initializeGame()
    // cleanup enemy timeouts when unmounting
    return () => {
      if (enemyTimeoutRef.current) {
        window.clearTimeout(enemyTimeoutRef.current)
        enemyTimeoutRef.current = null
      }
    }
  }, [initializeGame])

  // Utility to apply damage to a character considering block
  const applyDamage = useCallback((incoming: number, target: "player" | "enemy") => {
    if (incoming <= 0) return

    if (target === "player") {
      setPlayerBlock((prevBlock) => {
        const remainingAfterBlock = Math.max(0, prevBlock - incoming)
        const absorbed = Math.min(prevBlock, incoming)
        const toHealth = incoming - absorbed
        if (toHealth > 0) {
          setPlayerHealth((prev) => Math.max(0, prev - toHealth))
        }
        return remainingAfterBlock
      })
    } else {
      setEnemyBlock((prevBlock) => {
        const remainingAfterBlock = Math.max(0, prevBlock - incoming)
        const absorbed = Math.min(prevBlock, incoming)
        const toHealth = incoming - absorbed
        if (toHealth > 0) {
          setEnemyHealth((prev) => Math.max(0, prev - toHealth))
        }
        return remainingAfterBlock
      })
    }
  }, [])

  // Watch for win/loss conditions
  useEffect(() => {
    if (isGameOver) return
    if (playerHealth <= 0) {
      setIsGameOver(true)
      setGameResult("You Lost!")
      addLog("Player health dropped to 0. You lost!")
      toast({ title: "Game Over", description: "You were defeated!", variant: "destructive" })
    } else if (enemyHealth <= 0) {
      setIsGameOver(true)
      setGameResult("You Won!")
      addLog("Enemy health dropped to 0. You won!")
      toast({ title: "Game Over", description: "Congratulations! You won!", variant: "default" })
    }
  }, [playerHealth, enemyHealth, isGameOver, addLog])

  // When a turn starts for either side, reset energy and draw cards
  useEffect(() => {
    if (isGameOver) return

    if (isPlayerTurn) {
      // Player turn start
      setPlayerEnergy(TURN_START_ENERGY)
      // Draw 2 cards at start of player's turn (you can tweak)
      setPlayerDeck((prevDeck) => {
        const { newDeck, newHand, newDiscard } = drawCards(prevDeck, playerHand, playerDiscard, 2)
        setPlayerHand(newHand)
        setPlayerDiscard(newDiscard)
        return newDeck
      })
      addLog("Your turn started.")
    } else {
      // Enemy turn start
      setEnemyEnergy(TURN_START_ENERGY)
      // draw for enemy
      setEnemyDeck((prevDeck) => {
        const { newDeck, newHand, newDiscard } = drawCards(prevDeck, enemyHand, enemyDiscard, 2)
        setEnemyHand(newHand)
        setEnemyDiscard(newDiscard)
        return newDeck
      })
      addLog("Enemy's turn started.")
      // Start enemy AI loop
      enemyTimeoutRef.current = window.setTimeout(() => {
        enemyAct()
      }, 700)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayerTurn]) // intentionally limited deps; playerHand/playerDiscard etc. updated inside

  // Play a card from player's hand by index
  const playCard = useCallback(
    (cardIndex: number) => {
      if (!isPlayerTurn || isGameOver) {
        toast({ title: "Invalid Action", description: "It's not your turn or the game is over.", variant: "destructive" })
        return
      }

      setPlayerHand((prevHand) => {
        if (cardIndex < 0 || cardIndex >= prevHand.length) {
          toast({ title: "Invalid Card", description: "Selected card does not exist.", variant: "destructive" })
          return prevHand
        }

        const cardToPlay = prevHand[cardIndex]

        if (playerEnergy < cardToPlay.cost) {
          toast({ title: "Not Enough Energy", description: `You need ${cardToPlay.cost} energy to play ${cardToPlay.name}.`, variant: "destructive" })
          addLog(`Not enough energy to play ${cardToPlay.name}.`)
          return prevHand
        }

        // Consume energy
        setPlayerEnergy((e) => e - cardToPlay.cost)
        // Move card from hand -> discard
        setPlayerDiscard((prev) => [...prev, cardToPlay])
        addLog(`You played ${cardToPlay.name}.`)

        // Resolve effect
        switch (cardToPlay.type) {
          case "attack":
            applyDamage(cardToPlay.value, "enemy")
            addLog(`Enemy took ${cardToPlay.value} damage.`)
            if (cardToPlay.name === "Drain Life") {
              const healAmount = Math.floor(cardToPlay.value / 2)
              setPlayerHealth((prev) => Math.min(MAX_HEALTH, prev + healAmount))
              addLog(`You healed for ${healAmount} health.`)
            }
            break
          case "defense":
            setPlayerBlock((prev) => prev + cardToPlay.value)
            addLog(`You gained ${cardToPlay.value} block.`)
            break
          case "heal":
            setPlayerHealth((prev) => Math.min(MAX_HEALTH, prev + cardToPlay.value))
            addLog(`You healed for ${cardToPlay.value} health.`)
            break
          case "energy":
            setPlayerEnergy((prev) => prev + cardToPlay.value)
            addLog(`You gained ${cardToPlay.value} energy.`)
            break
        }

        // remove the card from hand immutably
        const newHand = prevHand.slice(0, cardIndex).concat(prevHand.slice(cardIndex + 1))
        return newHand
      })
    },
    [isPlayerTurn, isGameOver, playerEnergy, addLog, applyDamage],
  )

  // Enemy AI action: choose cards to play given energy; simple greedy + randomness
  const enemyAct = useCallback(() => {
    if (isPlayerTurn || isGameOver) return

    const processEnemyTurn = () => {
      setEnemyEnergy((startEnergy) => {
        let energyLeft = startEnergy
        const toDiscard: Card[] = []
        const playedCards: Card[] = []
        let localEnemyHand: Card[] = []
        // Work with the latest enemyHand value by reading state inside a setter
        setEnemyHand((currentHand) => {
          localEnemyHand = [...currentHand] // copy so we can mutate locally
          // sort playable by type priority: attack > heal > defense > energy (and higher value first)
          // but add a little randomness to make behavior less predictable
          const playOrder = shuffle(localEnemyHand.filter((c) => c.cost <= energyLeft)).sort((a, b) => b.value - a.value)

          for (const card of playOrder) {
            if (card.cost <= energyLeft) {
              energyLeft -= card.cost
              // mark as played: remove only one instance (by index)
              const idx = localEnemyHand.findIndex((c) => c.id === card.id && c.name === card.name)
              if (idx >= 0) {
                const [played] = localEnemyHand.splice(idx, 1)
                playedCards.push(played)
                toDiscard.push(played)

                // apply effect immediately (enemy plays sequentially)
                switch (played.type) {
                  case "attack":
                    applyDamage(played.value, "player")
                    addLog(`Enemy played ${played.name} for ${played.value} damage.`)
                    break
                  case "defense":
                    setEnemyBlock((prev) => prev + played.value)
                    addLog(`Enemy gained ${played.value} block.`)
                    break
                  case "heal":
                    setEnemyHealth((prev) => Math.min(MAX_HEALTH, prev + played.value))
                    addLog(`Enemy healed for ${played.value} HP.`)
                    break
                  case "energy":
                    energyLeft += played.value
                    addLog(`Enemy gained ${played.value} energy.`)
                    break
                }
              }
            }
          }

          return localEnemyHand
        })

        // move played cards to enemy discard
        if (toDiscard.length > 0) {
          setEnemyDiscard((prev) => [...prev, ...toDiscard])
        }

        // update enemyEnergy to leftover
        // but at moment of finishing enemy turn we'll reset enemyEnergy next turn, so it's OK to set
        return energyLeft
      })

      // After enemy finishes playing, schedule draw and return turn to player
      // Draw 2 for enemy (already prepared in effect when turn switches), but we maintain the same pattern:
      // schedule end-of-enemy-turn after a short delay so UI shows actions
      enemyTimeoutRef.current = window.setTimeout(() => {
        addLog("Enemy turn ended.")
        setIsPlayerTurn(true)
      }, ENEMY_THINK_MS + 600)
    }

    // If we want some pacing between enemy plays, we can chain with timeouts.
    // For simplicity we run processEnemyTurn immediately but could be broken into steps.
    processEnemyTurn()
  }, [isPlayerTurn, isGameOver, applyDamage, addLog])

  // Player ends their turn
  const endTurn = useCallback(() => {
    if (!isPlayerTurn || isGameOver) {
      toast({ title: "Invalid Action", description: "It's not your turn or the game is over.", variant: "destructive" })
      return
    }

    addLog("You ended your turn.")
    // one might want to clear player's block at end of turn or keep it until used.
    // Common convention: block resets at start of your next turn. We'll keep block until consumed by damage.
    setIsPlayerTurn(false)
    // schedule enemy to act via isPlayerTurn effect
  }, [isPlayerTurn, isGameOver, addLog])

  // Reset game - expose for UI
  const resetGame = useCallback(() => {
    // clear pending timeouts
    if (enemyTimeoutRef.current) {
      window.clearTimeout(enemyTimeoutRef.current)
      enemyTimeoutRef.current = null
    }
    initializeGame()
  }, [initializeGame])

  // Exposed state & actions
  return {
    playerHealth,
    enemyHealth,
    playerBlock,
    enemyBlock,
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
    resetGame,
    isGameOver,
    gameResult,
  }
}
