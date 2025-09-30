import { BaseEnemy } from '../BaseEnemy'
import { EnemyConfig } from '../../../types'

/**
 * Goblin - Small, fast, weak
 * Tiny green pests that swarm in numbers
 */
export class Goblin extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'goblin',
      spriteKey: 'Goblin',
      health: 50,
      attack: 8,
      speed: 90,
      reward: 5,
      description: 'Small green pest'
    }
    super(config, x, y)
  }
}
