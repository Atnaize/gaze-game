import { UnitBehavior } from '../UnitBehavior'
import { Unit, Position } from '../../../types'
import { GameConfig } from '../../../config/GameConfig'

/**
 * KiteBehavior - Hit and run tactics
 *
 * Movement: Attack → Retreat → Attack cycle
 * Animation: 'attacking' when engaging, 'moving' when retreating
 * Combat: Attack then retreat to safe distance
 * Complete: When target dies or too far away
 */
export class KiteBehavior implements UnitBehavior {
  private target: Unit
  private kiteDistance: number
  private lastAttackTime: number = 0
  private isRetreating: boolean = false
  private retreatPosition: Position | null = null

  constructor(target: Unit, kiteDistance: number = GameConfig.ATTACK_RANGE + 30) {
    this.target = target
    this.kiteDistance = kiteDistance
  }

  getDestination(unit: Unit): Position | null {
    if (this.target.state === 'dead') {
      return null
    }

    const dx = this.target.x - unit.x
    const dy = this.target.y - unit.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // If retreating, move to retreat position
    if (this.isRetreating) {
      if (distance >= this.kiteDistance) {
        // Reached safe distance - re-engage
        this.isRetreating = false
        this.retreatPosition = null
      } else if (this.retreatPosition) {
        return this.retreatPosition
      }
    }

    // Not retreating - move toward target
    if (distance > GameConfig.ATTACK_RANGE) {
      return { x: this.target.x, y: this.target.y }
    }

    // In attack range - stop for attack
    return null
  }

  getSpeedMultiplier(): number {
    return this.isRetreating ? 1.2 : 1.0 // Slightly faster when retreating
  }

  getAnimationState(unit: Unit): 'idle' | 'moving' | 'attacking' | 'hurt' {
    if (this.target.state === 'dead') {
      return 'idle'
    }

    if (this.isRetreating) {
      return 'moving'
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
    if (this.target.state === 'dead' || this.isRetreating) {
      return false
    }

    const dx = this.target.x - unit.x
    const dy = this.target.y - unit.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > GameConfig.ATTACK_RANGE) {
      return false
    }

    const now = Date.now()
    if (now - this.lastAttackTime < GameConfig.ATTACK_COOLDOWN) {
      return false
    }

    this.lastAttackTime = now

    // After attacking, initiate retreat
    this.startRetreat(unit)

    return true
  }

  getAttackTarget(unit: Unit): Unit | null {
    return this.target.state !== 'dead' ? this.target : null
  }

  isComplete(unit: Unit): boolean {
    if (this.target.state === 'dead') {
      return true
    }

    // Complete if target is too far (lost)
    const dx = this.target.x - unit.x
    const dy = this.target.y - unit.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    return distance > this.kiteDistance * 2
  }

  update(unit: Unit, deltaTime: number): void {
    // Kite logic handled in other methods
  }

  private startRetreat(unit: Unit): void {
    this.isRetreating = true

    // Calculate retreat direction (away from target)
    const dx = unit.x - this.target.x
    const dy = unit.y - this.target.y
    const angle = Math.atan2(dy, dx)

    // Retreat position is kiteDistance away from target
    this.retreatPosition = {
      x: unit.x + Math.cos(angle) * this.kiteDistance,
      y: unit.y + Math.sin(angle) * this.kiteDistance
    }
  }

  public getTarget(): Unit {
    return this.target
  }
}
