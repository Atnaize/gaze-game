import { GameStateSnapshot, Resources, Building, BattleStats, BuildingType } from '../../types'

export class AchievementHelper {
  static createGameStateSnapshot(data: {
    resources: Resources
    buildings: Building[]
    battleStats: BattleStats
    totalWaves: number
    gameOver: boolean
    gazeUpgrades: number
    totalPlayTime: number
    highestWave: number
    totalGoldEarned: number
  }): GameStateSnapshot {
    const buildingCounts: Record<BuildingType, number> = {
      farm: 0,
      mine: 0,
      barracks: 0
    }

    for (const building of data.buildings) {
      buildingCounts[building.type]++
    }

    const totalResourcesProduced: Record<keyof Resources, number> = {
      gold: 0,
      food: 0,
      stone: 0,
      soldiers: 0
    }

    for (const building of data.buildings) {
      for (const [resource, amount] of Object.entries(building.resourceOutputs)) {
        totalResourcesProduced[resource as keyof Resources] += amount
      }
    }

    return {
      resources: data.resources,
      buildings: data.buildings,
      battleStats: data.battleStats,
      totalWaves: data.totalWaves,
      gameOver: data.gameOver,
      gazeUpgrades: data.gazeUpgrades,
      totalPlayTime: data.totalPlayTime,
      buildingCounts,
      highestWave: data.highestWave,
      fastestWaveCompletion: 0,
      totalGoldEarned: data.totalGoldEarned,
      totalResourcesProduced
    }
  }
}