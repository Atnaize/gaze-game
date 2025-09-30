import { UnitBehavior } from '../UnitBehavior'
import { Unit, Position, Enemy, Soldier } from '../../../types'
import { GameConfig } from '../../../config/GameConfig'

/**
 * GuardBehavior - Defend a specific position
 *
 * Movement: Stay near guard point, chase enemies within guard radius
 * Animation: 'idle' when guarding, 'moving' when repositioning, 'attacking' when fighting
 * Combat: Attack enemies within guard radius
 * Complete: Never (always guarding)
 */
export class GuardBehavior implements UnitBehavior {
  private guardPosition: Position
  private guardRadius: number
  private enemies: (Enemy | Soldier)[]
  private currentTarget: Unit | null = null
  private lastAttackTime: number = 0

  constructor(
    guardPosition: Position,
    enemies: (Enemy | Soldier)[],
    guardRadius: number = 100
  ) {
    this.guardPosition = guardPosition
    this.enemies = enemies
    this.guardRadius = guardRadius
  }

  getDestination(unit: Unit): Position | null {
    // Update enemy list
    const aliveEnemies = this.enemies.filter(e => e.state !== 'dead')

    // Find closest enemy within guard radius
    this.currentTarget = this.findClosestEnemyInRadius(unit, aliveEnemies)

    if (this.currentTarget) {
      // Chase enemy (but stay within guard radius)
      const dx = this.currentTarget.x - unit.x
      const dy = this.currentTarget.y - unit.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance <= GameConfig.ATTACK_RANGE) {
        // In attack range - stop
        return null
      }

      // Chase target
      return { x: this.currentTarget.x, y: this.currentTarget.y }
    }

    // No enemy - return to guard position if too far
    const dx = this.guardPosition.x - unit.x
    const dy = this.guardPosition.y - unit.y
    const distanceFromGuard = Math.sqrt(dx * dx + dy * dy)

    if (distanceFromGuard > 20) {
      return this.guardPosition
    }

    return null // At guard position, stay idle
  }

  getSpeedMultiplier(): number {
    return 1.0
  }

  getAnimationState(unit: Unit): 'idle' | 'moving' | 'attacking' | 'hurt' {
    if (this.currentTarget) {
      const dx = this.currentTarget.x - unit.x
      const dy = this.currentTarget.y - unit.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance <= GameConfig.ATTACK_RANGE) {
        return 'attacking'
      }
      return 'moving'
    }

    // Check if at guard position
    const dx = this.guardPosition.x - unit.x
    const dy = this.guardPosition.y - unit.y
    const distanceFromGuard = Math.sqrt(dx * dx + dy * dy)

    return distanceFromGuard > 20 ? 'moving' : 'idle'
  }

  shouldAttack(unit: Unit): boolean {
    if (!this.currentTarget || this.currentTarget.state === 'dead') {
      return false
    }

    const dx = this.currentTarget.x - unit.x
    const dy = this.currentTarget.y - unit.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > GameConfig.ATTACK_RANGE) {
      return false
    }

    const now = Date.now()
    if (now - this.lastAttackTime < GameConfig.ATTACK_COOLDOWN) {
      return false
    }

    this.lastAttackTime = now
    return true
  }

  getAttackTarget(unit: Unit): Unit | null {
    return this.currentTarget
  }

  isComplete(unit: Unit): boolean {
    return false // Guard never completes
  }

  update(unit: Unit, deltaTime: number): void {
    // Enemy checking happens in getDestination
  }

  public setEnemies(enemies: (Enemy | Soldier)[]): void {
    this.enemies = enemies
  }

  private findClosestEnemyInRadius(unit: Unit, enemies: (Enemy | Soldier)[]): Unit | null {
    let closest: Unit | null = null
    let closestDistance = Infinity

    for (const enemy of enemies) {
      // Check if enemy is within guard radius from guard position
      const dxFromGuard = enemy.x - this.guardPosition.x
      const dyFromGuard = enemy.y - this.guardPosition.y
      const distanceFromGuard = Math.sqrt(dxFromGuard * dxFromGuard + dyFromGuard * dyFromGuard)

      if (distanceFromGuard > this.guardRadius) {
        continue // Enemy too far from guard position
      }

      // Check distance from unit
      const dx = enemy.x - unit.x
      const dy = enemy.y - unit.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < closestDistance) {
        closestDistance = distance
        closest = enemy
      }
    }

    return closest
  }
}
