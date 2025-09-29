import { create } from 'zustand'
import { Resources, Position, BuildingType, GameMode } from '../types'
import { isGazePatternValid, findBestGazePlacement } from '../game/utils/gazeUtils'
import { GameConfig } from '../config/GameConfig'
import { GazeSystem } from '../game/systems/GazeSystem'
import { GameTimeManager } from '../game/managers/GameTimeManager'

interface GameState {
  resources: Resources
  gazeCenter: Position
  gazeSize: number
  gazeRotation: number
  gameMode: GameMode
  isPaused: boolean
  gameSpeed: number
  gridWidth: number
  gridHeight: number

  // Actions
  updateResource: (type: keyof Resources, amount: number) => void
  consumeResource: (type: keyof Resources, amount: number) => boolean
  canAfford: (cost: Partial<Resources>) => boolean
  moveGaze: (position: Position) => void
  rotateGaze: () => void
  upgradeGaze: () => boolean
  setDemolishMode: (active: boolean) => void
  setBuildingMode: (type: BuildingType | null) => void
  resetModes: () => void
  pauseGame: () => void
  resumeGame: () => void
  setGameSpeed: (speed: number) => void
  resetGame: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  resources: GameConfig.INITIAL_RESOURCES,

  gazeCenter: GameConfig.INITIAL_GAZE_CENTER,
  gazeSize: GameConfig.INITIAL_GAZE_SIZE,
  gazeRotation: GameConfig.INITIAL_GAZE_ROTATION,

  gridWidth: GameConfig.INITIAL_GRID_WIDTH,
  gridHeight: GameConfig.INITIAL_GRID_HEIGHT,

  gameMode: {
    demolish: false,
    building: null
  },

  isPaused: false,
  gameSpeed: GameConfig.DEFAULT_GAME_SPEED,

  updateResource: (type, amount) => set((state) => ({
    resources: {
      ...state.resources,
      [type]: Math.max(0, state.resources[type] + amount)
    }
  })),

  consumeResource: (type, amount) => {
    const state = get()
    if (state.resources[type] >= amount) {
      set((prevState) => ({
        resources: {
          ...prevState.resources,
          [type]: prevState.resources[type] - amount
        }
      }))
      return true
    }
    return false
  },

  canAfford: (cost) => {
    const { resources } = get()
    return Object.entries(cost).every(([type, amount]) => 
      resources[type as keyof Resources] >= (amount || 0)
    )
  },

  moveGaze: (position) => {
    // moveGaze called

    // Find the best placement (position + rotation) for the clicked position
    const state = get()
    const bestPlacement = findBestGazePlacement(position, state.gazeSize, state.gazeRotation)

    // Best placement found
    set(() => ({
      gazeCenter: bestPlacement.position,
      gazeRotation: bestPlacement.rotation
    }))
    // Gaze updated
  },

  rotateGaze: () => set((state) => {
    const newRotation = (state.gazeRotation + 1) % 4

    // Check if the new rotation fits at current position
    if (isGazePatternValid(state.gazeCenter, state.gazeSize, newRotation)) {
      return {
        gazeRotation: newRotation,
        gazeCenter: state.gazeCenter
      }
    }

    // Find best placement for the new rotation
    const bestPlacement = findBestGazePlacement(state.gazeCenter, state.gazeSize, newRotation)

    return {
      gazeRotation: bestPlacement.rotation,
      gazeCenter: bestPlacement.position
    }
  }),

  upgradeGaze: () => {
    const state = get()
    const upgradeCost = GazeSystem.getUpgradeCost(state.gazeSize)
    if (GazeSystem.canUpgrade(state.gazeSize, state.resources.gold)) {
      state.consumeResource('gold', upgradeCost)
      const newSize = state.gazeSize + 1

      // Check if current position/rotation works with new size
      if (isGazePatternValid(state.gazeCenter, newSize, state.gazeRotation)) {
        set((prevState) => ({
          gazeSize: newSize,
          gazeCenter: state.gazeCenter
        }))
      } else {
        // Find best placement for the new size
        const bestPlacement = findBestGazePlacement(state.gazeCenter, newSize, state.gazeRotation)

        set((prevState) => ({
          gazeSize: newSize,
          gazeCenter: bestPlacement.position,
          gazeRotation: bestPlacement.rotation
        }))
      }
      return true
    }
    return false
  },


  setDemolishMode: (active) => set((state) => ({
    gameMode: {
      ...state.gameMode,
      demolish: active,
      building: active ? null : state.gameMode.building
    }
  })),

  setBuildingMode: (type) => set((state) => ({
    gameMode: {
      demolish: false,
      building: type
    }
  })),

  resetModes: () => set((state) => ({
    gameMode: {
      demolish: false,
      building: null
    }
  })),

  pauseGame: () => {
    const timeManager = GameTimeManager.getInstance()
    timeManager.setPaused(true)
    set(() => ({
      isPaused: true
    }))
  },

  resumeGame: () => {
    const timeManager = GameTimeManager.getInstance()
    timeManager.setPaused(false)
    set(() => ({
      isPaused: false
    }))
  },

  setGameSpeed: (speed) => {
    const timeManager = GameTimeManager.getInstance()
    timeManager.setGameSpeed(speed)
    set(() => ({
      gameSpeed: speed
    }))
  },

  resetGame: () => {
    const timeManager = GameTimeManager.getInstance()
    timeManager.setPaused(false)
    timeManager.setGameSpeed(GameConfig.DEFAULT_GAME_SPEED)

    set(() => ({
      resources: GameConfig.INITIAL_RESOURCES,
      gazeCenter: GameConfig.INITIAL_GAZE_CENTER,
      gazeSize: GameConfig.INITIAL_GAZE_SIZE,
      gazeRotation: GameConfig.INITIAL_GAZE_ROTATION,
      gameMode: {
        demolish: false,
        building: null
      },
      isPaused: false,
      gameSpeed: GameConfig.DEFAULT_GAME_SPEED,
      gridWidth: GameConfig.INITIAL_GRID_WIDTH,
      gridHeight: GameConfig.INITIAL_GRID_HEIGHT
    }))
  }
}))