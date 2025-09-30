import { BaseEnemy } from '../BaseEnemy'
import { EnemyConfig } from '../../../types'

/**
 * Golem - Tank units
 * Massive stone and metal constructs with immense durability
 */
export class Golem1 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'golem_1',
      spriteKey: 'Golem_1',
      health: 300,
      attack: 20,
      speed: 30,
      reward: 25,
      description: 'Stone construct guardian'
    }
    super(config, x, y)
  }
}

export class Golem2 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'golem_2',
      spriteKey: 'Golem_2',
      health: 400,
      attack: 25,
      speed: 25,
      reward: 35,
      description: 'Iron golem defender'
    }
    super(config, x, y)
  }
}

export class Golem3 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'golem_3',
      spriteKey: 'Golem_3',
      health: 500,
      attack: 30,
      speed: 20,
      reward: 45,
      description: 'Adamantine golem titan'
    }
    super(config, x, y)
  }
}
