import { Enemy, EnemyType, Position } from '../../types/index'
import { BaseEnemy } from '../units/BaseEnemy'
import * as Enemies from '../units/enemies'

/**
 * Factory for creating enemy instances using dedicated enemy classes
 * Each enemy type has its own class with embedded configuration
 */
export class EnemyFactory {
  // Map of enemy types to their class constructors
  private static enemyClasses: Record<EnemyType, new (x: number, y: number) => BaseEnemy> = {
    // Skeleton Warriors
    'skeleton_warrior_1': Enemies.SkeletonWarrior1,
    'skeleton_warrior_2': Enemies.SkeletonWarrior2,
    'skeleton_warrior_3': Enemies.SkeletonWarrior3,

    // Skeleton Crusaders
    'skeleton_crusader_1': Enemies.SkeletonCrusader1,
    'skeleton_crusader_2': Enemies.SkeletonCrusader2,
    'skeleton_crusader_3': Enemies.SkeletonCrusader3,

    // Fallen Angels
    'fallen_angels_1': Enemies.FallenAngels1,
    'fallen_angels_2': Enemies.FallenAngels2,
    'fallen_angels_3': Enemies.FallenAngels3,

    // Reaper Men
    'reaper_man_1': Enemies.ReaperMan1,
    'reaper_man_2': Enemies.ReaperMan2,
    'reaper_man_3': Enemies.ReaperMan3,

    // Necromancers
    'necromancer_of_the_shadow_1': Enemies.NecromancerOfTheShadow1,
    'necromancer_of_the_shadow_2': Enemies.NecromancerOfTheShadow2,
    'necromancer_of_the_shadow_3': Enemies.NecromancerOfTheShadow3,

    // Dark Oracles
    'dark_oracle_1': Enemies.DarkOracle1,
    'dark_oracle_2': Enemies.DarkOracle2,
    'dark_oracle_3': Enemies.DarkOracle3,

    // Zombie Villagers
    'zombie_villager_1': Enemies.ZombieVillager1,
    'zombie_villager_2': Enemies.ZombieVillager2,
    'zombie_villager_3': Enemies.ZombieVillager3,

    // Wraiths
    'wraith_01': Enemies.Wraith01,
    'wraith_02': Enemies.Wraith02,
    'wraith_03': Enemies.Wraith03,

    // Valkyries
    'valkyrie_1': Enemies.Valkyrie1,
    'valkyrie_2': Enemies.Valkyrie2,
    'valkyrie_3': Enemies.Valkyrie3,

    // Golems
    'golem_1': Enemies.Golem1,
    'golem_2': Enemies.Golem2,
    'golem_3': Enemies.Golem3,

    // Minotaurs
    'minotaur_1': Enemies.Minotaur1,
    'minotaur_2': Enemies.Minotaur2,
    'minotaur_3': Enemies.Minotaur3,

    // Goblins
    'goblin': Enemies.Goblin,

    // Humanoids
    'ogre': Enemies.Ogre,
    'orc': Enemies.Orc,
    'troll': Enemies.Troll
  }

  /**
   * Create an enemy of the specified type at the given position
   */
  static createEnemy(type: EnemyType, position: Position): Enemy {
    const EnemyClass = this.enemyClasses[type]
    if (!EnemyClass) {
      throw new Error(`Unknown enemy type: ${type}`)
    }
    return new EnemyClass(position.x, position.y)
  }

  /**
   * Create an enemy with difficulty scaling applied
   */
  static createEnemyWithStats(
    type: EnemyType,
    position: Position,
    difficultyMultiplier: number = 1
  ): Enemy {
    const enemy = this.createEnemy(type, position)

    // Apply difficulty scaling
    if (difficultyMultiplier !== 1) {
      enemy.health = Math.floor(enemy.health * difficultyMultiplier)
      enemy.maxHealth = Math.floor(enemy.maxHealth * difficultyMultiplier)
      enemy.attack = Math.floor(enemy.attack * difficultyMultiplier)
      enemy.reward = Math.floor(enemy.reward * difficultyMultiplier)
    }

    return enemy
  }

