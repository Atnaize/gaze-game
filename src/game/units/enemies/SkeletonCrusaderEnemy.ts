import { BaseEnemy } from '../BaseEnemy'
import { EnemyConfig } from '../../../types'

/**
 * Skeleton Crusader - Tanky, slow, high damage
 * Heavy armored crusaders with massive weapons
 */
export class SkeletonCrusader1 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'skeleton_crusader_1',
      spriteKey: 'Skeleton_Crusader_1',
      health: 200,
      attack: 25,
      speed: 50,
      reward: 20,
      description: 'Heavy armored crusader with massive weapon'
    }
    super(config, x, y)
  }
}

export class SkeletonCrusader2 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'skeleton_crusader_2',
      spriteKey: 'Skeleton_Crusader_2',
      health: 250,
      attack: 30,
      speed: 45,
      reward: 25,
      description: 'Veteran crusader with blessed armor'
    }
    super(config, x, y)
  }
}

export class SkeletonCrusader3 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'skeleton_crusader_3',
      spriteKey: 'Skeleton_Crusader_3',
      health: 300,
      attack: 35,
      speed: 40,
      reward: 30,
      description: 'Champion crusader with divine protection'
    }
    super(config, x, y)
  }
}
