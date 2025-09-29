import { BattleArenaState } from '../../types/index'
import { GameTimeManager } from './GameTimeManager'
import { WallManager } from './WallManager'
import { WaveManager } from './WaveManager'
import { CombatManager } from './CombatManager'

export class BattleManager {
  private scene: Phaser.Scene
  private arena: BattleArenaState
  private timeManager: GameTimeManager
  private wallManager: WallManager
  private waveManager: WaveManager
  private combatManager: CombatManager

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.timeManager = GameTimeManager.getInstance()
    this.wallManager = new WallManager(scene)
    this.waveManager = new WaveManager(scene)
    this.combatManager = new CombatManager(scene)
    this.arena = this.initializeArena()

    // Create wall visuals in the scene
    this.wallManager.createWallVisuals()

    // Listen for enemy spawned events
    this.scene.events.on('enemy_spawned', (data: { enemy: any }) => {
      this.combatManager.addEnemy(data.enemy)
    })
  }

  private initializeArena(): BattleArenaState {
    const wallState = this.wallManager.getWallState()
    return {
      soldiers: [],
      enemies: [],
      currentWave: null,
      nextWaveTime: this.timeManager.getGameTime(),
      battleInProgress: false,
      totalWaves: 0,
      stats: this.combatManager.getStats(),
      kingdomWall: wallState,
      gameOver: wallState.isDestroyed
    }
  }

  public update(deltaTime: number): void {
    if (!this.scene.add) return

    // Get game delta time (automatically handles pause/speed)
    const gameDelta = this.timeManager.getDeltaTime(deltaTime)

    // If paused, gameDelta will be 0 and nothing updates
    if (gameDelta === 0) return

    // Update managers
    this.waveManager.update()
    this.combatManager.updateUnits(gameDelta)
    this.checkBattleOutcome()
    this.syncArenaState()
  }

  private syncArenaState(): void {
    // Sync current wave and battle state
    this.arena.currentWave = this.waveManager.getCurrentWave()
    this.arena.totalWaves = this.waveManager.getTotalWaves()
    this.arena.battleInProgress = this.waveManager.isBattleInProgress()

    // Sync units
    this.arena.soldiers = this.combatManager.getSoldiers()
    this.arena.enemies = this.combatManager.getEnemies()

    // Sync stats
    this.arena.stats = this.combatManager.getStats()

    // Sync wall state
    this.arena.kingdomWall = this.wallManager.getWallState()
    this.arena.gameOver = this.wallManager.isWallDestroyed()

    // Check if wave is complete
    if (this.arena.currentWave && this.arena.currentWave.status === 'active') {
      if (this.waveManager.checkWaveComplete(this.combatManager.getEnemies())) {
        const currentWave = this.waveManager.getCurrentWave()
        if (currentWave) {
          this.combatManager.addTreasure(currentWave.reward)
        }
        this.combatManager.cleanupDeadUnits()
      }
    }
  }

  private checkBattleOutcome(): void {
    if (!this.arena.battleInProgress) return

    const battleState = this.combatManager.checkBattleOutcome()

    // If no soldiers are alive but enemies remain, enemies attack the wall
    if (!battleState.hasAliveSoldiers && battleState.hasAliveEnemies) {
      this.wallManager.handleWallAttack(this.combatManager.getAliveEnemies())
    }

    // Check if wall is destroyed (game over)
    if (this.wallManager.isWallDestroyed()) {
      this.handleGameOver()
    }
  }

  private handleGameOver(): void {
    // Pause the game
    this.arena.gameOver = true
    this.waveManager.setBattleInProgress(false)

    // Let combat manager handle cleanup and emit event
    this.combatManager.handleGameOver()
  }

  private handleDefeat(): void {
    this.waveManager.handleDefeat()
    this.combatManager.handleDefeat()
  }

  public getSoldiersCountByBarracks(barracksId: string): number {
    return this.combatManager.getSoldiersCountByBarracks(barracksId)
  }

  public canAddSoldierFromBarracks(barracksId: string, maxUnits: number): boolean {
    return this.combatManager.canAddSoldierFromBarracks(barracksId, maxUnits)
  }

  public addSoldier(barracksId?: string): void {
    // Fire and forget the async operation
    this.combatManager.addSoldier(barracksId).catch(error => {
      console.error('Failed to add soldier:', error)
    })
  }

  public getArenaState(): BattleArenaState {
    this.syncArenaState()
    return { ...this.arena }
  }

  public getStats() {
    return this.combatManager.getStats()
  }

  public getTimeToNextWave(): number {
    return this.waveManager.getTimeToNextWave()
  }

  public reset(): void {
    this.wallManager.resetWall()
    this.waveManager.reset()
    this.combatManager.reset()
    this.arena = this.initializeArena()
  }

  public destroy(): void {
    this.wallManager.destroy()
    this.waveManager.destroy()
    this.combatManager.destroy()

    this.arena.soldiers = []
    this.arena.enemies = []
  }
}