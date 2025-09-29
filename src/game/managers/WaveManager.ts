import { Wave, EnemyType, Enemy } from '../../types'
import { EnemyFactory } from '../factories/EnemyFactory'
import { GameConfig } from '../../config/GameConfig'
import { GameTimeManager } from './GameTimeManager'

export class WaveManager {
  private scene: Phaser.Scene
  private timeManager: GameTimeManager
  private currentWave: Wave | null = null
  private nextWaveTime: number
  private totalWaves: number = 0
  private battleInProgress: boolean = false

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.timeManager = GameTimeManager.getInstance()
    this.nextWaveTime = this.timeManager.getGameTime() + GameConfig.WAVE_INTERVAL
  }

  public update(): void {
    this.updateWaveSystem()
  }

  private updateWaveSystem(): void {
    const currentGameTime = this.timeManager.getGameTime()

    // Check if it's time for a new wave
    if (!this.currentWave && currentGameTime >= this.nextWaveTime) {
      this.startNewWave()
    }
  }

  private startNewWave(): void {
    this.totalWaves++
    const wave = this.generateWave(this.totalWaves)
    this.currentWave = wave
    this.battleInProgress = true

    console.log(`Starting wave ${wave.number} with ${wave.enemyCount} enemies`)

    // Spawn enemies immediately when wave starts (only if not already spawned)
    if (!wave.spawned) {
      this.doSpawnEnemies(wave)
      wave.spawned = true
    }

    // Emit wave started event
    this.scene.events.emit('wave_started', { wave })
  }

  private doSpawnEnemies(wave: Wave): void {
    for (let i = 0; i < wave.enemyCount; i++) {
      const enemyType = EnemyFactory.selectRandomEnemyType(wave.enemyTypes)
      const spawnY = GameConfig.BATTLE_CENTER_Y + (Math.random() - 0.5) * 200
      const position = { x: GameConfig.ENEMY_SPAWN_X, y: spawnY }

      // Create enemy with difficulty scaling
      const enemy = EnemyFactory.createEnemyWithStats(enemyType, position, wave.difficultyMultiplier)

      if (!enemy) {
        console.warn(`Failed to create enemy of type ${enemyType}`)
        continue
      }

      console.log(`Creating sprite for ${enemyType} enemy at (${enemy.x}, ${enemy.y})`)
      enemy.createAnimatedSprite!(this.scene)

      // Emit enemy spawned event so BattleManager can add to CombatManager
      this.scene.events.emit('enemy_spawned', { enemy })

      console.log(`Spawned enemy: ${enemyType}`)
    }
  }

  private generateWave(waveNumber: number): Wave {
    const baseSize = GameConfig.INITIAL_WAVE_SIZE
    const sizeIncrease = Math.floor((waveNumber - 1) / 3) * GameConfig.WAVE_SIZE_INCREASE
    const enemyCount = baseSize + sizeIncrease

    const difficultyMultiplier = Math.pow(GameConfig.WAVE_DIFFICULTY_MULTIPLIER, waveNumber - 1)
    const reward = Math.floor(GameConfig.BASE_WAVE_REWARD * difficultyMultiplier)

    // Determine enemy types based on wave number using factory
    const enemyTypes = EnemyFactory.getAvailableEnemyTypes(waveNumber)

    return {
      number: waveNumber,
      enemyCount,
      enemyTypes,
      difficultyMultiplier,
      reward,
      status: 'active',
      spawned: false
    }
  }


  public checkWaveComplete(enemies: Enemy[]): boolean {
    if (!this.currentWave || this.currentWave.status !== 'active') return false

    const hasAliveEnemies = enemies.some(enemy => enemy.state !== 'dead')
    if (!hasAliveEnemies) {
      this.completeWave()
      return true
    }

    return false
  }

  private completeWave(): void {
    if (!this.currentWave) return

    this.currentWave.status = 'completed'
    const reward = this.currentWave.reward

    // Award treasure
    this.scene.events.emit('treasure_earned', { amount: reward, wave: this.currentWave.number })

    // Schedule next wave using game time
    this.nextWaveTime = this.timeManager.getGameTime() + GameConfig.WAVE_INTERVAL
    this.currentWave = null
    this.battleInProgress = false
  }

  public handleDefeat(): void {
    if (!this.currentWave) return

    this.currentWave.status = 'failed'
    this.battleInProgress = false

    // Schedule next wave after defeat using game time
    this.nextWaveTime = this.timeManager.getGameTime() + GameConfig.WAVE_INTERVAL * 2 // Longer delay after defeat
    this.currentWave = null

    this.scene.events.emit('battle_defeat', { wave: this.totalWaves })
  }

  public getCurrentWave(): Wave | null {
    return this.currentWave
  }

  public getTotalWaves(): number {
    return this.totalWaves
  }

  public isBattleInProgress(): boolean {
    return this.battleInProgress
  }

  public setBattleInProgress(inProgress: boolean): void {
    this.battleInProgress = inProgress
  }

  public getTimeToNextWave(): number {
    if (this.currentWave) return 0
    const currentGameTime = this.timeManager.getGameTime()
    return Math.max(0, this.nextWaveTime - currentGameTime)
  }

  public reset(): void {
    this.currentWave = null
    this.totalWaves = 0
    this.battleInProgress = false
    this.nextWaveTime = this.timeManager.getGameTime() + GameConfig.WAVE_INTERVAL
  }

  public destroy(): void {
    this.currentWave = null
  }
}