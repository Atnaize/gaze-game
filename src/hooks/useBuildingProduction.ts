import { useBuildingStore } from '../stores/buildingStore'
import { useGameStore } from '../stores/gameStore'
import { useEventStore } from '../stores/eventStore'
import { Building, Barracks } from '../types'
import { BuildingRegistry } from '../game/buildings'

export const useBuildingProduction = (scene?: Phaser.Scene, GRID_SIZE = 40) => {
  const buildings = useBuildingStore(state => state.getAllBuildings())
  const updateResource = useGameStore(state => state.updateResource)
  const updateBuilding = useBuildingStore(state => state.updateBuilding)
  const emit = useEventStore(state => state.emit)

  const produceFromBuilding = (building: Building) => {
    const buildingDef = BuildingRegistry.getInstance().getBuilding(building.type)
    const productionList = building.isWatched ? buildingDef.getGazeProduction() : buildingDef.getBaseProduction()

    switch (building.type) {
      case 'farm':
      case 'mine':
        // Process all resources for this building type
        const resourceUpdates: any = {}
        productionList.forEach(production => {
          const currentOutput = building.resourceOutputs[production.resourceType] || 0
          const maxOutput = buildingDef.getMaxOutputForResource(production.resourceType)

          // Only produce if not at max for this resource
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
          } as any)
        }
        break
      case 'barracks': {
        const barracks = building as Barracks
        // For barracks, we only expect one resource type (soldiers)
        const soldierProduction = productionList.find(p => p.resourceType === 'soldiers')
        if (soldierProduction && soldierProduction.amount > 0) {
          const currentOutput = building.resourceOutputs[soldierProduction.resourceType] || 0
          const maxOutput = buildingDef.getMaxOutputForResource(soldierProduction.resourceType)

          // Only produce if not at max for soldiers AND barracks has unit capacity
          if (currentOutput < maxOutput && barracks.unitCount < barracks.maxUnits) {
            let soldiersAdded = 0
            const maxSoldiersToAdd = Math.min(soldierProduction.amount, barracks.maxUnits - barracks.unitCount, maxOutput - currentOutput)

            for (let i = 0; i < maxSoldiersToAdd; i++) {
              if ((window as any).addSoldierToBattle) {
                const success = (window as any).addSoldierToBattle(building.id, barracks.maxUnits)
                if (success) {
                  soldiersAdded++
                } else {
                  break
                }
              } else {
                break
              }
            }

            // Only update resources and barracks for soldiers that were actually added
            if (soldiersAdded > 0) {
              updateResource(soldierProduction.resourceType, soldiersAdded)
              emit('resource_produced', { type: soldierProduction.resourceType, amount: soldiersAdded, building })

              // Update barracks unit count and resource output
              updateBuilding(building.id, {
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
  }

  const updateCapacityIndicator = (building: Building) => {
    if (!scene || !building.capacityIndicator) return

    building.capacityIndicator.clear()

    const buildingDef = BuildingRegistry.getInstance().getBuilding(building.type)

    // Check if building has any resource at max output
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

    // Apply greyish overlay when building is completely maxed out
    if (hasMaxedResource && !hasActiveProduction) {
      // Gray tint for completely inactive buildings
      if (building.sprite && 'tint' in building.sprite) {
        building.sprite.tint = 0x888888
      }
    } else {
      // Restore normal tint when still producing
      if (building.sprite && 'tint' in building.sprite) {
        building.sprite.tint = 0xffffff
      }
    }
  }

  const updateCooldownDisplay = (building: Building) => {
    if (!scene || !building.cooldownCircle) return

    building.cooldownCircle.clear()

    if (building.productionCooldown > 0) {
      const buildingDef = BuildingRegistry.getInstance().getBuilding(building.type)
      const maxCooldown = building.isWatched ? buildingDef.getGazeCooldown() : buildingDef.getBaseCooldown()
      const progress = 1 - (building.productionCooldown / maxCooldown)
      const radius = 15
      const centerX = building.x * GRID_SIZE + GRID_SIZE / 2
      const centerY = building.y * GRID_SIZE + GRID_SIZE / 2

      // Background circle
      building.cooldownCircle.lineStyle(2, 0x333333)
      building.cooldownCircle.strokeCircle(centerX, centerY, radius)

      // Progress arc - different colors for watched vs unwatched
      if (progress > 0) {
        const color = building.isWatched ? 0x00ff88 : 0x88aaff
        building.cooldownCircle.lineStyle(3, color)
        building.cooldownCircle.beginPath()
        building.cooldownCircle.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (progress * 2 * Math.PI))
        building.cooldownCircle.strokePath()
      }
    }
  }

  const updateBuildingCooldowns = (deltaTime: number) => {
    buildings.forEach(building => {
      const newCooldown = building.productionCooldown - deltaTime
      if (newCooldown <= 0) {
        produceFromBuilding(building)

        // Set appropriate cooldown based on watch status
        const buildingDef = BuildingRegistry.getInstance().getBuilding(building.type)
        const nextCooldown = building.isWatched ? buildingDef.getGazeCooldown() : buildingDef.getBaseCooldown()
        updateBuilding(building.id, { productionCooldown: nextCooldown })
      } else {
        updateBuilding(building.id, { productionCooldown: newCooldown })
      }

      updateCooldownDisplay(building)
      updateCapacityIndicator(building)
    })
  }

  return {
    updateBuildingCooldowns,
    produceFromBuilding,
    updateCooldownDisplay,
    updateCapacityIndicator
  }
}