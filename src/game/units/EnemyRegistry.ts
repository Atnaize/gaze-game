import { EnemyConfig, EnemyType } from '../../types'

export class EnemyRegistry {
  private static instance: EnemyRegistry
  private configs: Map<EnemyType, EnemyConfig> = new Map()

  static getInstance(): EnemyRegistry {
    if (!EnemyRegistry.instance) {
      EnemyRegistry.instance = new EnemyRegistry()
    }
    return EnemyRegistry.instance
  }

  private constructor() {
    this.initializeConfigs()
  }

  private initializeConfigs(): void {
    const configs: EnemyConfig[] = [
      // Skeleton Warriors - Fast, moderate damage
      {
        type: 'skeleton_warrior_1',
        spriteKey: 'Skeleton_Warrior_1',
        health: 100,
        attack: 15,
        speed: 80,
        reward: 10,
        description: 'Basic skeleton warrior with sword and shield'
      },
      {
        type: 'skeleton_warrior_2',
        spriteKey: 'Skeleton_Warrior_2',
        health: 120,
        attack: 18,
        speed: 75,
        reward: 12,
        description: 'Armored skeleton warrior with enhanced combat skills'
      },
      {
        type: 'skeleton_warrior_3',
        spriteKey: 'Skeleton_Warrior_3',
        health: 140,
        attack: 22,
        speed: 70,
        reward: 15,
        description: 'Elite skeleton warrior with advanced weaponry'
      },

      // Skeleton Crusaders - Tanky, slow, high damage
      {
        type: 'skeleton_crusader_1',
        spriteKey: 'Skeleton_Crusader_1',
        health: 200,
        attack: 25,
        speed: 50,
        reward: 20,
        description: 'Heavy armored crusader with massive weapon'
      },
      {
        type: 'skeleton_crusader_2',
        spriteKey: 'Skeleton_Crusader_2',
        health: 250,
        attack: 30,
        speed: 45,
        reward: 25,
        description: 'Veteran crusader with blessed armor'
      },
      {
        type: 'skeleton_crusader_3',
        spriteKey: 'Skeleton_Crusader_3',
        health: 300,
        attack: 35,
        speed: 40,
        reward: 30,
        description: 'Champion crusader with divine protection'
      },

      // Fallen Angels - Balanced flying units
      {
        type: 'fallen_angels_1',
        spriteKey: 'Fallen_Angels_1',
        health: 150,
        attack: 20,
        speed: 90,
        reward: 18,
        description: 'Corrupted angel with dark wings'
      },
      {
        type: 'fallen_angels_2',
        spriteKey: 'Fallen_Angels_2',
        health: 180,
        attack: 25,
        speed: 85,
        reward: 22,
        description: 'Battle-hardened fallen angel'
      },
      {
        type: 'fallen_angels_3',
        spriteKey: 'Fallen_Angels_3',
        health: 220,
        attack: 30,
        speed: 80,
        reward: 28,
        description: 'Archangel of destruction'
      },

      // Reaper Men - High damage, low health
      {
        type: 'reaper_man_1',
        spriteKey: 'Reaper_Man_1',
        health: 80,
        attack: 35,
        speed: 85,
        reward: 25,
        description: 'Death incarnate with scythe'
      },
      {
        type: 'reaper_man_2',
        spriteKey: 'Reaper_Man_2',
        health: 100,
        attack: 40,
        speed: 80,
        reward: 30,
        description: 'Experienced harvester of souls'
      },
      {
        type: 'reaper_man_3',
        spriteKey: 'Reaper_Man_3',
        health: 120,
        attack: 45,
        speed: 75,
        reward: 35,
        description: 'Grim reaper lord'
      },

      // Necromancers - Support units with magic
      {
        type: 'necromancer_of_the_shadow_1',
        spriteKey: 'Necromancer_of_the_Shadow_1',
        health: 60,
        attack: 30,
        speed: 60,
        reward: 35,
        description: 'Dark magic wielder'
      },
      {
        type: 'necromancer_of_the_shadow_2',
        spriteKey: 'Necromancer_of_the_Shadow_2',
        health: 80,
        attack: 35,
        speed: 55,
        reward: 40,
        description: 'Master of shadow magic'
      },
      {
        type: 'necromancer_of_the_shadow_3',
        spriteKey: 'Necromancer_of_the_Shadow_3',
        health: 100,
        attack: 40,
        speed: 50,
        reward: 45,
        description: 'Archlich of the shadows'
      },

      // Dark Oracles - Mysterious casters
      {
        type: 'dark_oracle_1',
        spriteKey: 'Dark_Oracle_1',
        health: 90,
        attack: 25,
        speed: 65,
        reward: 30,
        description: 'Prophet of doom'
      },
      {
        type: 'dark_oracle_2',
        spriteKey: 'Dark_Oracle_2',
        health: 110,
        attack: 30,
        speed: 60,
        reward: 35,
        description: 'Seer of darkness'
      },
      {
        type: 'dark_oracle_3',
        spriteKey: 'Dark_Oracle_3',
        health: 130,
        attack: 35,
        speed: 55,
        reward: 40,
        description: 'Oracle of the void'
      },

      // Zombie Villagers - Slow, numerous
      {
        type: 'zombie_villager_1',
        spriteKey: 'Zombie_Villager_1',
        health: 70,
        attack: 10,
        speed: 40,
        reward: 5,
        description: 'Infected village peasant'
      },
      {
        type: 'zombie_villager_2',
        spriteKey: 'Zombie_Villager_2',
        health: 85,
        attack: 12,
        speed: 35,
        reward: 7,
        description: 'Plague-ridden villager'
      },
      {
        type: 'zombie_villager_3',
        spriteKey: 'Zombie_Villager_3',
        health: 100,
        attack: 15,
        speed: 30,
        reward: 10,
        description: 'Zombie village elder'
      },

      // Wraiths - Fast, ethereal
      {
        type: 'wraith_01',
        spriteKey: 'Wraith_01',
        health: 120,
        attack: 18,
        speed: 100,
        reward: 20,
        description: 'Spectral undead warrior'
      },
      {
        type: 'wraith_02',
        spriteKey: 'Wraith_02',
        health: 140,
        attack: 22,
        speed: 95,
        reward: 25,
        description: 'Vengeful spirit'
      },
      {
        type: 'wraith_03',
        spriteKey: 'Wraith_03',
        health: 160,
        attack: 26,
        speed: 90,
        reward: 30,
        description: 'Ancient wraith lord'
      },

      // Valkyries - Elite warriors
      {
        type: 'valkyrie_1',
        spriteKey: 'Valkyrie_1',
        health: 180,
        attack: 28,
        speed: 75,
        reward: 35,
        description: 'Fallen warrior maiden'
      },
      {
        type: 'valkyrie_2',
        spriteKey: 'Valkyrie_2',
        health: 210,
        attack: 32,
        speed: 70,
        reward: 40,
        description: 'Battle-tested valkyrie'
      },
      {
        type: 'valkyrie_3',
        spriteKey: 'Valkyrie_3',
        health: 250,
        attack: 38,
        speed: 65,
        reward: 50,
        description: 'Valkyrie commander'
      },

      // Golems - Tank units
      {
        type: 'golem_1',
        spriteKey: 'Golem_1',
        health: 300,
        attack: 20,
        speed: 30,
        reward: 25,
        description: 'Stone construct guardian'
      },
      {
        type: 'golem_2',
        spriteKey: 'Golem_2',
        health: 400,
        attack: 25,
        speed: 25,
        reward: 35,
        description: 'Iron golem defender'
      },
      {
        type: 'golem_3',
        spriteKey: 'Golem_3',
        health: 500,
        attack: 30,
        speed: 20,
        reward: 45,
        description: 'Adamantine golem titan'
      },

      // Minotaurs - Bruisers
      {
        type: 'minotaur_1',
        spriteKey: 'Minotaur_1',
        health: 220,
        attack: 35,
        speed: 60,
        reward: 40,
        description: 'Bull-headed warrior'
      },
      {
        type: 'minotaur_2',
        spriteKey: 'Minotaur_2',
        health: 260,
        attack: 40,
        speed: 55,
        reward: 45,
        description: 'Minotaur berserker'
      },
      {
        type: 'minotaur_3',
        spriteKey: 'Minotaur_3',
        health: 300,
        attack: 45,
        speed: 50,
        reward: 55,
        description: 'Minotaur king'
      },

      // Goblins - Small, fast, weak
      {
        type: 'goblin',
        spriteKey: 'Goblin',
        health: 50,
        attack: 8,
        speed: 90,
        reward: 5,
        description: 'Small green pest'
      },

      // Large creatures
      {
        type: 'ogre',
        spriteKey: 'Ogre',
        health: 350,
        attack: 40,
        speed: 35,
        reward: 50,
        description: 'Massive brute with club'
      },
      {
        type: 'orc',
        spriteKey: 'Orc',
        health: 180,
        attack: 25,
        speed: 65,
        reward: 25,
        description: 'Savage green warrior'
      },
      {
        type: 'troll',
        spriteKey: 'Ogre', // Using Ogre sprite as fallback for troll
        health: 400,
        attack: 45,
        speed: 40,
        reward: 60,
        description: 'Massive regenerating beast'
      }
    ]

    configs.forEach(config => {
      this.configs.set(config.type, config)
    })
  }

  getConfig(type: EnemyType): EnemyConfig | undefined {
    return this.configs.get(type)
  }

  getAllConfigs(): EnemyConfig[] {
    return Array.from(this.configs.values())
  }

  getConfigsByDifficulty(minHealth: number, maxHealth: number): EnemyConfig[] {
    return this.getAllConfigs().filter(config =>
      config.health >= minHealth && config.health <= maxHealth
    )
  }

  getRandomConfig(): EnemyConfig {
    const configs = this.getAllConfigs()
    return configs[Math.floor(Math.random() * configs.length)]
  }

  getAllTypes(): EnemyType[] {
    return Array.from(this.configs.keys())
  }
}