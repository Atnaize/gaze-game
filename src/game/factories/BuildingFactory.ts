import { Building, BuildingType, BuildingCost, Farm, Mine, Barracks } from '../../types'
import { BuildingRegistry } from '../buildings'

export class BuildingFactory {
  private static generateId(): string {
    return Math.random().toString(36).substring(2, 11)
  }

  static createBuilding(type: BuildingType, x: number, y: number): Building {
    const buildingDef = BuildingRegistry.getInstance().getBuilding(type)
    const baseBuilding = {
      id: this.generateId(),
      x,
      y,
      isWatched: false,
      productionCooldown: buildingDef.getBaseCooldown(), // Start with full cooldown
      resourceOutputs: { gold: 0, food: 0, stone: 0, soldiers: 0 }, // Track output per resource
      type: buildingDef.getType(),
      cost: buildingDef.getCost(),
      maxCooldown: buildingDef.getMaxCooldown()
    }

    switch (type) {
      case 'farm':
        return baseBuilding as Farm

      case 'mine':
        return baseBuilding as Mine

      case 'barracks':
        const barracksBuilding = BuildingRegistry.getInstance().getBuilding('barracks') as any
        return {
          ...baseBuilding,
          unitCount: barracksBuilding.getInitialUnitCount(),
          maxUnits: barracksBuilding.getMaxUnits()
        } as Barracks

      default:
        throw new Error(`Unknown building type: ${type}`)
    }
  }

  static getBuildingCost(type: BuildingType): BuildingCost {
    return BuildingRegistry.getInstance().getBuilding(type).getCost()
  }


  static getBuildingLabel(type: BuildingType): string {
    return BuildingRegistry.getInstance().getBuilding(type).getLabel().charAt(0).toUpperCase()
  }
}