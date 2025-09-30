import { BaseEnemy } from '../BaseEnemy'
import { EnemyConfig } from '../../../types'

/**
 * Minotaur - Bruisers
 * Bull-headed warriors with devastating melee attacks
 */
export class Minotaur1 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'minotaur_1',
      spriteKey: 'Minotaur_1',
      health: 220,
      attack: 35,
      speed: 60,
      reward: 40,
      description: 'Bull-headed warrior'
    }
    super(config, x, y)
  }
}

export class Minotaur2 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'minotaur_2',
      spriteKey: 'Minotaur_2',
      health: 260,
      attack: 40,
      speed: 55,
      reward: 45,
      description: 'Minotaur berserker'
    }
    super(config, x, y)
  }
}

export class Minotaur3 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'minotaur_3',
      spriteKey: 'Minotaur_3',
      health: 300,
      attack: 45,
      speed: 50,
      reward: 55,
      description: 'Minotaur king'
    }
    super(config, x, y)
  }
}
