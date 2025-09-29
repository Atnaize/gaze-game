import { AbstractBuilding, BuildingProduction } from './AbstractBuilding'
import { BuildingType, BuildingCost } from '../../types'

export class MineBuilding extends AbstractBuilding {
  readonly type: BuildingType = 'mine'
  readonly cost: BuildingCost = { gold: 15 }
  readonly baseCooldown: number = 4000
  readonly gazeCooldown: number = 2500
  readonly label: string = 'Mine'
  readonly production: BuildingProduction = {
    resources: [
      { resourceType: 'stone', baseAmount: 1, gazeAmount: 2, maxOutput: 300 },
      { resourceType: 'gold', baseAmount: 1, gazeAmount: 2, maxOutput: 200 }
    ]
  }
}