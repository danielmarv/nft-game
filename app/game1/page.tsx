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

export default function CustomPetGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const sceneRef = useRef<BABYLON.Scene | null>(null)
  const petRef = useRef<BABYLON.TransformNode | null>(null)

  const [pets] = useState<Pet[]>(MOCK_PETS)
  const [selectedPet, setSelectedPet] = useState<Pet>(MOCK_PETS[0])
  const [happiness, setHappiness] = useState<number>(70)
  const [energy, setEnergy] = useState<number>(80)

  // Function to create custom pets
  const createCustomPet = (scene: BABYLON.Scene, pet: Pet) => {
    if (petRef.current) {
      petRef.current.dispose()
      petRef.current = null
    }

    const petNode = new BABYLON.TransformNode("pet", scene)

    // Base colors
    let bodyColor = new Color3(0.8, 0.8, 0.8)
    if (pet.type === 2) bodyColor = new Color3(1, 0.8, 1) // Unicorn
    if (pet.type === 3) bodyColor = new Color3(0.9, 0.3, 0.2) // Dragon

    const mat = new StandardMaterial("petMat", scene)
    mat.diffuseColor = bodyColor

    // Body
    const body = MeshBuilder.CreateSphere("body", { diameter: 1.5 }, scene)
    body.material = mat
    body.position.y = 1
    body.parent = petNode

    // Head
    const head = MeshBuilder.CreateSphere("head", { diameter: 0.8 }, scene)
    head.material = mat
    head.position.y = 2.1
    head.position.z = 0.3
    head.parent = petNode

    // Eyes
    const eyeMat = new StandardMaterial("eyeMat", scene)
    eyeMat.diffuseColor = new Color3(0, 0, 0)
    const eyeLeft = MeshBuilder.CreateSphere("eyeLeft", { diameter: 0.15 }, scene)
    eyeLeft.material = eyeMat
    eyeLeft.position = new Vector3(-0.2, 2.2, 0.6)
    eyeLeft.parent = petNode
    const eyeRight = MeshBuilder.CreateSphere("eyeRight", { diameter: 0.15 }, scene)
    eyeRight.material = eyeMat
    eyeRight.position = new Vector3(0.2, 2.2, 0.6)
    eyeRight.parent = petNode

    // Tail (unique for dragons and pets)
    if (pet.type !== 2) {
      const tail = MeshBuilder.CreateCylinder("tail", { height: 0.8, diameterTop: 0.2, diameterBottom: 0.3 }, scene)
      tail.material = mat
      tail.position.y = 0.8
      tail.position.z = -0.8
      tail.rotation.x = Math.PI / 4
      tail.parent = petNode
    }

    // Horn for unicorn
    if (pet.type === 2) {
      const horn = MeshBuilder.CreateCylinder("horn", { height: 0.6, diameterTop: 0.1, diameterBottom: 0.2 }, scene)
      horn.material = mat
      horn.position.y = 2.7
      horn.position.z = 0.1
      horn.rotation.x = Math.PI / 2
      horn.parent = petNode
    }

    petRef.current = petNode

    // Simple idle bounce animation
    const anim = new Animation(
      "bounce",
      "position.y",
      60,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    )
    anim.setKeys([
      { frame: 0, value: petNode.position.y },
      { frame: 20, value: petNode.position.y + 0.2 },
      { frame: 40, value: petNode.position.y },
    ])
    petNode.animations = [anim]
    scene.beginAnimation(petNode, 0, 40, true)
  }

  // Initialize scene
  useEffect(() => {
    if (!canvasRef.current) return
    const engine = new Engine(canvasRef.current, true)
    const scene = new BABYLON.Scene(engine)
    sceneRef.current = scene
    scene.clearColor = new Color4(0, 0, 0, 1)

    const camera = new ArcRotateCamera("cam", Math.PI / 2, Math.PI / 3, 6, Vector3.Zero(), scene)
    camera.attachControl(canvasRef.current, true)
    new HemisphericLight("hemi", new Vector3(0, 1, 0), scene)
    MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene)

    createCustomPet(scene, selectedPet)

    engine.runRenderLoop(() => {
      scene.render()
    })
    return () => engine.dispose()
  }, [])

  // Update pet on selection
  useEffect(() => {
    if (sceneRef.current) createCustomPet(sceneRef.current, selectedPet)
  }, [selectedPet])

  // Pet interaction
  const interact = (action: "hug" | "feed" | "play") => {
    if (!petRef.current || !sceneRef.current) return
    let newHappiness = happiness
    let newEnergy = energy

    switch (action) {
      case "hug": newHappiness = Math.min(100, happiness + 10); break
      case "feed": newEnergy = Math.min(100, energy + 20); newHappiness = Math.min(100, happiness + 5); break
      case "play":
        newHappiness = Math.min(100, happiness + 15)
        newEnergy = Math.max(0, energy - 10)
        // Dragon fire particles
        if (selectedPet.type === 3) {
          const fire = new ParticleSystem("fire", 500, sceneRef.current)
          fire.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/particles/fire.png", sceneRef.current)
          fire.emitter = petRef.current.position.clone()
          fire.start()
          setTimeout(() => fire.stop(), 500)
        }
        break
    }
    setHappiness(newHappiness)
    setEnergy(newEnergy)

    // Bounce animation
    const mesh = petRef.current
    const anim = new Animation(
      "pop",
      "position.y",
      60,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    )
    anim.setKeys([
      { frame: 0, value: mesh.position.y },
      { frame: 10, value: mesh.position.y + 0.3 },
      { frame: 20, value: mesh.position.y },
    ])
    mesh.animations = [anim]
    sceneRef.current.beginAnimation(mesh, 0, 20, false)
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 to-black flex flex-col items-center justify-center">
      {/* Pet selection */}
      <div className="absolute top-4 left-4 flex gap-2 bg-white/10 p-2 rounded-lg z-10">
        {pets.map(pet => (
          <button
            key={pet.id}
            onClick={() => setSelectedPet(pet)}
            className={`px-3 py-1 rounded ${selectedPet.id === pet.id ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}
          >
            {pet.name}
          </button>
        ))}
      </div>

      <canvas ref={canvasRef} className="w-full h-3/4" />

      {/* Interactions */}
      <div className="flex gap-4 mt-4">
        <button className="px-4 py-2 bg-red-500 rounded text-white" onClick={() => interact("hug")}>Hug</button>
        <button className="px-4 py-2 bg-green-500 rounded text-white" onClick={() => interact("feed")}>Feed</button>
        <button className="px-4 py-2 bg-blue-500 rounded text-white" onClick={() => interact("play")}>Play</button>
      </div>

      {/* Stats */}
      <div className="flex gap-6 mt-4 text-white">
        <div>Happiness: {happiness}</div>
        <div>Energy: {energy}</div>
      </div>
    </div>
  )
}
