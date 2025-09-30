import { AbstractUnit } from './AbstractUnit'
import { Soldier, Enemy, Position, SoldierType } from '../../types'
import { GameConfig } from '../../config/GameConfig'
import { CombatBehavior } from '../behaviors/combat/CombatBehavior'
import { WanderBehavior } from '../behaviors/movement/WanderBehavior'
import { MoveToPositionBehavior } from '../behaviors/movement/MoveToPositionBehavior'

/**
 * BaseAlly - Behavior System V2
 *
 * Allied units automatically switch between behaviors based on game state:
 * - Enemies present → CombatBehavior (chase and attack closest enemy)
 * - Far from wall → MoveToPositionBehavior (return to wall)
 * - Near wall, no enemies → WanderBehavior (patrol with idle cycles)
 */
export abstract class BaseAlly extends AbstractUnit implements Soldier {
  public faction: 'player' = 'player' as const
  public abstract type: SoldierType

  protected enemies: Enemy[] = []
  protected nearbyAllies: Soldier[] = []

  constructor(
    id: string,
    position: Position,
    health: number,
    attack: number,
    speed: number
  ) {
    super(id, position, health, attack, speed)
  }

  public setEnemies(enemies: Enemy[]): void {
    this.enemies = enemies
  }

  public setNearbySoldiers(soldiers: Soldier[]): void {
    this.nearbyAllies = soldiers.filter(s => s.id !== this.id)
  }

  /**
   * Behavior selection based on game state
   */
  protected selectBehavior(): void {
    const aliveEnemies = this.enemies.filter(e => e.state !== 'dead')

    if (aliveEnemies.length > 0) {
      // Combat mode - attack closest enemy
      const closestEnemy = this.findClosestEnemy(aliveEnemies)
      if (closestEnemy) {
        this.currentBehavior = new CombatBehavior(closestEnemy)
        return
      }
    }

    // No enemies - return to wall or wander
    const wallPosition = this.getWallPosition()
    const distanceToWall = this.distanceTo(wallPosition)

    if (distanceToWall > GameConfig.ALLY_WANDER_RADIUS + 20) {
      // Far from wall - return to it
      this.currentBehavior = new MoveToPositionBehavior(wallPosition)
    } else {
      // Near wall - wander around it
      this.currentBehavior = new WanderBehavior(wallPosition)
    }
  }

  /**
   * Legacy method - now uses selectBehavior
   */
  protected findTarget(): void {
    this.selectBehavior()
  }

  public update(deltaTime: number, gameSpeed: number): void {
    // Call parent behavior-driven update
    super.update(deltaTime, gameSpeed)

    // Apply separation force to avoid unit stacking
    this.applySeparationForce()
  }

  private findClosestEnemy(enemies: Enemy[]): Enemy | undefined {
    let closest: Enemy | undefined
    let closestDistance = Infinity

    for (const enemy of enemies) {
      const distance = this.distanceTo(enemy)
      if (distance < closestDistance) {
        closestDistance = distance
        closest = enemy
      }
    }

    return closest
  }

  private getWallPosition(): Position {
    return {
      x: GameConfig.KINGDOM_WALL_X + GameConfig.KINGDOM_WALL_WIDTH + 10,
      y: GameConfig.KINGDOM_WALL_Y + GameConfig.KINGDOM_WALL_HEIGHT / 2
    }
  }

  private distanceTo(target: Position): number {
    const dx = target.x - this.x
    const dy = target.y - this.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  private applySeparationForce(): void {
    let separationX = 0
    let separationY = 0
    let nearbyCount = 0

    for (const ally of this.nearbyAllies) {
      if (ally.state === 'dead') continue

      const dx = this.x - ally.x
      const dy = this.y - ally.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < GameConfig.UNIT_COLLISION_RADIUS && distance > 0) {
        // Push away from nearby unit
        const force = (GameConfig.UNIT_COLLISION_RADIUS - distance) / GameConfig.UNIT_COLLISION_RADIUS
        separationX += (dx / distance) * force
        separationY += (dy / distance) * force
        nearbyCount++
      }
    }

    if (nearbyCount > 0) {
      // Apply averaged separation force
      this.x += separationX * GameConfig.UNIT_SEPARATION_FORCE
      this.y += separationY * GameConfig.UNIT_SEPARATION_FORCE
    }
  }
}
