import { KingdomWall } from '../KingdomWall'
import { Enemy } from '../../types'
import { GameConfig } from '../../config/GameConfig'

export class WallManager {
  private kingdomWall: KingdomWall
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.kingdomWall = new KingdomWall()
  }

  public createWallVisuals(): void {
    this.kingdomWall.createVisuals(this.scene)
  }

  public handleWallAttack(aliveEnemies: Enemy[]): void {
    // Only enemies that are attacking and close to the wall can damage it
    const wallX = GameConfig.KINGDOM_WALL_X + GameConfig.KINGDOM_WALL_WIDTH
    const wallY = GameConfig.KINGDOM_WALL_Y + GameConfig.KINGDOM_WALL_HEIGHT / 2

    let totalDamage = 0
    aliveEnemies.forEach(enemy => {
      // Check if enemy is attacking state and close to wall
      if (enemy.state === 'attacking') {
        const distanceToWall = Phaser.Math.Distance.Between(enemy.x, enemy.y, wallX, wallY)

        if (distanceToWall <= GameConfig.ATTACK_RANGE) {
          // Enemies deal damage to wall proportional to their attack power
          // Reduce the damage rate to make the wall last longer
          totalDamage += enemy.attack * 0.05 // 5% of their attack power per frame
        }
      }
    })

    // Apply damage to the wall
    if (totalDamage > 0) {
      this.kingdomWall.takeDamage(totalDamage)
      console.log(`Kingdom wall takes ${totalDamage.toFixed(1)} damage. HP: ${this.kingdomWall.currentHP}/${this.kingdomWall.maxHP}`)
    }
  }

  public isWallDestroyed(): boolean {
    return this.kingdomWall.isDestroyed
  }

  public getWallState(): { currentHP: number, maxHP: number, isDestroyed: boolean } {
    return {
      currentHP: this.kingdomWall.currentHP,
      maxHP: this.kingdomWall.maxHP,
      isDestroyed: this.kingdomWall.isDestroyed
    }
  }

  public repairWall(amount: number): void {
    this.kingdomWall.repair(amount)
  }

  public resetWall(): void {
    this.kingdomWall.currentHP = this.kingdomWall.maxHP
    this.kingdomWall.isDestroyed = false
  }

  public destroy(): void {
    if (this.kingdomWall) {
      this.kingdomWall.destroy()
    }
  }
}