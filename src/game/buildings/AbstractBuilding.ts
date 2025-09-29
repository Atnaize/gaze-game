import { BuildingType, BuildingCost } from '../../types'

export interface ProductionOutput {
  resourceType: keyof import('../../types').Resources
  amount: number
}

export interface ResourceProduction {
  resourceType: keyof import('../../types').Resources
  baseAmount: number
  gazeAmount: number
  maxOutput: number
}

export interface BuildingProduction {
  resources: ResourceProduction[]
}

export abstract class AbstractBuilding {
  abstract readonly type: BuildingType
  abstract readonly cost: BuildingCost
  abstract readonly baseCooldown: number
  abstract readonly gazeCooldown: number
  abstract readonly label: string
  abstract readonly production: BuildingProduction

  getType(): BuildingType {
    return this.type
  }

  getCost(): BuildingCost {
    return this.cost
  }

  getBaseCooldown(): number {
    return this.baseCooldown
  }

  getGazeCooldown(): number {
    return this.gazeCooldown
  }

  getMaxCooldown(): number {
    return this.baseCooldown
  }


  getLabel(): string {
    return this.label
  }

  getCostString(): string {
    const costs = []
    if (this.cost.gold) costs.push(`${this.cost.gold} Gold`)
    if (this.cost.food) costs.push(`${this.cost.food} Food`)
    if (this.cost.stone) costs.push(`${this.cost.stone} Stone`)
    if (this.cost.soldiers) costs.push(`${this.cost.soldiers} Soldiers`)
    return costs.join(', ')
  }

  getDisplayLabel(): string {
    return `Build ${this.label} (${this.getCostString()})`
  }

  getProduction(): BuildingProduction {
    return this.production
  }

  getBaseProduction(): ProductionOutput[] {
    return this.production.resources.map(resource => ({
      resourceType: resource.resourceType,
      amount: resource.baseAmount
    }))
  }

  getGazeProduction(): ProductionOutput[] {
    return this.production.resources.map(resource => ({
      resourceType: resource.resourceType,
      amount: resource.gazeAmount
    }))
  }

  getMaxOutputForResource(resourceType: keyof import('../../types').Resources): number {
    const resource = this.production.resources.find(r => r.resourceType === resourceType)
    return resource?.maxOutput || 0
  }

  getAllMaxOutputs(): Record<keyof import('../../types').Resources, number> {
    const outputs: any = { gold: 0, food: 0, stone: 0, soldiers: 0 }
    this.production.resources.forEach(resource => {
      outputs[resource.resourceType] = resource.maxOutput
    })
    return outputs
  }
}