import { Position, PreviewData, BuildingType } from '../../types'
import { useGameStore } from '../../stores/gameStore'
import { useBuildingStore } from '../../stores/buildingStore'
import { BuildingFactory } from '../factories/BuildingFactory'
import { LShapeGaze } from './GazeStrategy'
import { findBestGazePlacement } from '../utils/gazeUtils'

export abstract class PreviewStrategy {
  constructor(protected isValidPosition: (x: number, y: number) => boolean) {}
  
  abstract generatePreview(gridX: number, gridY: number): PreviewData[]
}

export class GazePreviewStrategy extends PreviewStrategy {
  private gazeStrategy = new LShapeGaze()
  private previewRotation: number = 0

  setPreviewRotation(rotation: number): void {
    this.previewRotation = rotation
  }

  generatePreview(gridX: number, gridY: number): PreviewData[] {
    if (!this.isValidPosition(gridX, gridY)) return []

    const { gazeSize } = useGameStore.getState()

    // Use smart placement to find the best position and rotation for this hover position
    const bestPlacement = findBestGazePlacement(
      { x: gridX, y: gridY },
      gazeSize,
      this.previewRotation
    )

    // Generate pattern using the best placement
    const pattern = this.gazeStrategy.getPattern(gazeSize, bestPlacement.rotation)

    return pattern
      .map(offset => ({
        x: bestPlacement.position.x + offset.x,
        y: bestPlacement.position.y + offset.y
      }))
      .filter(pos => this.isValidPosition(pos.x, pos.y))
      .map(pos => ({
        x: pos.x,
        y: pos.y,
        color: 0xffffff,
        alpha: 0.2,
        strokeColor: 0xffffff,
        strokeAlpha: 0.6,
        strokeWidth: 1
      }))
  }
}

export class DemolishPreviewStrategy extends PreviewStrategy {
  generatePreview(gridX: number, gridY: number): PreviewData[] {
    if (!this.isValidPosition(gridX, gridY)) return []
    
    const building = useBuildingStore.getState().getBuildingAt(gridX, gridY)
    if (!building) return []
    
    return [{
      x: gridX,
      y: gridY,
      color: 0xff0000,
      alpha: 0.4,
      strokeColor: 0xff6666,
      strokeAlpha: 0.8,
      strokeWidth: 3
    }]
  }
}

export class BuildingPreviewStrategy extends PreviewStrategy {
  constructor(
    isValidPosition: (x: number, y: number) => boolean,
    private buildingType: BuildingType
  ) {
    super(isValidPosition)
  }
  
  generatePreview(gridX: number, gridY: number): PreviewData[] {
    if (!this.isValidPosition(gridX, gridY)) return []
    
    const building = useBuildingStore.getState().getBuildingAt(gridX, gridY)
    if (building) return []
    
    const cost = BuildingFactory.getBuildingCost(this.buildingType)
    const canAfford = useGameStore.getState().canAfford(cost)
    
    const colors: Record<BuildingType, number> = { 
      farm: 0x90EE90, 
      mine: 0x8B4513, 
      barracks: 0xFF6347 
    }
    
    return [{
      x: gridX,
      y: gridY,
      color: colors[this.buildingType] || 0x888888,
      alpha: canAfford ? 0.6 : 0.3,
      strokeColor: canAfford ? 0x00ff00 : 0xff0000,
      strokeAlpha: 0.8,
      strokeWidth: 2,
      showAffordability: true,
      canAfford
    }]
  }
}