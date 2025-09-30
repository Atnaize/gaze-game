import { BaseEnemy } from '../BaseEnemy'
import { EnemyConfig } from '../../../types'

/**
 * Dark Oracle - Mysterious casters
 * Prophets of doom and seers of darkness
 */
export class DarkOracle1 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'dark_oracle_1',
      spriteKey: 'Dark_Oracle_1',
      health: 90,
      attack: 25,
      speed: 65,
      reward: 30,
      description: 'Prophet of doom'
    }
    super(config, x, y)
  }
}

export class DarkOracle2 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'dark_oracle_2',
      spriteKey: 'Dark_Oracle_2',
      health: 110,
      attack: 30,
      speed: 60,
      reward: 35,
      description: 'Seer of darkness'
    }
    super(config, x, y)
  }
}

export class DarkOracle3 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'dark_oracle_3',
      spriteKey: 'Dark_Oracle_3',
      health: 130,
      attack: 35,
      speed: 55,
      reward: 40,
      description: 'Oracle of the void'
    }
    super(config, x, y)
  }
}
