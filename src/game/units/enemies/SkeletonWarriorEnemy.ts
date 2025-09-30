import { BaseEnemy } from '../BaseEnemy'
import { EnemyConfig } from '../../../types'

/**
 * Skeleton Warrior - Fast, moderate damage
 * Basic undead warriors that are quick and agile
 */
export class SkeletonWarrior1 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'skeleton_warrior_1',
      spriteKey: 'Skeleton_Warrior_1',
      health: 100,
      attack: 15,
      speed: 80,
      reward: 10,
      description: 'Basic skeleton warrior with sword and shield'
    }
    super(config, x, y)
  }
}

export class SkeletonWarrior2 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'skeleton_warrior_2',
      spriteKey: 'Skeleton_Warrior_2',
      health: 120,
      attack: 18,
      speed: 75,
      reward: 12,
      description: 'Armored skeleton warrior with enhanced combat skills'
    }
    super(config, x, y)
  }
}

export class SkeletonWarrior3 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'skeleton_warrior_3',
      spriteKey: 'Skeleton_Warrior_3',
      health: 140,
      attack: 22,
      speed: 70,
      reward: 15,
      description: 'Elite skeleton warrior with advanced weaponry'
    }
    super(config, x, y)
  }
}
