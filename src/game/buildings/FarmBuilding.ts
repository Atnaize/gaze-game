import { AbstractBuilding, BuildingProduction } from './AbstractBuilding'
import { BuildingType, BuildingCost } from '../../types'

export class FarmBuilding extends AbstractBuilding {
  readonly type: BuildingType = 'farm'
  readonly cost: BuildingCost = { gold: 10 }
  readonly baseCooldown: number = 2500
  readonly gazeCooldown: number = 1500
  readonly label: string = 'Farm'
  readonly production: BuildingProduction = {
    resources: [
      { resourceType: 'food', baseAmount: 2, gazeAmount: 5, maxOutput: 1000 }
    ]
  }
}