import { UnitBehavior } from '../UnitBehavior'
import { Unit, Position } from '../../../types'

/**
 * MoveToPositionBehavior - Move directly to a specific position
 *
 * Movement: Direct path to destination
 * Animation: 'moving' while traveling, 'idle' when arrived
 * Combat: Never attacks (focused on movement)
 * Complete: When destination reached
 */
export class MoveToPositionBehavior implements UnitBehavior {
  private destination: Position
  private speedMultiplier: number
  private arrivalThreshold: number
  private arrived: boolean = false

  constructor(
    destination: Position,
    speedMultiplier: number = 1.0,
    arrivalThreshold: number = 20
  ) {
    this.destination = destination
    this.speedMultiplier = speedMultiplier
    this.arrivalThreshold = arrivalThreshold
  }

  getDestination(unit: Unit): Position | null {
    if (this.arrived) {
      return null
    }

    // Check if arrived
    const dx = this.destination.x - unit.x
    const dy = this.destination.y - unit.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < this.arrivalThreshold) {
      this.arrived = true
      return null
    }

    return this.destination
  }

  getSpeedMultiplier(): number {
    return this.speedMultiplier
  }

  getAnimationState(unit: Unit): 'idle' | 'moving' | 'attacking' | 'hurt' {
    return this.arrived ? 'idle' : 'moving'
  }

  shouldAttack(unit: Unit): boolean {
    return false
  }

  getAttackTarget(unit: Unit): Unit | null {
    return null
  }

  isComplete(unit: Unit): boolean {
    return this.arrived
  }

  update(unit: Unit, deltaTime: number): void {
    // Movement logic handles arrival check
  }
}
