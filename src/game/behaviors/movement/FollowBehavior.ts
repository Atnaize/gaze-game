import { UnitBehavior } from '../UnitBehavior'
import { Unit, Position } from '../../../types'

/**
 * FollowBehavior - Stay near a leader unit
 *
 * Movement: Follow leader, maintain follow distance
 * Animation: 'moving' when catching up, 'idle' when close enough
 * Combat: Optional (can attack enemies near leader)
 * Complete: Never (or when leader dies)
 */
export class FollowBehavior implements UnitBehavior {
  private leader: Unit
  private followDistance: number
  private maxDistance: number

  constructor(
    leader: Unit,
    followDistance: number = 50,
    maxDistance: number = 100
  ) {
    this.leader = leader
    this.followDistance = followDistance
    this.maxDistance = maxDistance
  }

  getDestination(unit: Unit): Position | null {
    if (this.leader.state === 'dead') {
      return null
    }

    const dx = this.leader.x - unit.x
    const dy = this.leader.y - unit.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Too close - stay idle
    if (distance < this.followDistance) {
      return null
    }

    // Follow leader
    return { x: this.leader.x, y: this.leader.y }
  }

  getSpeedMultiplier(): number {
    // Check if far behind - run faster to catch up
    const dx = this.leader.x - (this.leader as any).x || 0
    const dy = this.leader.y - (this.leader as any).y || 0
    const distance = Math.sqrt(dx * dx + dy * dy)

    return distance > this.maxDistance ? 1.5 : 1.0
  }

  getAnimationState(unit: Unit): 'idle' | 'moving' | 'attacking' | 'hurt' {
    if (this.leader.state === 'dead') {
      return 'idle'
    }

    const dx = this.leader.x - unit.x
    const dy = this.leader.y - unit.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    return distance < this.followDistance ? 'idle' : 'moving'
  }

  shouldAttack(unit: Unit): boolean {
    return false // Follow behavior doesn't attack (can be extended)
  }

  getAttackTarget(unit: Unit): Unit | null {
    return null
  }

  isComplete(unit: Unit): boolean {
    return this.leader.state === 'dead'
  }

  update(unit: Unit, deltaTime: number): void {
    // Leader position updates automatically
  }

  public getLeader(): Unit {
    return this.leader
  }
}
