import { create } from 'zustand'
import { Building, Position } from '../types'
import { GameConfig } from '../config/GameConfig'

interface BuildingState {
  buildings: Map<string, Building>

  // Actions
  addBuilding: (building: Building) => void
  removeBuilding: (position: Position) => boolean
  getBuilding: (position: Position) => Building | undefined
  getBuildingAt: (x: number, y: number) => Building | undefined
  updateBuilding: (id: string, updates: Partial<Building>) => void
  activateBuilding: (position: Position) => void
  deactivateBuilding: (position: Position) => void
  updateBuildingStates: (activePositions: Position[]) => void
  getAllBuildings: () => Building[]
  clearBuildings: () => void
}

const positionKey = (x: number, y: number): string => `${x},${y}`

export const useBuildingStore = create<BuildingState>((set, get) => ({
  buildings: new Map(),

  addBuilding: (building) => set((state) => {
    const newBuildings = new Map(state.buildings)
    newBuildings.set(positionKey(building.x, building.y), building)
    return { buildings: newBuildings }
  }),

  removeBuilding: (position) => {
    const { buildings } = get()
    const key = positionKey(position.x, position.y)
    if (buildings.has(key)) {
      const building = buildings.get(key)!
      // Cleanup Phaser objects
      building.sprite?.destroy()
      building.text?.destroy()
      building.cooldownCircle?.destroy()
      building.capacityIndicator?.destroy()
      building.remainingProductionText?.destroy()
      building.soldierCountText?.destroy()

      set((state) => {
        const newBuildings = new Map(state.buildings)
        newBuildings.delete(key)
        return { buildings: newBuildings }
      })
      return true
    }
    return false
  },

  getBuilding: (position) => {
    const { buildings } = get()
    return buildings.get(positionKey(position.x, position.y))
  },

  getBuildingAt: (x, y) => {
    const { buildings } = get()
    return buildings.get(positionKey(x, y))
  },

  updateBuilding: (id, updates) => set((state) => {
    const newBuildings = new Map(state.buildings)
    for (const [key, building] of newBuildings) {
      if (building.id === id) {
        newBuildings.set(key, { ...building, ...updates })
        break
      }
    }
    return { buildings: newBuildings }
  }),

  activateBuilding: (position) => {
    const { buildings } = get()
    const building = buildings.get(positionKey(position.x, position.y))
    if (building && !building.isWatched) {
      set((state) => {
        const newBuildings = new Map(state.buildings)
        const updatedBuilding = { ...building, isWatched: true }
        newBuildings.set(positionKey(position.x, position.y), updatedBuilding)

        // Update visual - tint green when active
        if (updatedBuilding.sprite) {
          (updatedBuilding.sprite as any).tint = 0x88ff88
        }

        return { buildings: newBuildings }
      })
    }
  },

  deactivateBuilding: (position) => {
    const { buildings } = get()
    const building = buildings.get(positionKey(position.x, position.y))
    if (building && building.isWatched) {
      set((state) => {
        const newBuildings = new Map(state.buildings)
        const updatedBuilding = { ...building, isWatched: false }
        newBuildings.set(positionKey(position.x, position.y), updatedBuilding)

        // Update visual and clear cooldown - gray tint when inactive
        if (updatedBuilding.sprite) {
          (updatedBuilding.sprite as any).tint = 0x666666
        }
        if (updatedBuilding.cooldownCircle) {
          updatedBuilding.cooldownCircle.clear()
        }

        return { buildings: newBuildings }
      })
    }
  },

  updateBuildingStates: (activePositions) => {
    const activeSet = new Set(activePositions.map(pos => positionKey(pos.x, pos.y)))

    set((state) => {
      const newBuildings = new Map(state.buildings)

      for (const [key, building] of newBuildings) {
        const shouldBeActive = activeSet.has(key)
        if (building.isWatched !== shouldBeActive) {
          const updatedBuilding = { ...building, isWatched: shouldBeActive }

          // Update visual
          if (updatedBuilding.sprite) {
            (updatedBuilding.sprite as any).tint = shouldBeActive ? GameConfig.BUILDING_ACTIVE_TINT : GameConfig.BUILDING_INACTIVE_TINT
          }

          // Clear cooldown if deactivating
          if (!shouldBeActive && updatedBuilding.cooldownCircle) {
            updatedBuilding.cooldownCircle.clear()
          }

          newBuildings.set(key, updatedBuilding)
        }
      }

      return { buildings: newBuildings }
    })
  },

  getAllBuildings: () => {
    const { buildings } = get()
    return Array.from(buildings.values())
  },

  clearBuildings: () => {
    const { buildings } = get()

    // Cleanup all Phaser objects
    buildings.forEach(building => {
      building.sprite?.destroy()
      building.text?.destroy()
      building.cooldownCircle?.destroy()
      building.capacityIndicator?.destroy()
      building.remainingProductionText?.destroy()
      building.soldierCountText?.destroy()
    })

    set(() => ({ buildings: new Map() }))
  }
}))