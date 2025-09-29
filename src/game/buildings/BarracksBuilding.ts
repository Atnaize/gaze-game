import { AbstractBuilding, BuildingProduction } from './AbstractBuilding'
import { BuildingType, BuildingCost } from '../../types'

export class BarracksBuilding extends AbstractBuilding {
  readonly type: BuildingType = 'barracks'
  readonly cost: BuildingCost = { gold: 20 }
  readonly baseCooldown: number = 5000
  readonly gazeCooldown: number = 3000
  readonly label: string = 'Barracks'
  readonly production: BuildingProduction = {
    resources: [
      { resourceType: 'soldiers', baseAmount: 1, gazeAmount: 1, maxOutput: 100 }
    ]
  }
  readonly initialUnitCount: number = 0
  readonly maxUnits: number = 5

  getInitialUnitCount(): number {
    return this.initialUnitCount
  }

  getMaxUnits(): number {
    return this.maxUnits
  }
}