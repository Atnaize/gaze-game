import { Building, Position, BuildingType, Barracks } from '../../types'
import { BuildingFactory } from '../factories/BuildingFactory'
import { BuildingRegistry } from '../buildings/BuildingRegistry'
import { GameConfig } from '../../config/GameConfig'
import { useBuildingStore } from '../../stores/buildingStore'
import { useGameStore } from '../../stores/gameStore'
import { useEventStore } from '../../stores/eventStore'

export class BuildingManager {
  private scene: Phaser.Scene
  private readonly GRID_SIZE: number

  constructor(scene: Phaser.Scene, gridSize: number) {
    this.scene = scene
    this.GRID_SIZE = gridSize
  }

  public placeBuilding(type: BuildingType, x: number, y: number): boolean {
    try {
      const building = BuildingFactory.createBuilding(type, x, y)
      if (!building) {
        console.error(`Failed to create building of type: ${type}`)
        return false
      }

      this.createBuildingVisuals(building)
      console.log(`Placed ${type} building at (${x}, ${y})`)
      return true
    } catch (error) {
      console.error('Error placing building:', error)
      return false
    }
  }

  public createBuildingVisuals(building: Building): void {
    if (!this.scene.add) return

    const x = building.x * this.GRID_SIZE
    const y = building.y * this.GRID_SIZE

    // Create building sprite using image
    const spriteKey = building.type
    if (this.scene.textures.exists(spriteKey)) {
      building.sprite = this.scene.add.image(
        x + this.GRID_SIZE / 2,
        y + this.GRID_SIZE / 3, // Move up to show more of bottom tile area
        spriteKey
      )

      // Scale to fit grid
      const scale = (this.GRID_SIZE - 4) / Math.max(building.sprite.width, building.sprite.height)
      building.sprite.setScale(scale)
      building.sprite.setDepth(2)
    } else {
      console.warn(`No sprite found for building type: ${building.type}`)
    }

    // Create visual indicators
    this.createBuildingIndicators(building)
  }

  private createBuildingIndicators(building: Building): void {
    if (!this.scene.add) {
      return
    }

    // Create cooldown circle
    building.cooldownCircle = this.scene.add.graphics()
    building.cooldownCircle.setDepth(10)

    // Create capacity indicator
    building.capacityIndicator = this.scene.add.graphics()
    building.capacityIndicator.setDepth(8)

    // Create remaining production text
    const textX = building.x * this.GRID_SIZE + this.GRID_SIZE / 2
    const textY = building.y * this.GRID_SIZE + this.GRID_SIZE - 5

    building.remainingProductionText = this.scene.add.text(textX, textY, '', {
      fontSize: '10px',
      color: '#ffffff',
      fontFamily: 'Arial'
    })
    building.remainingProductionText.setOrigin(0.5, 1)
    building.remainingProductionText.setDepth(12)
  }

  public updateBuildingProduction(deltaTime: number): void {
    const buildings = useBuildingStore.getState().getAllBuildings()

    buildings.forEach((building: Building) => {
      const newCooldown = building.productionCooldown - deltaTime
      if (newCooldown <= 0) {
        this.produceFromBuilding(building)

        // Reset cooldown
        const buildingDef = BuildingRegistry.getInstance().getBuilding(building.type)
        const nextCooldown = building.isWatched ? buildingDef.getGazeCooldown() : buildingDef.getBaseCooldown()
        const { updateBuilding } = useBuildingStore.getState()
        updateBuilding(building.id, { productionCooldown: nextCooldown })
      } else {
        const { updateBuilding } = useBuildingStore.getState()
        updateBuilding(building.id, { productionCooldown: newCooldown })
      }

      this.updateBuildingVisuals(building)
    })
  }

