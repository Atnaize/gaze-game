import { Position } from '../../types'

export abstract class GazeStrategy {
  abstract getPattern(size: number, rotation?: number): Position[]
  
  protected rotatePattern(pattern: Position[], rotation: number): Position[] {
    let rotated = [...pattern]
    
    for (let i = 0; i < rotation % 4; i++) {
      rotated = rotated.map(pos => ({
        x: -pos.y,
        y: pos.x
      }))
    }
    
    return rotated
  }
}

export class LShapeGaze extends GazeStrategy {
  private basePatterns: Record<number, Position[]> = {
    3: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }], // L-shape
    4: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }], // 2x2 square
    5: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 0 }], // 2x2 + 1 block
    6: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 0 }, { x: 2, y: 1 }] // 3x2 rectangle
  }

  getPattern(size: number, rotation = 0): Position[] {
    const basePattern = this.basePatterns[size] || this.basePatterns[3]
    return this.rotatePattern(basePattern, rotation)
  }
}