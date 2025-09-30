import { UnitBehavior } from '../UnitBehavior'
import { Unit, Position } from '../../../types'

/**
 * FleeBehavior - Run away from a threat
 *
 * Movement: Run directly away from threat position
 * Animation: 'moving' (always running)
 * Combat: Never attacks
 * Complete: When safe distance reached
 */
export class FleeBehavior implements UnitBehavior {
  private threatPosition: Position
  private safeDistance: number
  private fleeDestination: Position | null = null

  constructor(threatPosition: Position, safeDistance: number = 200) {
    this.threatPosition = threatPosition
    this.safeDistance = safeDistance
  }

  getDestination(unit: Unit): Position | null {
    // Calculate flee direction (opposite of threat)
    const dx = unit.x - this.threatPosition.x
    const dy = unit.y - this.threatPosition.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance >= this.safeDistance) {
      // Already safe
      return null
    }

    // Run in opposite direction
    const fleeAngle = Math.atan2(dy, dx)
    this.fleeDestination = {
      x: unit.x + Math.cos(fleeAngle) * (this.safeDistance - distance),
      y: unit.y + Math.sin(fleeAngle) * (this.safeDistance - distance)
    }

    return this.fleeDestination
  }

  getSpeedMultiplier(): number {
    return 1.5 // Run faster when fleeing
  }

  getAnimationState(unit: Unit): 'idle' | 'moving' | 'attacking' | 'hurt' {
    return 'moving' // Always moving when fleeing
  }

  shouldAttack(unit: Unit): boolean {
    return false // Don't attack while fleeing
  }

  getAttackTarget(unit: Unit): Unit | null {
    return null
  }

  isComplete(unit: Unit): boolean {
    const dx = unit.x - this.threatPosition.x
    const dy = unit.y - this.threatPosition.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance >= this.safeDistance
  }

  update(unit: Unit, deltaTime: number): void {
    // Flee behavior recalculates destination each frame
  }
}
