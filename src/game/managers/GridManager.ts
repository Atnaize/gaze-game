import { GameConfig } from '../../config/GameConfig'

export class GridManager {
  private scene: Phaser.Scene
  private gridGraphics!: Phaser.GameObjects.Graphics
  private readonly GRID_SIZE: number
  private gridWidth: number
  private gridHeight: number

  constructor(scene: Phaser.Scene, gridSize: number, gridWidth: number, gridHeight: number) {
    this.scene = scene
    this.GRID_SIZE = gridSize
    this.gridWidth = gridWidth
    this.gridHeight = gridHeight
  }

  public createGrid(): boolean {
    if (!this.scene.add || !this.scene.add.graphics || !this.scene.scene || !this.scene.scene.isActive()) {
      console.warn('Scene not ready for grid creation')
      return false
    }

    try {
      this.gridGraphics = this.scene.add.graphics()
      this.gridGraphics.setDepth(0)
      this.drawGrid()
      console.log('Grid created successfully')
      return true
    } catch (error) {
      console.error('Failed to create grid:', error)
      return false
    }
  }

  private drawGrid(): void {
    if (!this.gridGraphics) return

    this.gridGraphics.clear()
    this.gridGraphics.lineStyle(1, 0x555555, 0.3)

    const canvasWidth = this.gridWidth * this.GRID_SIZE
    const canvasHeight = this.gridHeight * this.GRID_SIZE

    // Draw vertical lines
    for (let x = 0; x <= this.gridWidth; x++) {
      const xPos = x * this.GRID_SIZE
      this.gridGraphics.moveTo(xPos, 0)
      this.gridGraphics.lineTo(xPos, canvasHeight)
    }

    // Draw horizontal lines
    for (let y = 0; y <= this.gridHeight; y++) {
      const yPos = y * this.GRID_SIZE
      this.gridGraphics.moveTo(0, yPos)
      this.gridGraphics.lineTo(canvasWidth, yPos)
    }

    this.gridGraphics.strokePath()
  }

  public updateGridSize(newWidth: number, newHeight: number): void {
    this.gridWidth = newWidth
    this.gridHeight = newHeight
    this.drawGrid()

    // Update world bounds
    const canvasWidth = newWidth * this.GRID_SIZE
    const canvasHeight = newHeight * this.GRID_SIZE

    this.scene.physics.world.setBounds(0, 0, canvasWidth, canvasHeight)

    if (this.scene.cameras && this.scene.cameras.main) {
      this.scene.cameras.main.setBounds(0, 0, canvasWidth, canvasHeight)
    }
  }

  public isValidGridPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight
  }

  public destroy(): void {
    if (this.gridGraphics) {
      this.gridGraphics.destroy()
    }
  }
}