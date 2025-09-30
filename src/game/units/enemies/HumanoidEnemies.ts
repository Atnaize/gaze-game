import { BaseEnemy } from '../BaseEnemy'
import { EnemyConfig } from '../../../types'

/**
 * Large Humanoid Creatures
 * Massive brutes including ogres, orcs, and trolls
 */
export class Ogre extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'ogre',
      spriteKey: 'Ogre',
      health: 350,
      attack: 40,
      speed: 35,
      reward: 50,
      description: 'Massive brute with club'
    }
    super(config, x, y)
  }
}

export class Orc extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'orc',
      spriteKey: 'Orc',
      health: 180,
      attack: 25,
      speed: 65,
      reward: 25,
      description: 'Savage green warrior'
    }
    super(config, x, y)
  }
}

export class Troll extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'troll',
      spriteKey: 'Ogre',
      health: 400,
      attack: 45,
      speed: 40,
      reward: 60,
      description: 'Massive regenerating beast'
    }
    super(config, x, y)
  }
}
