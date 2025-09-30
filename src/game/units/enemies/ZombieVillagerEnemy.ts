import { BaseEnemy } from '../BaseEnemy'
import { EnemyConfig } from '../../../types'

/**
 * Zombie Villager - Slow, numerous
 * Infected villagers shambling toward their doom
 * Zombies attack slower (1.5s) due to their clumsy nature
 */
export class ZombieVillager1 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'zombie_villager_1',
      spriteKey: 'Zombie_Villager_1',
      health: 70,
      attack: 10,
      speed: 40,
      reward: 5,
      description: 'Infected village peasant',
      attackCooldown: 1500 // Slow and clumsy
    }
    super(config, x, y)
  }
}

export class ZombieVillager2 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'zombie_villager_2',
      spriteKey: 'Zombie_Villager_2',
      health: 85,
      attack: 12,
      speed: 35,
      reward: 7,
      description: 'Plague-ridden villager',
      attackCooldown: 1500
    }
    super(config, x, y)
  }
}

export class ZombieVillager3 extends BaseEnemy {
  constructor(x: number, y: number) {
    const config: EnemyConfig = {
      type: 'zombie_villager_3',
      spriteKey: 'Zombie_Villager_3',
      health: 100,
      attack: 15,
      speed: 30,
      reward: 10,
      description: 'Zombie village elder',
      attackCooldown: 1500
    }
    super(config, x, y)
  }
}
