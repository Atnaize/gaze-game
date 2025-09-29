import { GameConfig } from '../../config/GameConfig'

export class GazeSystem {
  private static readonly UPGRADE_COSTS = [50, 100, 200, 400]

  static getUpgradeCost(currentSize: number): number {
    const upgradeIndex = currentSize - GameConfig.INITIAL_GAZE_SIZE
    return this.UPGRADE_COSTS[upgradeIndex] || this.UPGRADE_COSTS[this.UPGRADE_COSTS.length - 1]
  }

  static getMaxSize(): number {
    return GameConfig.MAX_GAZE_SIZE
  }

  static canUpgrade(currentSize: number, gold: number): boolean {
    return currentSize < this.getMaxSize() && gold >= this.getUpgradeCost(currentSize)
  }

  static getUpgradeLabel(currentSize: number): string {
    return `Upgrade Gaze (${this.getUpgradeCost(currentSize)} Gold)`
  }
}