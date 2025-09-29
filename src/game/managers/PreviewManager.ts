import { PreviewStrategy, GazePreviewStrategy, DemolishPreviewStrategy, BuildingPreviewStrategy } from '../strategies/PreviewStrategy'
import { BuildingType } from '../../types'

export class PreviewManager {
  private currentStrategy: PreviewStrategy | null = null
  private previewObjects: Phaser.GameObjects.GameObject[] = []
  private scene: Phaser.Scene
  private GRID_SIZE: number

  constructor(scene: Phaser.Scene, gridSize: number, private isValidPosition: (x: number, y: number) => boolean) {
    this.scene = scene
    this.GRID_SIZE = gridSize
  }

  setStrategy(strategy: PreviewStrategy): void {
    this.currentStrategy = strategy
  }

  setGazePreview(previewRotation?: number): void {
    const strategy = new GazePreviewStrategy(this.isValidPosition)
    if (previewRotation !== undefined) {
      strategy.setPreviewRotation(previewRotation)
    }
    this.setStrategy(strategy)
  }

  setDemolishPreview(): void {
    this.setStrategy(new DemolishPreviewStrategy(this.isValidPosition))
  }

  setBuildingPreview(buildingType: BuildingType): void {
    this.setStrategy(new BuildingPreviewStrategy(this.isValidPosition, buildingType))
  }

  updatePreview(gridX: number, gridY: number): void {
    this.clearPreview()

    if (!this.currentStrategy || gridX < 0 || gridY < 0) return

    const previewData = this.currentStrategy.generatePreview(gridX, gridY)

    previewData.forEach(data => {
      const preview = this.scene.add.rectangle(
        data.x * this.GRID_SIZE + this.GRID_SIZE / 2,
        data.y * this.GRID_SIZE + this.GRID_SIZE / 2,
        this.GRID_SIZE - 2,
        this.GRID_SIZE - 2,
        data.color,
        data.alpha
      )

      preview.setStrokeStyle(data.strokeWidth, data.strokeColor, data.strokeAlpha)

      // Add affordability indicator for buildings
      if (data.showAffordability && !data.canAfford) {
        const cross = this.scene.add.graphics()
        cross.lineStyle(3, 0xff0000, 0.8)
        const centerX = data.x * this.GRID_SIZE + this.GRID_SIZE / 2
        const centerY = data.y * this.GRID_SIZE + this.GRID_SIZE / 2
        const size = this.GRID_SIZE / 3
        cross.moveTo(centerX - size, centerY - size)
        cross.lineTo(centerX + size, centerY + size)
        cross.moveTo(centerX + size, centerY - size)
        cross.lineTo(centerX - size, centerY + size)
        cross.strokePath()
        this.previewObjects.push(cross)
      }

      this.previewObjects.push(preview)
    })
  }

  clearPreview(): void {
    this.previewObjects.forEach(obj => obj.destroy())
    this.previewObjects = []
  }

  destroy(): void {
    this.clearPreview()
    this.currentStrategy = null
  }
}