  private produceFromBuilding(building: Building): void {
    const { updateResource } = useGameStore.getState()
    const { emit } = useEventStore.getState()
    const { updateBuilding } = useBuildingStore.getState()

    const buildingDef = BuildingRegistry.getInstance().getBuilding(building.type)
    const productionList = building.isWatched ? buildingDef.getGazeProduction() : buildingDef.getBaseProduction()

    switch (building.type) {
      case 'farm':
      case 'mine':
        const resourceUpdates: any = {}
        productionList.forEach(production => {
          const currentOutput = building.resourceOutputs[production.resourceType] || 0
          const maxOutput = buildingDef.getMaxOutputForResource(production.resourceType)

          if (currentOutput < maxOutput) {
            const amountToProduce = Math.min(production.amount, maxOutput - currentOutput)
            if (amountToProduce > 0) {
              updateResource(production.resourceType, amountToProduce)
              emit('resource_produced', { type: production.resourceType, amount: amountToProduce, building })
              resourceUpdates[production.resourceType] = currentOutput + amountToProduce
            }
          }
        })

        if (Object.keys(resourceUpdates).length > 0) {
          updateBuilding(building.id, {
            resourceOutputs: { ...building.resourceOutputs, ...resourceUpdates }
          })
        }
        break

      case 'barracks':
        const barracks = building as Barracks
        const soldierProduction = productionList.find(p => p.resourceType === 'soldiers')
        if (soldierProduction && soldierProduction.amount > 0) {
          const currentOutput = building.resourceOutputs[soldierProduction.resourceType] || 0
          const maxOutput = buildingDef.getMaxOutputForResource(soldierProduction.resourceType)

          if (currentOutput < maxOutput && barracks.unitCount < barracks.maxUnits) {
            let soldiersAdded = 0
            const maxSoldiersToAdd = Math.min(soldierProduction.amount, barracks.maxUnits - barracks.unitCount, maxOutput - currentOutput)

            for (let i = 0; i < maxSoldiersToAdd; i++) {
              if ((window as any).addSoldierToBattle) {
                const success = (window as any).addSoldierToBattle(building.id, barracks.maxUnits)
                if (success) {
                  soldiersAdded++
                } else {
                  console.log(`Failed to add soldier ${i+1} to barracks ${building.id}`)
                  break
                }
              } else {
                console.log('addSoldierToBattle not available')
                break
              }
            }

            if (soldiersAdded > 0) {
              updateResource(soldierProduction.resourceType, soldiersAdded)
              emit('resource_produced', { type: soldierProduction.resourceType, amount: soldiersAdded, building })

              updateBuilding(building.id, {
                ...(building as any),
                unitCount: barracks.unitCount + soldiersAdded,
                resourceOutputs: {
                  ...building.resourceOutputs,
                  [soldierProduction.resourceType]: currentOutput + soldiersAdded
                }
              } as any)
            }
          }
        }
        break
    }
  }

  public updateBuildingVisuals(building: Building): void {
    this.updateCooldownDisplay(building)
    this.updateCapacityIndicator(building)
    this.updateRemainingProductionText(building)

    if (building.type === 'barracks') {
      this.updateBarracksStatus(building)
    }
  }

  private updateCooldownDisplay(building: Building): void {
    if (!building.cooldownCircle) return

    building.cooldownCircle.clear()

    // Don't show progress for barracks at max capacity
    if (building.type === 'barracks') {
      const barracks = building as Barracks
      const actualUnitCount = this.syncBarracksUnitCount(building)
      if (actualUnitCount >= barracks.maxUnits) {
        return // No progress bar when at max capacity
      }
    }

    // Don't show progress for buildings at max resource output
    const buildingDef = BuildingRegistry.getInstance().getBuilding(building.type)
    const productionResources = buildingDef.getProduction().resources
    let hasMaxedAllResources = true

    for (const resource of productionResources) {
      const currentOutput = building.resourceOutputs[resource.resourceType] || 0
      const maxOutput = resource.maxOutput
      if (currentOutput < maxOutput) {
        hasMaxedAllResources = false
        break
      }
    }

    if (hasMaxedAllResources) {
      return // No progress bar when all resources are at max output
    }

    if (building.productionCooldown > 0) {
      const buildingDef = BuildingRegistry.getInstance().getBuilding(building.type)
      const maxCooldown = building.isWatched ? buildingDef.getGazeCooldown() : buildingDef.getBaseCooldown()
      const progress = 1 - (building.productionCooldown / maxCooldown)

      // Full-width production indicator at very bottom of tile
      const barWidth = this.GRID_SIZE - 2 // Full width minus small margin
      const barHeight = 3
      const barX = building.x * this.GRID_SIZE + 1 // Small left margin
      const barY = building.y * this.GRID_SIZE + this.GRID_SIZE - barHeight - 1 // At very bottom

      // Background bar
      building.cooldownCircle.fillStyle(0x333333, 0.8)
      building.cooldownCircle.fillRect(barX, barY, barWidth, barHeight)

      // Progress bar
      if (progress > 0) {
        const color = building.isWatched ? 0x00ff88 : 0x88aaff
        building.cooldownCircle.fillStyle(color, 0.9)
        building.cooldownCircle.fillRect(barX, barY, barWidth * progress, barHeight)
      }

      // Border
      building.cooldownCircle.lineStyle(1, 0xffffff, 0.5)
      building.cooldownCircle.strokeRect(barX, barY, barWidth, barHeight)
    }
  }

