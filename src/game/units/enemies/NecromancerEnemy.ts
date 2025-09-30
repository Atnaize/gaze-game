import { BaseEnemy } from '../BaseEnemy'
import { EnemyConfig } from '../../../types'

/**
 * Necromancer - Support units with magic
 * Dark magic wielders and masters of shadow
 */
export class NecromancerOfTheShadow1 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'necromancer_of_the_shadow_1',
      spriteKey: 'Necromancer_of_the_Shadow_1',
      health: 60,
      attack: 30,
      speed: 60,
      reward: 35,
      description: 'Dark magic wielder'
    }
    super(config, x, y)
  }
}

export class NecromancerOfTheShadow2 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'necromancer_of_the_shadow_2',
      spriteKey: 'Necromancer_of_the_Shadow_2',
      health: 80,
      attack: 35,
      speed: 55,
      reward: 40,
      description: 'Master of shadow magic'
    }
    super(config, x, y)
  }
}

export class NecromancerOfTheShadow3 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'necromancer_of_the_shadow_3',
      spriteKey: 'Necromancer_of_the_Shadow_3',
      health: 100,
      attack: 40,
      speed: 50,
      reward: 45,
      description: 'Archlich of the shadows'
    }
    super(config, x, y)
  }
}
