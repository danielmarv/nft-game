"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Star, Heart, Zap, Coins, Crown, Sparkles, Gift } from "lucide-react"
import { toast } from "@/hooks/use-toast"

let BABYLON: any = null
let Engine: any = null
let Scene: any = null
let ArcRotateCamera: any = null
let HemisphericLight: any = null
let DirectionalLight: any = null
let MeshBuilder: any = null
let Vector3: any = null
let Color3: any = null
let Color4: any = null
let Animation: any = null
let StandardMaterial: any = null

interface NFTPet {
  id: string
  name: string
  type: "Dragon" | "Unicorn" | "Phoenix" | "Griffin" | "Pegasus"
  rarity: "Common" | "Rare" | "Epic" | "Legendary" | "Mythic"
  level: number
  experience: number
  stats: {
    happiness: number
    energy: number
    strength: number
    magic: number
    speed: number
  }
  traits: string[]
  value: number
  breeding: {
    canBreed: boolean
    cooldown: number
  }
}

const MOCK_PETS: NFTPet[] = [
  {
    id: "1",
    name: "Ember",
    type: "Dragon",
    rarity: "Legendary",
    level: 15,
    experience: 750,
    stats: { happiness: 85, energy: 90, strength: 95, magic: 88, speed: 70 },
    traits: ["Fire Breath", "Ancient Wisdom", "Treasure Guardian"],
    value: 2.5,
    breeding: { canBreed: true, cooldown: 0 },
  },
  {
    id: "2",
    name: "Stardust",
    type: "Unicorn",
    rarity: "Epic",
    level: 12,
    experience: 600,
    stats: { happiness: 95, energy: 85, strength: 60, magic: 98, speed: 85 },
    traits: ["Healing Aura", "Pure Heart", "Rainbow Mane"],
    value: 1.8,
    breeding: { canBreed: true, cooldown: 0 },
  },
  {
    id: "3",
    name: "Blaze",
    type: "Phoenix",
    rarity: "Mythic",
    level: 20,
    experience: 1000,
    stats: { happiness: 90, energy: 100, strength: 85, magic: 95, speed: 90 },
    traits: ["Rebirth", "Solar Flare", "Eternal Flame"],
    value: 5.2,
    breeding: { canBreed: false, cooldown: 24 },
  },
]

const ACHIEVEMENTS = [
  { id: 1, name: "First Pet", description: "Acquire your first NFT pet", unlocked: true, reward: 100 },
  { id: 2, name: "Breeder", description: "Successfully breed 5 pets", unlocked: false, reward: 500 },
  { id: 3, name: "Champion", description: "Win 10 battles", unlocked: false, reward: 1000 },
  { id: 4, name: "Collector", description: "Own 10 different pets", unlocked: false, reward: 2000 },
]

