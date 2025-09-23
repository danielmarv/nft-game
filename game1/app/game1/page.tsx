"use client"

import React, { useEffect, useRef, useState } from "react"
import * as BABYLON from "@babylonjs/core"
import "@babylonjs/loaders"
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera"
import { Engine } from "@babylonjs/core/Engines/engine"
import { ParticleSystem } from "@babylonjs/core/Particles/particleSystem"
import { Vector3, Color4, Color3, HemisphericLight, MeshBuilder, StandardMaterial, Animation } from "@babylonjs/core"

interface Pet {
  id: string
  name: string
  type: number // 1 = Pet, 2 = Unicorn, 3 = Dragon
}

const MOCK_PETS: Pet[] = [
  { id: "1", name: "Dragon", type: 3 },
  { id: "2", name: "Unicorn", type: 2 },
  { id: "3", name: "Pet", type: 1 },
]

export default function ProfessionalPetGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const sceneRef = useRef<BABYLON.Scene | null>(null)
  const petRef = useRef<BABYLON.TransformNode | null>(null)

  const [pets] = useState<Pet[]>(MOCK_PETS)
  const [selectedPet, setSelectedPet] = useState<Pet>(MOCK_PETS[0])
  const [happiness, setHappiness] = useState<number>(70)
  const [energy, setEnergy] = useState<number>(80)

  // Helper: Create materials with gradient
  const createMat = (scene: BABYLON.Scene, color: Color3, emissive?: Color3) => {
    const mat = new StandardMaterial("mat", scene)
    mat.diffuseColor = color
    if (emissive) mat.emissiveColor = emissive
    return mat
  }

  // Create refined pet
  const createCustomPet = (scene: BABYLON.Scene, pet: Pet) => {
    if (petRef.current) {
      petRef.current.dispose()
      petRef.current = null
    }

    const petNode = new BABYLON.TransformNode("petNode", scene)

    // Body colors
    let bodyColor = new Color3(0.8, 0.8, 0.8)
    if (pet.type === 2) bodyColor = new Color3(1, 0.8, 1)
    if (pet.type === 3) bodyColor = new Color3(0.9, 0.3, 0.2)
    const bodyMat = createMat(scene, bodyColor)

    // Body (slightly elongated)
    const body = MeshBuilder.CreateSphere("body", { diameterX: 1.2, diameterY: 1.5, diameterZ: 1.0 }, scene)
    body.material = bodyMat
    body.position.y = 1
    body.parent = petNode

    // Head
    const head = MeshBuilder.CreateSphere("head", { diameter: 0.7 }, scene)
    head.material = bodyMat
    head.position.y = 2.1
    head.position.z = 0.2
    head.parent = petNode

    // Eyes
    const eyeMat = createMat(scene, new Color3(0, 0, 0), new Color3(0.1, 0.1, 0.1))
    const eyeLeft = MeshBuilder.CreateSphere("eyeLeft", { diameter: 0.15 }, scene)
    eyeLeft.material = eyeMat
    eyeLeft.position = new Vector3(-0.2, 2.2, 0.5)
    eyeLeft.parent = petNode
    const eyeRight = MeshBuilder.CreateSphere("eyeRight", { diameter: 0.15 }, scene)
    eyeRight.material = eyeMat
    eyeRight.position = new Vector3(0.2, 2.2, 0.5)
    eyeRight.parent = petNode

    // Tail for dragons and pets
    if (pet.type !== 2) {
      const tail = MeshBuilder.CreateCylinder("tail", { height: 0.8, diameterTop: 0.15, diameterBottom: 0.25 }, scene)
      tail.material = bodyMat
      tail.position.y = 0.7
      tail.position.z = -0.8
      tail.rotation.x = Math.PI / 4
      tail.parent = petNode
    }

    // Horn for unicorn
    if (pet.type === 2) {
      const horn = MeshBuilder.CreateCylinder("horn", { height: 0.6, diameterTop: 0.1, diameterBottom: 0.2 }, scene)
      horn.material = createMat(scene, new Color3(1, 1, 0.5), new Color3(1, 0.9, 0))
      horn.position.y = 2.6
      horn.position.z = 0.1
      horn.rotation.x = Math.PI / 2
      horn.parent = petNode
    }

    petRef.current = petNode

    // Idle bob animation
    const idleAnim = new Animation(
      "idle",
      "position.y",
      60,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    )
    idleAnim.setKeys([
      { frame: 0, value: petNode.position.y },
      { frame: 40, value: petNode.position.y + 0.15 },
      { frame: 80, value: petNode.position.y },
    ])
    petNode.animations = [idleAnim]
    scene.beginAnimation(petNode, 0, 80, true)
  }

  // Init scene
  useEffect(() => {
    if (!canvasRef.current) return
    const engine = new Engine(canvasRef.current, true)
    const scene = new BABYLON.Scene(engine)
    sceneRef.current = scene
    scene.clearColor = new Color4(0.05, 0.05, 0.05, 1)

    const camera = new ArcRotateCamera("cam", Math.PI / 2, Math.PI / 3, 6, Vector3.Zero(), scene)
    camera.attachControl(canvasRef.current, true)
    new HemisphericLight("hemi", new Vector3(0, 1, 0), scene)
    MeshBuilder.CreateGround("ground", { width: 12, height: 12 }, scene)

    createCustomPet(scene, selectedPet)

    engine.runRenderLoop(() => {
      scene.render()
    })
    return () => engine.dispose()
  }, [])

  // Pet selection
  useEffect(() => {
    if (sceneRef.current) createCustomPet(sceneRef.current, selectedPet)
  }, [selectedPet])

  // Enhanced interaction
  const interact = (action: "hug" | "feed" | "play") => {
    if (!petRef.current || !sceneRef.current) return
    let newHappiness = happiness
    let newEnergy = energy
    const mesh = petRef.current

    const scene = sceneRef.current

    switch (action) {
      case "hug":
        newHappiness = Math.min(100, happiness + 15)
        // Lean head forward
        mesh.rotation.x = 0
        const hugAnim = new Animation("hug", "rotation.x", 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
        hugAnim.setKeys([
          { frame: 0, value: 0 },
          { frame: 10, value: -0.3 },
          { frame: 20, value: 0 },
        ])
        mesh.animations = [hugAnim]
        scene.beginAnimation(mesh, 0, 20, false)
        break
      case "feed":
        newEnergy = Math.min(100, energy + 25)
        newHappiness = Math.min(100, happiness + 10)
        // Small bounce
        const feedAnim = new Animation("feed", "position.y", 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
        feedAnim.setKeys([
          { frame: 0, value: mesh.position.y },
          { frame: 15, value: mesh.position.y + 0.25 },
          { frame: 30, value: mesh.position.y },
        ])
        mesh.animations = [feedAnim]
        scene.beginAnimation(mesh, 0, 30, false)
        break
      case "play":
        newHappiness = Math.min(100, happiness + 20)
        newEnergy = Math.max(0, energy - 15)
        // Jump & spin
        const playAnim = new Animation("play", "rotation.y", 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
        playAnim.setKeys([
          { frame: 0, value: 0 },
          { frame: 20, value: Math.PI * 2 },
        ])
        mesh.animations = [playAnim]
        scene.beginAnimation(mesh, 0, 20, false)

        // Dragon fire particle
        if (selectedPet.type === 3) {
          const fire = new ParticleSystem("fire", 500, scene)
          fire.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/particles/fire.png", scene)
          fire.emitter = mesh.position.clone()
          fire.start()
          setTimeout(() => fire.stop(), 500)
        }

        // Unicorn sparkles
        if (selectedPet.type === 2) {
          const sparkle = new ParticleSystem("sparkle", 200, scene)
          sparkle.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/particles/sparkle.png", scene)
          sparkle.emitter = mesh.position.clone()
          sparkle.start()
          setTimeout(() => sparkle.stop(), 500)
        }

        break
    }

    setHappiness(newHappiness)
    setEnergy(newEnergy)
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 to-black flex flex-col items-center justify-center">
      {/* Pet selection */}
      <div className="absolute top-4 left-4 flex gap-2 bg-white/10 p-2 rounded-lg z-10">
        {pets.map(pet => (
          <button
            key={pet.id}
            onClick={() => setSelectedPet(pet)}
            className={`px-3 py-1 rounded font-semibold ${selectedPet.id === pet.id ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}
          >
            {pet.name}
          </button>
        ))}
      </div>

      <canvas ref={canvasRef} className="w-full h-3/4 rounded-lg shadow-lg" />

      {/* Interaction buttons */}
      <div className="flex gap-4 mt-4">
        <button className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-all text-white font-bold" onClick={() => interact("hug")}>Hug</button>
        <button className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition-all text-white font-bold" onClick={() => interact("feed")}>Feed</button>
        <button className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-all text-white font-bold" onClick={() => interact("play")}>Play</button>
      </div>

      {/* Stats */}
      <div className="flex gap-6 mt-4 text-white font-semibold">
        <div>Happiness: {happiness}</div>
        <div>Energy: {energy}</div>
      </div>
    </div>
  )
}
