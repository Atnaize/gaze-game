import Phaser from 'phaser'
import { useGameStore } from '../stores/gameStore'
import { useBuildingStore } from '../stores/buildingStore'
import { useEventStore } from '../stores/eventStore'
import { Position } from '../types'
import { GameConfig } from '../config/GameConfig'
import { GameTimeManager } from './managers/GameTimeManager'
import { GridManager } from './managers/GridManager'
import { GazeManager } from './managers/GazeManager'
import { BuildingManager } from './managers/BuildingManager'
import { InputManager } from './managers/InputManager'
import { PreviewManager } from './managers/PreviewManager'
import { BuildingFactory } from './factories/BuildingFactory'

export class KingdomScene extends Phaser.Scene {
  private readonly GRID_SIZE = GameConfig.GRID_SIZE
  private GRID_WIDTH: number = GameConfig.INITIAL_GRID_WIDTH
  private GRID_HEIGHT: number = GameConfig.INITIAL_GRID_HEIGHT

  // Managers
  private gridManager!: GridManager
  private gazeManager!: GazeManager
  private buildingManager!: BuildingManager
  private inputManager!: InputManager
  private previewManager!: PreviewManager
  private timeManager!: GameTimeManager

  // Store subscription
  private storeUnsubscribe?: () => void

  constructor() {
    super({ key: 'KingdomGame' })
  }

  preload() {
    // Load building sprites from public/buildings/
    this.load.image('farm', 'buildings/farm.png')
    this.load.image('mine', 'buildings/mine.png')
    this.load.image('barracks', 'buildings/barracks.png')
  }

  create() {
    console.log('KingdomScene: Starting scene creation')

    // Initialize grid dimensions from store
    const gameState = useGameStore.getState()
    this.GRID_WIDTH = gameState.gridWidth
    this.GRID_HEIGHT = gameState.gridHeight

    this.setupWorldBounds()
    this.setupManagers()
    this.setupReactIntegration()

    console.log('KingdomScene: Scene creation completed')
  }

  private setupWorldBounds(): void {
    const canvasWidth = this.GRID_WIDTH * this.GRID_SIZE
    const canvasHeight = this.GRID_HEIGHT * this.GRID_SIZE

    // Set physics world bounds
    this.physics.world.setBounds(0, 0, canvasWidth, canvasHeight)

    // Set camera bounds
    if (this.cameras && this.cameras.main) {
      this.cameras.main.setBounds(0, 0, canvasWidth, canvasHeight)
      console.log('Scene: Initial camera bounds set')
    }
  }

  private setupManagers(): void {
    // Initialize time manager
    this.timeManager = GameTimeManager.getInstance()

    // Initialize grid manager
    this.gridManager = new GridManager(this, this.GRID_SIZE, this.GRID_WIDTH, this.GRID_HEIGHT)
    this.gridManager.createGrid()

    // Initialize gaze manager
    this.gazeManager = new GazeManager(this, this.GRID_SIZE)
    this.gazeManager.createGazeSystem()

    // Initialize building manager
    this.buildingManager = new BuildingManager(this, this.GRID_SIZE)

    // Initialize preview manager
    this.previewManager = new PreviewManager(
      this,
      this.GRID_SIZE,
      this.gridManager.isValidGridPosition.bind(this.gridManager)
    )

    // Initialize input manager
    this.inputManager = new InputManager(this, this.GRID_SIZE)
    this.setupInputCallbacks()
    this.inputManager.setupInput()

    console.log('All managers initialized successfully')
  }

  private setupInputCallbacks(): void {
    // Set up input manager callbacks
    this.inputManager.setOnPlaceBuilding((type, x, y) => {
      this.handleBuildingPlacement(type, x, y)
    })

    this.inputManager.setOnMoveGaze((position) => {
      this.handleGazeMovement(position)
    })

    this.inputManager.setOnRemoveBuilding((position) => {
      this.handleBuildingRemoval(position)
    })

    this.inputManager.setOnUpdatePreview(() => {
      this.handlePreviewUpdate()
    })
  }

  private setupReactIntegration(): void {
    this.setupStoreSubscriptions()
    this.setupReactHooks()

    // Initial state sync
    this.syncWithStores()
  }

  private setupStoreSubscriptions(): void {
    // Subscribe to store changes
    this.storeUnsubscribe = useGameStore.subscribe((state, prevState) => {
      // Handle grid size changes
      if (state.gridWidth !== prevState.gridWidth || state.gridHeight !== prevState.gridHeight) {
        this.handleGridSizeChange(state.gridWidth, state.gridHeight)
      }

      // Handle gaze changes
      if (
        state.gazeCenter !== prevState.gazeCenter ||
        state.gazeSize !== prevState.gazeSize ||
        state.gazeRotation !== prevState.gazeRotation
      ) {
        this.updateGazeDisplay()
        this.updateBuildingStates()
      }

      // Handle game mode changes for preview
      if (state.gameMode !== prevState.gameMode) {
        this.updatePreviewMode(state.gameMode)
      }
    })
  }

