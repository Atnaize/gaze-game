import { useEffect, useState } from 'react'
import { useGameStore } from '../stores/gameStore'
import { useBuildingStore } from '../stores/buildingStore'
import { BuildingFactory } from '../game/factories/BuildingFactory'
import { Position, BuildingType } from '../types'
import { PreviewManager } from '../game/managers/PreviewManager'

interface UseGameInputProps {
  scene?: Phaser.Scene
  previewManager?: PreviewManager
  GRID_SIZE?: number
  isValidGridPosition?: (x: number, y: number) => boolean
}

export const useGameInput = ({ 
  scene, 
  previewManager, 
  GRID_SIZE = 40,
  isValidGridPosition = () => true 
}: UseGameInputProps = {}) => {
  const [previewCenter, setPreviewCenter] = useState<Position>({ x: -1, y: -1 })
  
  // Store hooks
  const { 
    gazeCenter, 
    gameMode, 
    rotateGaze: storeRotateGaze, 
    moveGaze, 
    setDemolishMode, 
    setBuildingMode,
    resetModes,
    canAfford,
    consumeResource
  } = useGameStore()
  
  const { addBuilding, removeBuilding, getBuildingAt } = useBuildingStore()

  const updatePreviewStrategy = () => {
    if (!previewManager) return
    
    if (gameMode.demolish) {
      previewManager.setDemolishPreview()
    } else if (gameMode.building) {
      previewManager.setBuildingPreview(gameMode.building as BuildingType)
    } else {
      previewManager.setGazePreview()
    }
  }

  const handlePointerMove = (pointer: Phaser.Input.Pointer) => {
    if (!scene) return
    
    const gridX = Math.floor(pointer.x / GRID_SIZE)
    const gridY = Math.floor(pointer.y / GRID_SIZE)
    
    if (isValidGridPosition(gridX, gridY)) {
      setPreviewCenter({ x: gridX, y: gridY })
      updatePreviewStrategy()
      previewManager?.updatePreview(gridX, gridY)
    } else {
      setPreviewCenter({ x: -1, y: -1 })
      previewManager?.updatePreview(-1, -1)
    }
  }

  const handlePointerOut = () => {
    previewManager?.updatePreview(-1, -1)
    setPreviewCenter({ x: -1, y: -1 })
  }

  const handlePointerDown = (pointer: Phaser.Input.Pointer) => {
    if (!pointer.leftButtonDown() || !scene) return
    
    const gridX = Math.floor(pointer.x / GRID_SIZE)
    const gridY = Math.floor(pointer.y / GRID_SIZE)
    
    if (!isValidGridPosition(gridX, gridY)) return
    
    if (gameMode.demolish) {
      removeBuilding({ x: gridX, y: gridY })
    } else if (gameMode.building) {
      placeBuilding(gameMode.building as BuildingType, gridX, gridY)
    } else {
      moveGaze({ x: gridX, y: gridY })
    }
  }

  const placeBuilding = (type: BuildingType, x: number, y: number) => {
    const existingBuilding = getBuildingAt(x, y)
    if (existingBuilding) return false
    
    const cost = BuildingFactory.getBuildingCost(type)
    if (!canAfford(cost)) return false
    
    // Consume resources
    Object.entries(cost).forEach(([resourceType, amount]) => {
      if (amount) {
        consumeResource(resourceType as keyof typeof cost, amount)
      }
    })
    
    // Create building
    const building = BuildingFactory.createBuilding(type, x, y)
    
    // Create Phaser objects if scene is available
    if (scene) {
      // Map building type to sprite key
      let spriteKey: string
      switch (type) {
        case 'farm':
          spriteKey = 'farm'
          break
        case 'mine':
          spriteKey = 'mine'
          break
        case 'barracks':
          spriteKey = 'barracks'
          break
        default:
          spriteKey = 'farm' // fallback
      }

      // Create image sprite
      building.sprite = scene.add.image(
        x * GRID_SIZE + GRID_SIZE / 2,
        y * GRID_SIZE + GRID_SIZE / 2,
        spriteKey
      )

      // Scale sprite to fit grid cell
      const scaleX = (GRID_SIZE - 4) / building.sprite.width
      const scaleY = (GRID_SIZE - 4) / building.sprite.height
      const scale = Math.min(scaleX, scaleY) // Maintain aspect ratio
      building.sprite.setScale(scale)
      
      
      building.cooldownCircle = scene.add.graphics()
    }
    
    addBuilding(building)
    setBuildingMode(null)
    return true
  }

  const rotateGaze = () => {
    storeRotateGaze()
    // Update preview if mouse is over grid and in gaze mode
    if (previewCenter.x >= 0 && previewCenter.y >= 0 && !gameMode.demolish && !gameMode.building) {
      previewManager?.updatePreview(previewCenter.x, previewCenter.y)
    }
  }

  const toggleDemolishMode = () => {
    const newDemolishMode = !gameMode.demolish
    setDemolishMode(newDemolishMode)
    
    // Update preview
    updatePreviewStrategy()
    if (previewCenter.x >= 0 && previewCenter.y >= 0) {
      previewManager?.updatePreview(previewCenter.x, previewCenter.y)
    }
  }

  const setupInput = () => {
    if (!scene?.input) return
    
    // Mouse events
    scene.input.on('pointermove', handlePointerMove)
    scene.input.on('pointerout', handlePointerOut)
    scene.input.on('pointerdown', handlePointerDown)
    
    // Keyboard events
    try {
      if (scene.input.keyboard) {
        scene.input.keyboard.on('keydown-R', rotateGaze)
        scene.input.keyboard.on('keydown-D', toggleDemolishMode)
      }
    } catch (error) {
      console.warn('Keyboard setup error:', error)
    }
    
    return () => {
      scene.input.off('pointermove', handlePointerMove)
      scene.input.off('pointerout', handlePointerOut)
      scene.input.off('pointerdown', handlePointerDown)
      
      if (scene.input.keyboard) {
        scene.input.keyboard.off('keydown-R', rotateGaze)
        scene.input.keyboard.off('keydown-D', toggleDemolishMode)
      }
    }
  }

  return {
    setupInput,
    rotateGaze,
    toggleDemolishMode,
    placeBuilding,
    previewCenter,
    updatePreviewStrategy
  }
}