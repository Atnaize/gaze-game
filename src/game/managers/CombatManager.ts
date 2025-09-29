import { Soldier, Enemy, BattleStats } from '../../types'
import { InfantryUnit } from '../units/index'
import { GameConfig } from '../../config/GameConfig'

export class CombatManager {
  private scene: Phaser.Scene
  private soldiers: Soldier[] = []
  private enemies: Enemy[] = []
  private soldierIdCounter = 0
  private stats: BattleStats = {
    soldierKills: 0,
    enemyKills: 0,
    totalBattles: 0,
    goldEarned: 0
  }

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  public updateUnits(gameDelta: number): void {
    // Update all soldiers with game delta time (already adjusted for pause/speed)
    for (const soldier of this.soldiers) {
      if (soldier.state !== 'dead') {
        soldier.update(gameDelta, 1) // gameSpeed is now 1 since gameDelta is pre-adjusted
        // Update enemy references for targeting
        const activeEnemies = this.enemies.filter(e => e.state !== 'dead')
        soldier.setEnemies(activeEnemies)
      }
    }

    // Update all enemies
    for (const enemy of this.enemies) {
      if (enemy.state !== 'dead') {
        enemy.update(gameDelta, 1) // gameSpeed is now 1 since gameDelta is pre-adjusted
        // Update soldier references for targeting
        const activeSoldiers = this.soldiers.filter(s => s.state !== 'dead')
        enemy.setSoldiers(activeSoldiers)
      }
    }
  }

  public checkBattleOutcome(): { hasAliveSoldiers: boolean, hasAliveEnemies: boolean } {
    const aliveSoldiers = this.soldiers.filter(s => s.state !== 'dead')
    const aliveEnemies = this.enemies.filter(e => e.state !== 'dead')

    return {
      hasAliveSoldiers: aliveSoldiers.length > 0,
      hasAliveEnemies: aliveEnemies.length > 0
    }
  }

  public getAliveEnemies(): Enemy[] {
    return this.enemies.filter(e => e.state !== 'dead')
  }

  public getAliveSoldiers(): Soldier[] {
    return this.soldiers.filter(s => s.state !== 'dead')
  }

  public cleanupDeadUnits(): void {
    // Remove dead soldiers
    const deadSoldiers = this.soldiers.filter(s => s.state === 'dead')
    for (const soldier of deadSoldiers) {
      soldier.destroy()
      this.stats.soldierKills++
    }
    this.soldiers = this.soldiers.filter(s => s.state !== 'dead')

    // Remove dead enemies
    const deadEnemies = this.enemies.filter(e => e.state === 'dead')
    for (const enemy of deadEnemies) {
      enemy.destroy()
      this.stats.enemyKills++
    }
    this.enemies = this.enemies.filter(e => e.state !== 'dead')
  }

  public getSoldiersCountByBarracks(barracksId: string): number {
    return this.soldiers.filter(s =>
      s.state !== 'dead' && (s as any).barracksId === barracksId
    ).length
  }

  public canAddSoldierFromBarracks(barracksId: string, maxUnits: number): boolean {
    return this.getSoldiersCountByBarracks(barracksId) < maxUnits
  }

  public async addSoldier(barracksId?: string): Promise<void> {
    console.log('CombatManager.addSoldier() called!')
    const spawnY = GameConfig.BATTLE_CENTER_Y + (Math.random() - 0.5) * 100

    // For now, always create infantry soldiers (can be enhanced later)
    const soldier = new InfantryUnit(
      `soldier_${this.soldierIdCounter++}`,
      { x: GameConfig.SOLDIER_SPAWN_X, y: spawnY }
    )

    // Track which barracks this soldier came from
    if (barracksId) {
      (soldier as any).barracksId = barracksId
    }

    console.log(`Created soldier at position (${soldier.x}, ${soldier.y})`)

    const activeEnemies = this.enemies.filter(e => e.state !== 'dead')
    soldier.setEnemies(activeEnemies)

    console.log('Creating animated soldier sprite...')
    await soldier.createAnimatedSprite(this.scene)
    console.log('Animated soldier sprite created successfully')

    this.soldiers.push(soldier)

    console.log(`Total soldiers in arena: ${this.soldiers.length}`)

    this.scene.events.emit('unit_spawned', { unit: soldier })
  }

  public addEnemy(enemy: Enemy): void {
    enemy.setSoldiers(this.soldiers)
    this.enemies.push(enemy)
  }

  public addTreasure(amount: number): void {
    this.stats.goldEarned += amount
  }

  public handleGameOver(totalWaves: number): void {
    console.log('Game Over! Kingdom wall has been destroyed!')

    // Count ALL soldiers (both dead and alive) as lost
    // Dead soldiers haven't been cleaned up yet, so they're still in the array
    for (const soldier of this.soldiers) {
      this.stats.soldierKills++
      soldier.destroy()
    }
    this.soldiers = []

    // Clean up remaining enemies
    for (const enemy of this.enemies) {
      if (enemy.state !== 'dead') {
        enemy.destroy()
      }
    }
    this.enemies = []

    // Emit game over event with stats and totalWaves
    this.scene.events.emit('game_over', {
      stats: this.stats,
      totalWaves
    })
  }

  public handleDefeat(): void {
    // Clean up remaining enemies
    for (const enemy of this.enemies) {
      if (enemy.state !== 'dead') {
        enemy.destroy()
      }
    }
    this.enemies = []
  }

  public getStats(): BattleStats {
    return { ...this.stats }
  }

  public getSoldiers(): Soldier[] {
    return this.soldiers
  }

  public getEnemies(): Enemy[] {
    return this.enemies
  }

  public reset(): void {
    // Clean up all units
    for (const soldier of this.soldiers) {
      soldier.destroy()
    }
    for (const enemy of this.enemies) {
      enemy.destroy()
    }

    this.soldiers = []
    this.enemies = []
    this.soldierIdCounter = 0
    this.stats = {
      soldierKills: 0,
      enemyKills: 0,
      totalBattles: 0,
      goldEarned: 0
    }
  }

  public destroy(): void {
    // Clean up all units
    for (const soldier of this.soldiers) {
      soldier.destroy()
    }
    for (const enemy of this.enemies) {
      enemy.destroy()
    }

    this.soldiers = []
    this.enemies = []
  }
}