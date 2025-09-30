import { BaseEnemy } from '../BaseEnemy'
import { EnemyConfig } from '../../../types'

/**
 * Valkyrie - Elite warriors
 * Fallen warrior maidens with exceptional combat prowess
 */
export class Valkyrie1 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'valkyrie_1',
      spriteKey: 'Valkyrie_1',
      health: 180,
      attack: 28,
      speed: 75,
      reward: 35,
      description: 'Fallen warrior maiden'
    }
    super(config, x, y)
  }
}

export class Valkyrie2 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'valkyrie_2',
      spriteKey: 'Valkyrie_2',
      health: 210,
      attack: 32,
      speed: 70,
      reward: 40,
      description: 'Battle-tested valkyrie'
    }
    super(config, x, y)
  }
}

export class Valkyrie3 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'valkyrie_3',
      spriteKey: 'Valkyrie_3',
      health: 250,
      attack: 38,
      speed: 65,
      reward: 50,
      description: 'Valkyrie commander'
    }
    super(config, x, y)
  }
}
