import { UnitBehavior } from '../UnitBehavior'
import { Unit, Position } from '../../../types'
import { GameConfig } from '../../../config/GameConfig'

/**
 * CombatBehavior - Chase and attack a target enemy
 *
 * Movement: Chase target until within attack range
 * Animation: 'moving' while chasing, 'attacking' when in range
 * Combat: Attack when in range and cooldown ready
 * Complete: When target dies
 */
export class CombatBehavior implements UnitBehavior {
  private target: Unit
  private lastAttackTime: number = 0

  constructor(target: Unit) {
    this.target = target
  }

  getDestination(unit: Unit): Position | null {
    if (this.target.state === 'dead') {
      return null
    }

    // Check if in attack range
    const dx = this.target.x - unit.x
    const dy = this.target.y - unit.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= GameConfig.ATTACK_RANGE) {
      // In range - stop moving
      return null
    }

    // Chase target
    return { x: this.target.x, y: this.target.y }
  }

  getSpeedMultiplier(): number {
    return 1.0 // Full speed when fighting
  }

  getAnimationState(unit: Unit): 'idle' | 'moving' | 'attacking' | 'hurt' {
    if (this.target.state === 'dead') {
      return 'idle'
    }

    const dx = this.target.x - unit.x
    const dy = this.target.y - unit.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= GameConfig.ATTACK_RANGE) {
      return 'attacking'
    }

    return 'moving'
  }

  shouldAttack(unit: Unit): boolean {
    if (this.target.state === 'dead') {
      return false
    }

    // Check distance
    const dx = this.target.x - unit.x
    const dy = this.target.y - unit.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > GameConfig.ATTACK_RANGE) {
      return false
    }

    // Check cooldown
    const now = Date.now()
    const cooldown = GameConfig.ATTACK_COOLDOWN
    if (now - this.lastAttackTime < cooldown) {
      return false
    }

    this.lastAttackTime = now
    return true
  }

  getAttackTarget(unit: Unit): Unit | null {
    return this.target.state !== 'dead' ? this.target : null
  }

  isComplete(unit: Unit): boolean {
    return this.target.state === 'dead'
  }

  update(unit: Unit, deltaTime: number): void {
    // Combat behavior doesn't need per-frame updates
    // Target position changes automatically
  }

  /**
   * Get the current target (useful for testing/debugging)
   */
  getTarget(): Unit {
    return this.target
  }
}