export default function PremiumNFTPetGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const sceneRef = useRef<any>(null)
  const petRef = useRef<any>(null)
  const engineRef = useRef<any>(null)
  const [babylonLoaded, setBabylonLoaded] = useState(false)

  const [pets] = useState<NFTPet[]>(MOCK_PETS)
  const [selectedPet, setSelectedPet] = useState<NFTPet>(MOCK_PETS[0])
  const [activeTab, setActiveTab] = useState("game")
  const [coins, setCoins] = useState(1250)
  const [lastInteraction, setLastInteraction] = useState<string | null>(null)

  useEffect(() => {
    const loadBabylon = async () => {
      try {
        const babylonCore = await import("@babylonjs/core")

        BABYLON = babylonCore
        Engine = babylonCore.Engine
        Scene = babylonCore.Scene
        ArcRotateCamera = babylonCore.ArcRotateCamera
        HemisphericLight = babylonCore.HemisphericLight
        DirectionalLight = babylonCore.DirectionalLight
        MeshBuilder = babylonCore.MeshBuilder
        Vector3 = babylonCore.Vector3
        Color3 = babylonCore.Color3
        Color4 = babylonCore.Color4
        Animation = babylonCore.Animation
        StandardMaterial = babylonCore.StandardMaterial

        console.log("Babylon.js loaded successfully")
        setBabylonLoaded(true)
      } catch (error) {
        console.error("Failed to load Babylon.js:", error)
      }
    }

    loadBabylon()
  }, [])

  const createMaterial = (scene: any, name: string, color: any) => {
    const material = new StandardMaterial(name, scene)
    material.diffuseColor = color
    material.specularColor = new Color3(0.2, 0.2, 0.2)
    return material
  }

  const createEnhancedPet = (scene: any, pet: NFTPet) => {
    try {
      console.log(" Creating pet:", pet.name)

      if (petRef.current) {
        petRef.current.dispose()
        petRef.current = null
      }

      // Create pet container
      const petNode = new BABYLON.TransformNode("petNode", scene)

      // Enhanced materials based on pet type and rarity
      let baseColor = new Color3(0.8, 0.8, 0.8)

      switch (pet.type) {
        case "Dragon":
          baseColor = new Color3(0.9, 0.2, 0.1)
          break
        case "Unicorn":
          baseColor = new Color3(1, 0.95, 1)
          break
        case "Phoenix":
          baseColor = new Color3(1, 0.6, 0.1)
          break
        case "Griffin":
          baseColor = new Color3(0.7, 0.5, 0.3)
          break
        case "Pegasus":
          baseColor = new Color3(0.9, 0.9, 0.95)
          break
      }

      const bodyMaterial = createMaterial(scene, "bodyMat", baseColor)

      // Enhanced body with better proportions
      const body = MeshBuilder.CreateSphere(
        "body",
        {
          diameterX: 1.4,
          diameterY: 1.8,
          diameterZ: 1.2,
          segments: 16,
        },
        scene,
      )
      body.material = bodyMaterial
      body.position.y = 1.2
      body.parent = petNode

      // Detailed head
      const head = MeshBuilder.CreateSphere("head", { diameter: 0.8, segments: 16 }, scene)
      head.material = bodyMaterial
      head.position.y = 2.3
      head.position.z = 0.3
      head.parent = petNode

      // Enhanced eyes with glow
      const eyeMaterial = createMaterial(scene, "eyeMat", new Color3(0.1, 0.8, 1))
      eyeMaterial.emissiveColor = new Color3(0.1, 0.4, 0.8)

      const eyeLeft = MeshBuilder.CreateSphere("eyeLeft", { diameter: 0.18 }, scene)
      eyeLeft.material = eyeMaterial
      eyeLeft.position = new Vector3(-0.22, 2.35, 0.55)
      eyeLeft.parent = petNode

      const eyeRight = MeshBuilder.CreateSphere("eyeRight", { diameter: 0.18 }, scene)
      eyeRight.material = eyeMaterial
      eyeRight.position = new Vector3(0.22, 2.35, 0.55)
      eyeRight.parent = petNode

      // Type-specific features
      if (pet.type === "Dragon") {
        // Wings
        const wingMaterial = createMaterial(scene, "wingMat", new Color3(0.6, 0.1, 0.1))
        const wingLeft = MeshBuilder.CreateBox("wingLeft", { width: 0.8, height: 1.2, depth: 0.1 }, scene)
        wingLeft.material = wingMaterial
        wingLeft.position = new Vector3(-0.8, 1.5, -0.2)
        wingLeft.rotation.z = Math.PI / 6
        wingLeft.parent = petNode

        const wingRight = MeshBuilder.CreateBox("wingRight", { width: 0.8, height: 1.2, depth: 0.1 }, scene)
        wingRight.material = wingMaterial
        wingRight.position = new Vector3(0.8, 1.5, -0.2)
        wingRight.rotation.z = -Math.PI / 6
        wingRight.parent = petNode

        // Spikes
        for (let i = 0; i < 3; i++) {
          const spike = MeshBuilder.CreateCylinder(
            "spike",
            { height: 0.4, diameterTop: 0.05, diameterBottom: 0.15 },
            scene,
          )
          spike.material = bodyMaterial
          spike.position = new Vector3(0, 1.8 + i * 0.3, -0.6 - i * 0.2)
          spike.parent = petNode
        }
      }

      if (pet.type === "Unicorn") {
        // Horn with spiral texture
        const hornMaterial = createMaterial(scene, "hornMat", new Color3(1, 0.9, 0.7))
        hornMaterial.emissiveColor = new Color3(0.3, 0.2, 0.4)
        const horn = MeshBuilder.CreateCylinder("horn", { height: 0.8, diameterTop: 0.05, diameterBottom: 0.25 }, scene)
        horn.material = hornMaterial
        horn.position.y = 2.8
        horn.position.z = 0.2
        horn.rotation.x = Math.PI / 12
        horn.parent = petNode
      }

      if (pet.type === "Phoenix") {
        // Flame crown
        const flameMaterial = createMaterial(scene, "flameMat", new Color3(1, 0.4, 0.1))
        flameMaterial.emissiveColor = new Color3(1, 0.6, 0.2)
        for (let i = 0; i < 5; i++) {
          const flame = MeshBuilder.CreateCylinder(
            "flame",
            { height: 0.6, diameterTop: 0.1, diameterBottom: 0.2 },
            scene,
          )
          flame.material = flameMaterial
          flame.position = new Vector3(
            Math.sin((i * Math.PI * 2) / 5) * 0.3,
            2.7,
            Math.cos((i * Math.PI * 2) / 5) * 0.3,
          )
          flame.parent = petNode
        }
      }

      petRef.current = petNode

      // Enhanced idle animation with floating effect
      const idleAnim = new Animation(
        "idle",
        "position.y",
        60,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CYCLE,
      )
      idleAnim.setKeys([
        { frame: 0, value: petNode.position.y },
        { frame: 60, value: petNode.position.y + 0.2 },
        { frame: 120, value: petNode.position.y },
      ])

      const rotateAnim = new Animation(
        "rotate",
        "rotation.y",
        60,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CYCLE,
      )
      rotateAnim.setKeys([
        { frame: 0, value: 0 },
        { frame: 300, value: Math.PI * 2 },
      ])

      petNode.animations = [idleAnim, rotateAnim]
      scene.beginAnimation(petNode, 0, 300, true)

      console.log(" Pet created successfully:", pet.name)
    } catch (error) {
      console.error(" Error creating pet:", error)
    }
  }

  useEffect(() => {
    if (!babylonLoaded || !canvasRef.current) return

    console.log(" Initializing 3D scene...")

    try {
      const engine = new Engine(canvasRef.current, true, {
        antialias: true,
        adaptToDeviceRatio: true,
      })
      engineRef.current = engine

      const scene = new Scene(engine)
      sceneRef.current = scene

      // Enhanced lighting setup
      scene.clearColor = new Color4(0.02, 0.02, 0.1, 1)

      const hemisphericLight = new HemisphericLight("hemi", new Vector3(0, 1, 0), scene)
      hemisphericLight.intensity = 0.6

      const directionalLight = new DirectionalLight("dir", new Vector3(-1, -1, -1), scene)
      directionalLight.intensity = 0.8
      directionalLight.diffuse = new Color3(1, 0.9, 0.8)

      // Enhanced camera with better positioning
      const camera = new ArcRotateCamera("cam", Math.PI / 2, Math.PI / 3, 8, Vector3.Zero(), scene)
      camera.attachControl(canvasRef.current, true)
      camera.setTarget(new Vector3(0, 1, 0))
      camera.lowerRadiusLimit = 4
      camera.upperRadiusLimit = 15

      // Enhanced ground
      const ground = MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, scene)
      const groundMaterial = createMaterial(scene, "groundMat", new Color3(0.1, 0.15, 0.2))
      ground.material = groundMaterial

      createEnhancedPet(scene, selectedPet)

      engine.runRenderLoop(() => {
        scene.render()
      })

      const handleResize = () => {
        engine.resize()
      }
      window.addEventListener("resize", handleResize)

      console.log(" 3D scene initialized successfully")

      return () => {
        window.removeEventListener("resize", handleResize)
        engine.dispose()
      }
    } catch (error) {
      console.error(" Error initializing 3D scene:", error)
    }
  }, [babylonLoaded])

  // Update pet when selection changes
  useEffect(() => {
    if (sceneRef.current && babylonLoaded) {
      createEnhancedPet(sceneRef.current, selectedPet)
    }
  }, [selectedPet, babylonLoaded])

  const interact = useCallback(
    (action: "hug" | "feed" | "play" | "train") => {
      if (!petRef.current || !sceneRef.current) return

      const scene = sceneRef.current
      const mesh = petRef.current
      let coinsEarned = 0
      let expGained = 0

      console.log(" Interaction:", action)

      switch (action) {
        case "hug":
          coinsEarned = 10
          expGained = 5

          // Gentle sway animation
          const hugAnim = new Animation(
            "hug",
            "rotation.z",
            60,
            Animation.ANIMATIONTYPE_FLOAT,
            Animation.ANIMATIONLOOPMODE_CYCLE,
          )
          hugAnim.setKeys([
            { frame: 0, value: 0 },
            { frame: 15, value: 0.2 },
            { frame: 30, value: -0.2 },
            { frame: 45, value: 0 },
          ])
          mesh.animations = [hugAnim]
          scene.beginAnimation(mesh, 0, 45, false)

          toast({ title: "💖 Hugged!", description: `${selectedPet.name} feels loved! +${coinsEarned} coins` })
          break

        case "feed":
          coinsEarned = 15
          expGained = 8

          // Bounce animation
          const feedAnim = new Animation(
            "feed",
            "position.y",
            60,
            Animation.ANIMATIONTYPE_FLOAT,
            Animation.ANIMATIONLOOPMODE_CYCLE,
          )
          feedAnim.setKeys([
            { frame: 0, value: mesh.position.y },
            { frame: 20, value: mesh.position.y + 0.4 },
            { frame: 40, value: mesh.position.y },
          ])
          mesh.animations = [feedAnim]
          scene.beginAnimation(mesh, 0, 40, false)

          toast({ title: "🍎 Fed!", description: `${selectedPet.name} is satisfied! +${coinsEarned} coins` })
          break

        case "play":
          coinsEarned = 20
          expGained = 12

          // Spin and jump animation
          const playAnim = new Animation(
            "play",
            "rotation.y",
            60,
            Animation.ANIMATIONTYPE_FLOAT,
            Animation.ANIMATIONLOOPMODE_CYCLE,
          )
          playAnim.setKeys([
            { frame: 0, value: 0 },
            { frame: 30, value: Math.PI * 2 },
          ])
          const jumpAnim = new Animation(
            "jump",
            "position.y",
            60,
            Animation.ANIMATIONTYPE_FLOAT,
            Animation.ANIMATIONLOOPMODE_CYCLE,
          )
          jumpAnim.setKeys([
            { frame: 0, value: mesh.position.y },
            { frame: 15, value: mesh.position.y + 0.6 },
            { frame: 30, value: mesh.position.y },
          ])
          mesh.animations = [playAnim, jumpAnim]
          scene.beginAnimation(mesh, 0, 30, false)

          toast({ title: "🎾 Played!", description: `${selectedPet.name} had fun! +${coinsEarned} coins` })
          break

        case "train":
          coinsEarned = 25
          expGained = 20

          // Power-up animation with scaling
          const trainAnim = new Animation(
            "train",
            "scaling",
            60,
            Animation.ANIMATIONTYPE_VECTOR3,
            Animation.ANIMATIONLOOPMODE_CYCLE,
          )
          trainAnim.setKeys([
            { frame: 0, value: new Vector3(1, 1, 1) },
            { frame: 20, value: new Vector3(1.2, 1.2, 1.2) },
            { frame: 40, value: new Vector3(1, 1, 1) },
          ])
          mesh.animations = [trainAnim]
          scene.beginAnimation(mesh, 0, 40, false)

          toast({ title: "💪 Trained!", description: `${selectedPet.name} grew stronger! +${coinsEarned} coins` })
          break
      }

      setCoins((prev) => prev + coinsEarned)
      setLastInteraction(action)

      // Update pet stats (simplified for demo)
      setSelectedPet((prev) => ({
        ...prev,
        experience: prev.experience + expGained,
        stats: {
          ...prev.stats,
          happiness: Math.min(100, prev.stats.happiness + 5),
          energy: action === "train" ? Math.max(0, prev.stats.energy - 10) : Math.min(100, prev.stats.energy + 3),
        },
      }))
    },
    [selectedPet],
  )

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-gray-500"
      case "Rare":
        return "bg-blue-500"
      case "Epic":
        return "bg-purple-500"
      case "Legendary":
        return "bg-yellow-600"
      case "Mythic":
        return "bg-gradient-to-r from-pink-500 to-purple-600"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Crown className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-[var(--font-playfair)]">
              CryptoCreatures
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
              <Coins className="h-4 w-4 text-primary" />
              <span className="font-semibold text-primary-foreground">{coins}</span>
            </div>
            <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
              Level {selectedPet.level}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="game" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Game
            </TabsTrigger>
            <TabsTrigger value="collection" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Collection
            </TabsTrigger>
            <TabsTrigger value="breeding" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Breeding
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 3D Viewport */}
              <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Badge className={`${getRarityColor(selectedPet.rarity)} text-white`}>
                          {selectedPet.rarity}
                        </Badge>
                        {selectedPet.name}
                      </CardTitle>
                      <div className="flex gap-2">
                        {pets.map((pet) => (
                          <Button
                            key={pet.id}
                            variant={selectedPet.id === pet.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedPet(pet)}
                            className="text-xs"
                          >
                            {pet.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {!babylonLoaded ? (
                      <div className="w-full h-[500px] bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center">
                        <div className="text-center">
                          <Sparkles className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                          <p className="text-muted-foreground">Loading 3D Engine...</p>
                        </div>
                      </div>
                    ) : (
                      <canvas
                        ref={canvasRef}
                        className="w-full h-[500px] bg-gradient-to-b from-slate-800 to-slate-900"
                      />
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Pet Stats & Controls */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pet Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Happiness</span>
                          <span>{selectedPet.stats.happiness}/100</span>
                        </div>
                        <Progress value={selectedPet.stats.happiness} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Energy</span>
                          <span>{selectedPet.stats.energy}/100</span>
                        </div>
                        <Progress value={selectedPet.stats.energy} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Experience</span>
                          <span>{selectedPet.experience}/1000</span>
                        </div>
                        <Progress value={(selectedPet.experience / 1000) * 100} className="h-2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div className="bg-muted p-2 rounded">
                        <div className="font-semibold text-primary">{selectedPet.stats.strength}</div>
                        <div className="text-muted-foreground">Strength</div>
                      </div>
                      <div className="bg-muted p-2 rounded">
                        <div className="font-semibold text-accent">{selectedPet.stats.magic}</div>
                        <div className="text-muted-foreground">Magic</div>
                      </div>
                      <div className="bg-muted p-2 rounded">
                        <div className="font-semibold text-blue-500">{selectedPet.stats.speed}</div>
                        <div className="text-muted-foreground">Speed</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Interactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => interact("hug")}
                        className="bg-pink-500 hover:bg-pink-600 text-white"
                        size="sm"
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        Hug
                      </Button>
                      <Button
                        onClick={() => interact("feed")}
                        className="bg-green-500 hover:bg-green-600 text-white"
                        size="sm"
                      >
                        <Gift className="h-4 w-4 mr-1" />
                        Feed
                      </Button>
                      <Button
                        onClick={() => interact("play")}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        size="sm"
                      >
                        <Sparkles className="h-4 w-4 mr-1" />
                        Play
                      </Button>
                      <Button
                        onClick={() => interact("train")}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                        size="sm"
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        Train
                      </Button>
                    </div>
                    {lastInteraction && (
                      <div className="mt-3 text-sm text-muted-foreground text-center">
                        Last action: {lastInteraction}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pet Traits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedPet.traits.map((trait, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">Value: {selectedPet.value} ETH</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="collection" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{pet.name}</CardTitle>
                      <Badge className={`${getRarityColor(pet.rarity)} text-white text-xs`}>{pet.rarity}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        Type: {pet.type} • Level {pet.level}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Happiness: {pet.stats.happiness}</div>
                        <div>Energy: {pet.stats.energy}</div>
                        <div>Strength: {pet.stats.strength}</div>
                        <div>Magic: {pet.stats.magic}</div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-semibold">{pet.value} ETH</span>
                        <Button
                          size="sm"
                          onClick={() => setSelectedPet(pet)}
                          variant={selectedPet.id === pet.id ? "default" : "outline"}
                        >
                          {selectedPet.id === pet.id ? "Selected" : "Select"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="breeding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Breeding Laboratory</CardTitle>
                <p className="text-muted-foreground">Combine two pets to create unique offspring with mixed traits</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Heart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Breeding System</h3>
                  <p>Select two compatible pets to create new generations</p>
                  <Button className="mt-4" disabled>
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ACHIEVEMENTS.map((achievement) => (
                <Card key={achievement.id} className={achievement.unlocked ? "border-primary" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Trophy
                          className={`h-5 w-5 ${achievement.unlocked ? "text-primary" : "text-muted-foreground"}`}
                        />
                        {achievement.name}
                      </CardTitle>
                      {achievement.unlocked && <Badge className="bg-primary text-primary-foreground">Unlocked</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">{achievement.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Reward: {achievement.reward} coins</span>
                      {achievement.unlocked && (
                        <Button size="sm" variant="outline" disabled>
                          Claimed
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
