import { BaseEnemy } from '../BaseEnemy'
import { EnemyConfig } from '../../../types'

/**
 * Reaper Man - High damage, low health
 * Death incarnate wielding deadly scythes
 */
export class ReaperMan1 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'reaper_man_1',
      spriteKey: 'Reaper_Man_1',
      health: 80,
      attack: 35,
      speed: 85,
      reward: 25,
      description: 'Death incarnate with scythe'
    }
    super(config, x, y)
  }
}

export class ReaperMan2 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'reaper_man_2',
      spriteKey: 'Reaper_Man_2',
      health: 100,
      attack: 40,
      speed: 80,
      reward: 30,
      description: 'Experienced harvester of souls'
    }
    super(config, x, y)
  }
}

export class ReaperMan3 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'reaper_man_3',
      spriteKey: 'Reaper_Man_3',
      health: 120,
      attack: 45,
      speed: 75,
      reward: 35,
      description: 'Grim reaper lord'
    }
    super(config, x, y)
  }
}
