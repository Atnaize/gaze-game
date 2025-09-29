import { Enemy, EnemyType, Position } from '../../types/index'
import { DynamicEnemy } from '../units/DynamicEnemy'
import { EnemyRegistry } from '../units/EnemyRegistry'

export class EnemyFactory {
  private static registry = EnemyRegistry.getInstance()

  static createEnemy(type: EnemyType, position: Position): Enemy {
    const enemy = new DynamicEnemy(type, position.x, position.y)
    return enemy
  }

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

  static createRandomEnemy(position: Position, difficultyMultiplier: number = 1): Enemy {
    const randomConfig = this.registry.getRandomConfig()
    return this.createEnemyWithStats(randomConfig.type, position, difficultyMultiplier)
  }

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

  static getEnemyTypesByDifficulty(difficulty: 'easy' | 'medium' | 'hard' | 'nightmare'): EnemyType[] {
    switch (difficulty) {
      case 'easy':
        return this.registry.getConfigsByDifficulty(50, 150).map(config => config.type)
      case 'medium':
        return this.registry.getConfigsByDifficulty(100, 250).map(config => config.type)
      case 'hard':
        return this.registry.getConfigsByDifficulty(200, 400).map(config => config.type)
      case 'nightmare':
        return this.registry.getConfigsByDifficulty(300, 500).map(config => config.type)
      default:
        return this.registry.getAllTypes()
    }
  }

  static selectRandomEnemyType(availableTypes: EnemyType[]): EnemyType {
    return availableTypes[Math.floor(Math.random() * availableTypes.length)]
  }

  static getAllEnemyTypes(): EnemyType[] {
    return this.registry.getAllTypes()
  }

  static getEnemyConfig(type: EnemyType) {
    return this.registry.getConfig(type)
  }
}