  /**
   * Create a random enemy from all available types
   */
  static createRandomEnemy(position: Position, difficultyMultiplier: number = 1): Enemy {
    const allTypes = this.getAllEnemyTypes()
    const randomType = allTypes[Math.floor(Math.random() * allTypes.length)]
    return this.createEnemyWithStats(randomType, position, difficultyMultiplier)
  }

  /**
   * Get enemy types available for a specific wave number
   */
  static getAvailableEnemyTypes(waveNumber: number): EnemyType[] {
    if (waveNumber <= 2) {
      return ['goblin', 'zombie_villager_1']
    } else if (waveNumber <= 5) {
      return [
        'goblin', 'zombie_villager_1', 'zombie_villager_2',
        'skeleton_warrior_1', 'orc'
      ]
    } else if (waveNumber <= 10) {
      return [
        'goblin', 'zombie_villager_1', 'zombie_villager_2', 'zombie_villager_3',
        'skeleton_warrior_1', 'skeleton_warrior_2',
        'orc', 'wraith_01', 'fallen_angels_1'
      ]
    } else if (waveNumber <= 15) {
      return [
        'skeleton_warrior_2', 'skeleton_warrior_3',
        'skeleton_crusader_1', 'orc', 'ogre',
        'wraith_01', 'wraith_02',
        'fallen_angels_1', 'fallen_angels_2',
        'reaper_man_1', 'dark_oracle_1'
      ]
    } else if (waveNumber <= 25) {
      return [
        'skeleton_crusader_2', 'skeleton_crusader_3',
        'fallen_angels_2', 'fallen_angels_3',
        'reaper_man_2', 'reaper_man_3',
        'necromancer_of_the_shadow_1', 'necromancer_of_the_shadow_2',
        'dark_oracle_2', 'valkyrie_1',
        'golem_1', 'minotaur_1'
      ]
    } else {
      return [
        'necromancer_of_the_shadow_3', 'dark_oracle_3',
        'valkyrie_2', 'valkyrie_3',
        'golem_2', 'golem_3',
        'minotaur_2', 'minotaur_3',
        'wraith_03'
      ]
    }
  }

  /**
   * Get enemy types by difficulty level
   */
  static getEnemyTypesByDifficulty(difficulty: 'easy' | 'medium' | 'hard' | 'nightmare'): EnemyType[] {
    switch (difficulty) {
      case 'easy':
        return [
          'goblin', 'zombie_villager_1', 'zombie_villager_2',
          'skeleton_warrior_1', 'orc'
        ]
      case 'medium':
        return [
          'skeleton_warrior_2', 'skeleton_warrior_3',
          'skeleton_crusader_1', 'wraith_01', 'wraith_02',
          'fallen_angels_1', 'fallen_angels_2'
        ]
      case 'hard':
        return [
          'skeleton_crusader_2', 'skeleton_crusader_3',
          'fallen_angels_3', 'reaper_man_1', 'reaper_man_2', 'reaper_man_3',
          'necromancer_of_the_shadow_1', 'necromancer_of_the_shadow_2',
          'dark_oracle_1', 'dark_oracle_2',
          'golem_1', 'minotaur_1'
        ]
      case 'nightmare':
        return [
          'necromancer_of_the_shadow_3', 'dark_oracle_3',
          'valkyrie_1', 'valkyrie_2', 'valkyrie_3',
          'golem_2', 'golem_3',
          'minotaur_2', 'minotaur_3',
          'wraith_03', 'ogre', 'troll'
        ]
      default:
        return this.getAllEnemyTypes()
    }
  }

  /**
   * Select a random enemy type from available types
   */
  static selectRandomEnemyType(availableTypes: EnemyType[]): EnemyType {
    return availableTypes[Math.floor(Math.random() * availableTypes.length)]
  }

  /**
   * Get all available enemy types
   */
  static getAllEnemyTypes(): EnemyType[] {
    return Object.keys(this.enemyClasses) as EnemyType[]
  }

  /**
   * Get the class constructor for an enemy type
   */
  static getEnemyClass(type: EnemyType) {
    return this.enemyClasses[type]
  }
}
