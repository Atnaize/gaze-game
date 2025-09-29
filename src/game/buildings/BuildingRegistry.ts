import { AbstractBuilding } from './AbstractBuilding'
import { FarmBuilding } from './FarmBuilding'
import { MineBuilding } from './MineBuilding'
import { BarracksBuilding } from './BarracksBuilding'
import { BuildingType } from '../../types'

export class BuildingRegistry {
  private static instance: BuildingRegistry
  private buildings: Map<BuildingType, AbstractBuilding>

  private constructor() {
    this.buildings = new Map()
    this.registerBuildings()
  }

  public static getInstance(): BuildingRegistry {
    if (!BuildingRegistry.instance) {
      BuildingRegistry.instance = new BuildingRegistry()
    }
    return BuildingRegistry.instance
  }

  private registerBuildings(): void {
    this.buildings.set('farm', new FarmBuilding())
    this.buildings.set('mine', new MineBuilding())
    this.buildings.set('barracks', new BarracksBuilding())
  }

  public getBuilding(type: BuildingType): AbstractBuilding {
    const building = this.buildings.get(type)
    if (!building) {
      throw new Error(`Unknown building type: ${type}`)
    }
    return building
  }

  public getAllBuildingTypes(): BuildingType[] {
    return Array.from(this.buildings.keys())
  }

  public getAllBuildings(): AbstractBuilding[] {
    return Array.from(this.buildings.values())
  }
}