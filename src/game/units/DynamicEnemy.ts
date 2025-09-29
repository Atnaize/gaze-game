import { BaseEnemy } from './BaseEnemy'
import { EnemyType } from '../../types'
import { EnemyRegistry } from './EnemyRegistry'

export class DynamicEnemy extends BaseEnemy {
  constructor(type: EnemyType, x: number = 0, y: number = 0) {
    const registry = EnemyRegistry.getInstance()
    const config = registry.getConfig(type)

    if (!config) {
      throw new Error(`Enemy configuration not found for type: ${type}`)
    }

    super(config, x, y)
  }

  static create(type: EnemyType, x: number = 0, y: number = 0): DynamicEnemy {
    return new DynamicEnemy(type, x, y)
  }

  static createRandom(x: number = 0, y: number = 0): DynamicEnemy {
    const registry = EnemyRegistry.getInstance()
    const config = registry.getRandomConfig()
    return new DynamicEnemy(config.type, x, y)
  }
}