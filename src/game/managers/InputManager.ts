import { Position, GameMode } from '../../types'
import { GameConfig } from '../../config/GameConfig'
import { useGameStore } from '../../stores/gameStore'
import { useBuildingStore } from '../../stores/buildingStore'
import { BuildingRegistry } from '../buildings/BuildingRegistry'

export class InputManager {
  private scene: Phaser.Scene
  private readonly GRID_SIZE: number
  private previewRotation: number = 0

  // Callback functions for actions
  private onPlaceBuilding?: (type: string, x: number, y: number) => void
  private onMoveGaze?: (position: Position) => void
  private onRemoveBuilding?: (position: Position) => void
  private onUpdatePreview?: () => void

  constructor(scene: Phaser.Scene, gridSize: number) {
    this.scene = scene
    this.GRID_SIZE = gridSize
  }

  public setupInput(): void {
    if (!this.scene.input) return

    // Mouse click handling
    this.scene.input.on('pointerdown', this.handleClick.bind(this))

    // Mouse move handling for preview
    this.scene.input.on('pointermove', this.handleMouseMove.bind(this))

    // Keyboard input
    if (this.scene.input.keyboard) {
      // R key for rotation
      this.scene.input.keyboard.on('keydown-R', () => {
        this.rotatePreview()
      })

      // D key for demolish mode
      this.scene.input.keyboard.on('keydown-D', () => {
        this.toggleDemolishMode()
      })

      // Number keys for building selection
      this.scene.input.keyboard.on('keydown-ONE', () => this.selectBuildingType('farm'))
      this.scene.input.keyboard.on('keydown-TWO', () => this.selectBuildingType('mine'))
      this.scene.input.keyboard.on('keydown-THREE', () => this.selectBuildingType('barracks'))

      // Escape to clear modes
      this.scene.input.keyboard.on('keydown-ESC', () => {
        this.clearModes()
      })
    }
  }

  private handleMouseMove(pointer: Phaser.Input.Pointer): void {
    // Convert screen coordinates to grid coordinates
    const gridX = Math.floor(pointer.x / this.GRID_SIZE)
    const gridY = Math.floor(pointer.y / this.GRID_SIZE)

    const gameState = useGameStore.getState()

    // Check if mouse is within grid bounds
    if (gridX < 0 || gridX >= gameState.gridWidth || gridY < 0 || gridY >= gameState.gridHeight) {
      return
    }

    // Update preview if callback is set
    if (this.onUpdatePreview) {
      this.onUpdatePreview()
    }
  }

  private handleClick(pointer: Phaser.Input.Pointer): void {
    // Convert screen coordinates to grid coordinates
    const gridX = Math.floor(pointer.x / this.GRID_SIZE)
    const gridY = Math.floor(pointer.y / this.GRID_SIZE)
    const gameState = useGameStore.getState()
    const { getBuilding } = useBuildingStore.getState()

    // Check if click is within grid bounds
    if (gridX < 0 || gridX >= gameState.gridWidth || gridY < 0 || gridY >= gameState.gridHeight) {
      return
    }

    const gameMode = gameState.gameMode

    if (gameMode.demolish) {
      this.handleDemolish(gridX, gridY)
    } else if (gameMode.building) {
      this.handleBuildingPlacement(gameMode.building, gridX, gridY)
    } else {
      this.handleGazeMovement({ x: gridX, y: gridY })
    }
  }

  private handleDemolish(gridX: number, gridY: number): void {
    const { getBuilding } = useBuildingStore.getState()

    const building = getBuilding({ x: gridX, y: gridY })
    if (building) {
      if (this.onRemoveBuilding) {
        this.onRemoveBuilding({ x: gridX, y: gridY })
      } else {
        console.warn('onRemoveBuilding callback not set!')
      }
    } else {
      console.log('No building to demolish at this position')
      console.log('Available buildings:', useBuildingStore.getState().getAllBuildings().map(b => `${b.type} at (${b.x}, ${b.y})`))
    }
  }

  private handleBuildingPlacement(buildingType: string, gridX: number, gridY: number): void {
    const { getBuilding } = useBuildingStore.getState()
    const { canAfford, consumeResource } = useGameStore.getState()

    const existingBuilding = getBuilding({ x: gridX, y: gridY })
    if (existingBuilding) {
      console.log('Cannot place building - position occupied')
      return
    }

    // Check affordability
    const buildingDef = BuildingRegistry.getInstance().getBuilding(buildingType as any)
    const cost = buildingDef.getCost()

    if (!canAfford(cost)) {
      console.log('Cannot afford building')
      return
    }

    // Consume resources and place building
    Object.entries(cost).forEach(([resource, amount]) => {
      if (typeof amount === 'number' && amount > 0) {
        consumeResource(resource as any, amount)
      }
    })

    console.log(`Placing ${buildingType} at (${gridX}, ${gridY})`)
    if (this.onPlaceBuilding) {
      this.onPlaceBuilding(buildingType, gridX, gridY)
    }
  }

  private handleGazeMovement(position: Position): void {
    if (this.onMoveGaze) {
      this.onMoveGaze(position)
    }
  }

  private rotatePreview(): void {
    this.previewRotation = (this.previewRotation + 1) % 4
    console.log(`Preview rotation: ${this.previewRotation}`)
    if (this.onUpdatePreview) {
      this.onUpdatePreview()
    }
  }

  private toggleDemolishMode(): void {
    const { gameMode, setDemolishMode } = useGameStore.getState()

    setDemolishMode(!gameMode.demolish)
    console.log(`Demolish mode: ${!gameMode.demolish ? 'ON' : 'OFF'}`)
  }

  private selectBuildingType(type: string): void {
    const { setBuildingMode } = useGameStore.getState()

    setBuildingMode(type as any)
    console.log(`Selected building type: ${type}`)
  }

  private clearModes(): void {
    const { resetModes } = useGameStore.getState()

    resetModes()
    console.log('Cleared all modes')
  }

  // Callback setters
  public setOnPlaceBuilding(callback: (type: string, x: number, y: number) => void): void {
    this.onPlaceBuilding = callback
  }

  public setOnMoveGaze(callback: (position: Position) => void): void {
    this.onMoveGaze = callback
  }

  public setOnRemoveBuilding(callback: (position: Position) => void): void {
    this.onRemoveBuilding = callback
  }

  public setOnUpdatePreview(callback: () => void): void {
    this.onUpdatePreview = callback
  }

  public getPreviewRotation(): number {
    return this.previewRotation
  }

  public setPreviewRotation(rotation: number): void {
    this.previewRotation = rotation
  }

  public destroy(): void {
    if (this.scene.input) {
      this.scene.input.removeAllListeners()
    }
  }
}