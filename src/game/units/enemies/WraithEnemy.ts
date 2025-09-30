import { BaseEnemy } from '../BaseEnemy'
import { EnemyConfig } from '../../../types'

/**
 * Wraith - Fast, ethereal
 * Spectral undead warriors and vengeful spirits
 * Wraiths attack quickly (0.7s) - supernatural speed
 */
export class Wraith01 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'wraith_01',
      spriteKey: 'Wraith_01',
      health: 120,
      attack: 18,
      speed: 100,
      reward: 20,
      description: 'Spectral undead warrior',
      attackCooldown: 700 // Fast supernatural attacks
    }
    super(config, x, y)
  }
}

export class Wraith02 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'wraith_02',
      spriteKey: 'Wraith_02',
      health: 140,
      attack: 22,
      speed: 95,
      reward: 25,
      description: 'Vengeful spirit',
      attackCooldown: 700
    }
    super(config, x, y)
  }
}

export class Wraith03 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'wraith_03',
      spriteKey: 'Wraith_03',
      health: 160,
      attack: 26,
      speed: 90,
      reward: 30,
      description: 'Ancient wraith lord',
      attackCooldown: 700
    }
    super(config, x, y)
  }
}