  private setupReactHooks(): void {
    const emit = useEventStore.getState().emit
    emit('scene_ready' as any, { scene: this })
  }

  private handleGridSizeChange(newWidth: number, newHeight: number): void {
    console.log(`Grid size changing from ${this.GRID_WIDTH}x${this.GRID_HEIGHT} to ${newWidth}x${newHeight}`)

    this.GRID_WIDTH = newWidth
    this.GRID_HEIGHT = newHeight

    this.gridManager.updateGridSize(newWidth, newHeight)

    console.log('Grid size updated successfully')
  }

  private handleBuildingPlacement(type: string, x: number, y: number): void {
    // Create building object first
    const building = BuildingFactory.createBuilding(type as any, x, y)
    if (building) {
      // Add building to store
      const { addBuilding } = useBuildingStore.getState()
      addBuilding(building)

      // Create visuals for the building object in store
      const { getBuilding } = useBuildingStore.getState()
      const storedBuilding = getBuilding({ x, y })
      if (storedBuilding) {
        this.buildingManager.createBuildingVisuals(storedBuilding)
      }

      // Update building states
      this.updateBuildingStates()

      // Emit event
      const { emit } = useEventStore.getState()
      emit('building_placed', { building })
    }
  }

  private handleGazeMovement(position: Position): void {
    const { gazeSize, gazeRotation } = useGameStore.getState()

    // Use preview rotation if available, otherwise use store rotation
    const currentRotation = this.inputManager.getPreviewRotation()
    const result = this.gazeManager.moveGazeWithRotation(position, gazeSize, currentRotation)

    // Update store with both position and rotation
    useGameStore.setState({
      gazeCenter: result.position,
      gazeRotation: result.rotation
    })

    // Sync input manager with final rotation
    this.inputManager.setPreviewRotation(result.rotation)

    // Emit event
    const { emit } = useEventStore.getState()
    emit('gaze_moved', { position: result.position })
  }

  private handleBuildingRemoval(position: Position): void {
    const { removeBuilding } = useBuildingStore.getState()
    const success = removeBuilding(position)

    if (success) {
      this.updateBuildingStates()

      // Emit event
      const { emit } = useEventStore.getState()
      emit('building_removed', { position })
    }
  }

  private handlePreviewUpdate(): void {
    // Get current mouse position for preview
    const pointer = this.input.activePointer
    if (pointer) {
      const gridX = Math.floor(pointer.x / this.GRID_SIZE)
      const gridY = Math.floor(pointer.y / this.GRID_SIZE)

      // Update preview mode with current rotation if in gaze mode
      const { gameMode } = useGameStore.getState()
      if (!gameMode.building && !gameMode.demolish) {
        const currentRotation = this.inputManager.getPreviewRotation()
        this.previewManager.setGazePreview(currentRotation)
      }

      this.previewManager.updatePreview(gridX, gridY)
    }
  }

  private syncWithStores(): void {
    // Sync initial gaze display
    this.updateGazeDisplay()

    // Sync initial building states
    this.updateBuildingStates()

    // Sync initial preview mode
    const { gameMode } = useGameStore.getState()
    this.updatePreviewMode(gameMode)
  }

  private updateGazeDisplay(): void {
    const { gazeCenter, gazeSize, gazeRotation } = useGameStore.getState()
    this.gazeManager.updateGazeDisplay(gazeCenter, gazeSize, gazeRotation)
  }

  private updateBuildingStates(): void {
    const { gazeCenter, gazeSize, gazeRotation } = useGameStore.getState()
    const gazePositions = this.gazeManager.getGazePositions(gazeCenter, gazeSize, gazeRotation)

    // Update building store with active positions
    const { updateBuildingStates } = useBuildingStore.getState()
    updateBuildingStates(gazePositions)
  }

  private updatePreviewMode(gameMode: any): void {
    if (gameMode.demolish) {
      this.previewManager.setDemolishPreview()
    } else if (gameMode.building) {
      this.previewManager.setBuildingPreview(gameMode.building)
    } else {
      this.previewManager.setGazePreview()
    }
  }

  update(time: number, delta: number): void {
    if (!this.scene.isActive()) return

    // Update time manager
    this.timeManager.update(delta)

    // Get adjusted delta time (handles pause/speed)
    const adjustedDelta = this.timeManager.getDeltaTime(delta)

    // Only update game logic if not paused
    if (adjustedDelta > 0) {
      this.buildingManager.updateBuildingProduction(adjustedDelta)
    }
  }

  destroy(): void {
    console.log('KingdomScene: Destroying scene')

    // Unsubscribe from stores
    if (this.storeUnsubscribe) {
      this.storeUnsubscribe()
    }

    // Destroy managers
    this.gridManager?.destroy()
    this.gazeManager?.destroy()
    this.buildingManager?.destroy()
    this.inputManager?.destroy()
    this.previewManager?.destroy()

    console.log('KingdomScene: Scene destroyed')

    // Phaser scenes don't have a destroy method, they are destroyed by the SceneManager
  }
}