import { BaseEnemy } from '../BaseEnemy'
import { EnemyConfig } from '../../../types'

/**
 * Fallen Angels - Balanced flying units
 * Corrupted celestial beings with dark wings
 */
export class FallenAngels1 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'fallen_angels_1',
      spriteKey: 'Fallen_Angels_1',
      health: 150,
      attack: 20,
      speed: 90,
      reward: 18,
      description: 'Corrupted angel with dark wings'
    }
    super(config, x, y)
  }
}

export class FallenAngels2 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'fallen_angels_2',
      spriteKey: 'Fallen_Angels_2',
      health: 180,
      attack: 25,
      speed: 85,
      reward: 22,
      description: 'Battle-hardened fallen angel'
    }
    super(config, x, y)
  }
}

export class FallenAngels3 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'fallen_angels_3',
      spriteKey: 'Fallen_Angels_3',
      health: 220,
      attack: 30,
      speed: 80,
      reward: 28,
      description: 'Archangel of destruction'
    }
    super(config, x, y)
  }
}
