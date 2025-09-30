import { UnitBehavior } from '../UnitBehavior'
import { Unit, Position } from '../../../types'
import { GameConfig } from '../../../config/GameConfig'

/**
 * WanderBehavior - Organic patrol around anchor point
 *
 * Movement: Walk to random points → idle → walk → idle (creates natural patrol)
 * Animation: 'moving' while walking, 'idle' while stopped
 * Combat: Never attacks
 * Complete: Never (infinite patrol)
 */
export class WanderBehavior implements UnitBehavior {
  private anchor: Position
  private currentTarget: Position | null = null
  private radius: number
  private isIdling: boolean = false
  private idleUntilTime: number = 0

  constructor(anchor: Position, radius: number = GameConfig.ALLY_WANDER_RADIUS) {
    this.anchor = anchor
    this.radius = radius
    this.pickNewTarget()
  }

  getDestination(unit: Unit): Position | null {
    // Return null when idling to make unit stop
    if (this.isIdling) {
      return null
    }

    // Check if reached current target
    if (this.currentTarget) {
      const dx = this.currentTarget.x - unit.x
      const dy = this.currentTarget.y - unit.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 10) {
        // Reached target - start idling
        this.startIdling()
        return null
      }
    }

    return this.currentTarget
  }

  getSpeedMultiplier(): number {
    return GameConfig.ALLY_WANDER_SPEED_MULTIPLIER // Slow wandering (0.5)
  }

  getAnimationState(unit: Unit): 'idle' | 'moving' | 'attacking' | 'hurt' {
    if (this.isIdling || !this.currentTarget) {
      return 'idle'
    }
    return 'moving'
  }

  shouldAttack(unit: Unit): boolean {
    return false // Wandering units don't attack
  }

  getAttackTarget(unit: Unit): Unit | null {
    return null
  }

  isComplete(unit: Unit): boolean {
    return false // Wander never completes on its own
  }

  update(unit: Unit, deltaTime: number): void {
    const now = Date.now()

    // If idling, check if idle period is over
    if (this.isIdling) {
      if (now >= this.idleUntilTime) {
        // Idle period complete - pick new target and start walking
        this.isIdling = false
        this.pickNewTarget()
      }
    }
  }

  private startIdling(): void {
    this.isIdling = true

    // Random idle duration between min and max
    const idleDuration = GameConfig.ALLY_WANDER_IDLE_MIN +
                        Math.random() * (GameConfig.ALLY_WANDER_IDLE_MAX - GameConfig.ALLY_WANDER_IDLE_MIN)
    this.idleUntilTime = Date.now() + idleDuration
  }

  private pickNewTarget(): void {
    // Random angle and distance from anchor
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * this.radius

    this.currentTarget = {
      x: this.anchor.x + Math.cos(angle) * distance,
      y: this.anchor.y + Math.sin(angle) * distance
    }
  }
}