  private updateCapacityIndicator(building: Building): void {
    if (!building.capacityIndicator) return

    building.capacityIndicator.clear()

    const buildingDef = BuildingRegistry.getInstance().getBuilding(building.type)
    let hasMaxedResource = false
    let hasActiveProduction = false
    const productionResources = buildingDef.getProduction().resources

    productionResources.forEach(resource => {
      const currentOutput = building.resourceOutputs[resource.resourceType] || 0
      const maxOutput = resource.maxOutput
      const progress = currentOutput / maxOutput

      if (progress >= 1) {
        hasMaxedResource = true
      } else if (progress > 0) {
        hasActiveProduction = true
      }
    })

    // Apply tint based on production status
    if (hasMaxedResource && !hasActiveProduction) {
      if (building.sprite && 'tint' in building.sprite) {
        building.sprite.tint = 0x888888
      }
    } else {
      if (building.sprite && 'tint' in building.sprite) {
        building.sprite.tint = 0xffffff
      }
    }
  }

  private updateRemainingProductionText(building: Building): void {
    if (!building.remainingProductionText) return

    const buildingDef = BuildingRegistry.getInstance().getBuilding(building.type)
    const productionResources = buildingDef.getProduction().resources

    let displayText = ''
    const remainingAmounts: string[] = []

    productionResources.forEach(resource => {
      const currentOutput = building.resourceOutputs[resource.resourceType] || 0
      const maxOutput = resource.maxOutput
      const remaining = maxOutput - currentOutput

      if (remaining > 0) {
        const symbol = this.getResourceSymbol(resource.resourceType)
        remainingAmounts.push(`${symbol}${remaining}`)
      }
    })

    displayText = remainingAmounts.join(' ')
    building.remainingProductionText.setText(displayText)
    building.remainingProductionText.setVisible(displayText.length > 0)
  }

  private updateBarracksStatus(building: Building): void {
    if (building.type !== 'barracks') return

    const barracks = building as Barracks
    const actualUnitCount = this.syncBarracksUnitCount(building)

    // Clear any existing graphics
    if (building.capacityIndicator) {
      building.capacityIndicator.clear()
    }

    // Create or update soldier counter text at top-right of tile
    if (!building.soldierCountText) {
      const textX = building.x * this.GRID_SIZE + this.GRID_SIZE - 2
      const textY = building.y * this.GRID_SIZE + 2

      building.soldierCountText = this.scene.add.text(textX, textY, '', {
        fontSize: '12px',
        color: '#ffffff',
        fontFamily: 'Arial',
        backgroundColor: '#000000',
        padding: { left: 2, right: 2, top: 1, bottom: 1 }
      })
      building.soldierCountText.setOrigin(1, 0) // Top-right alignment
      building.soldierCountText.setDepth(12)

      // Update the building in the store with the new text object
      const { updateBuilding } = useBuildingStore.getState()
      updateBuilding(building.id, { soldierCountText: building.soldierCountText } as any)
    }

    // Update the counter text
    const counterText = `${actualUnitCount}/${barracks.maxUnits}`
    const textColor = actualUnitCount >= barracks.maxUnits ? '#ff6666' : '#ffffff'
    building.soldierCountText.setText(counterText)
    building.soldierCountText.setColor(textColor)
  }

  private syncBarracksUnitCount(building: Building): number {
    if (building.type !== 'barracks') return 0

    const battleManager = (window as any).getBattleManager?.()
    if (battleManager) {
      const actualCount = battleManager.getSoldiersCountByBarracks(building.id)

      // Update store if count differs
      if (actualCount !== (building as Barracks).unitCount) {
        const { updateBuilding } = useBuildingStore.getState()
        updateBuilding(building.id, { ...(building as any), unitCount: actualCount } as any)
      }

      return actualCount
    }

    return (building as Barracks).unitCount
  }

  private getResourceSymbol(resourceType: string): string {
    switch (resourceType) {
      case 'gold': return '💰'
      case 'food': return '🍗'
      case 'stone': return '🪨'
      case 'soldiers': return '🛡️'
      default: return '?'
    }
  }

  public destroy(): void {
    // Buildings are managed by the store, so no cleanup needed here
  }
}