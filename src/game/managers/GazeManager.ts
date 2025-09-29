import { Position } from '../../types'
import { GameConfig } from '../../config/GameConfig'
import { LShapeGaze } from '../strategies/GazeStrategy'
import { findBestGazePlacement } from '../utils/gazeUtils'

export class GazeManager {
  private scene: Phaser.Scene
  private gazeGraphics!: Phaser.GameObjects.Graphics
  private gazeHighlights: Phaser.GameObjects.Rectangle[] = []
  private gazeStrategy: LShapeGaze
  private readonly GRID_SIZE: number

  constructor(scene: Phaser.Scene, gridSize: number) {
    this.scene = scene
    this.GRID_SIZE = gridSize
    this.gazeStrategy = new LShapeGaze()
  }

  public createGazeSystem(): void {
    this.gazeGraphics = this.scene.add.graphics()
    this.gazeGraphics.setDepth(5)
  }

  public updateGazeDisplay(gazeCenter: Position, gazeSize: number, gazeRotation: number): void {
    if (!this.gazeGraphics || !this.scene.add) return

    try {
      // Clear previous highlights
      this.gazeHighlights.forEach(highlight => highlight.destroy())
      this.gazeHighlights = []

      // Get gaze pattern positions
      const basePattern = this.gazeStrategy.getPattern(gazeSize, gazeRotation)
      const pattern = basePattern.map(pos => ({
        x: gazeCenter.x + pos.x,
        y: gazeCenter.y + pos.y
      }))

      // Skip creating filled highlights - only show border

      // Draw border around the gaze area
      this.drawGazeBorder(pattern, gazeCenter)
    } catch (error) {
      console.warn('Scene destroyed while updating gaze display:', error)
    }
  }

  private drawGazeBorder(pattern: Position[], gazeCenter: Position): void {
    if (!this.gazeGraphics) return

    this.gazeGraphics.clear()
    this.gazeGraphics.lineStyle(3, 0xffff00)

    // Draw outer perimeter only
    this.drawOuterPerimeter(pattern)
  }

  private drawOuterPerimeter(tiles: Position[]): void {
    if (tiles.length === 0) return

    const tileSet = new Set(tiles.map(t => `${t.x},${t.y}`))

    // For each tile, check which edges are on the perimeter
    tiles.forEach(tile => {
      const x = tile.x * this.GRID_SIZE
      const y = tile.y * this.GRID_SIZE
      const size = this.GRID_SIZE

      // Check each edge - draw if adjacent tile doesn't exist
      // Top edge
      if (!tileSet.has(`${tile.x},${tile.y - 1}`)) {
        this.gazeGraphics.moveTo(x, y)
        this.gazeGraphics.lineTo(x + size, y)
      }
      // Right edge
      if (!tileSet.has(`${tile.x + 1},${tile.y}`)) {
        this.gazeGraphics.moveTo(x + size, y)
        this.gazeGraphics.lineTo(x + size, y + size)
      }
      // Bottom edge
      if (!tileSet.has(`${tile.x},${tile.y + 1}`)) {
        this.gazeGraphics.moveTo(x + size, y + size)
        this.gazeGraphics.lineTo(x, y + size)
      }
      // Left edge
      if (!tileSet.has(`${tile.x - 1},${tile.y}`)) {
        this.gazeGraphics.moveTo(x, y + size)
        this.gazeGraphics.lineTo(x, y)
      }
    })

    this.gazeGraphics.strokePath()
  }

  private findBorderSegments(tiles: Position[]): Array<{x: number, y: number, width: number, height: number}> {
    if (tiles.length === 0) return []

    const tileSet = new Set(tiles.map(t => `${t.x},${t.y}`))
    const segments: Array<{x: number, y: number, width: number, height: number}> = []
    const processed = new Set<string>()

    tiles.forEach(tile => {
      const key = `${tile.x},${tile.y}`
      if (processed.has(key)) return

      // Find the largest rectangle starting from this tile
      let width = 1
      let height = 1

      // Expand width
      while (tileSet.has(`${tile.x + width},${tile.y}`)) {
        width++
      }

      // Expand height
      let canExpandHeight = true
      while (canExpandHeight) {
        for (let x = tile.x; x < tile.x + width; x++) {
          if (!tileSet.has(`${x},${tile.y + height}`)) {
            canExpandHeight = false
            break
          }
        }
        if (canExpandHeight) height++
      }

      // Mark processed tiles
      for (let x = tile.x; x < tile.x + width; x++) {
        for (let y = tile.y; y < tile.y + height; y++) {
          processed.add(`${x},${y}`)
        }
      }

      segments.push({ x: tile.x, y: tile.y, width, height })
    })

    return segments
  }

  public getGazePositions(gazeCenter: Position, gazeSize: number, gazeRotation: number): Position[] {
    const basePattern = this.gazeStrategy.getPattern(gazeSize, gazeRotation)
    return basePattern.map(pos => ({
      x: gazeCenter.x + pos.x,
      y: gazeCenter.y + pos.y
    }))
  }

  public moveGazeWithRotation(clickedPosition: Position, gazeSize: number, currentRotation: number): { position: Position, rotation: number } {
    return findBestGazePlacement(clickedPosition, gazeSize, currentRotation)
  }

  public destroy(): void {
    this.gazeHighlights.forEach(highlight => highlight.destroy())
    this.gazeHighlights = []

    if (this.gazeGraphics) {
      this.gazeGraphics.destroy()
    }
  }
}