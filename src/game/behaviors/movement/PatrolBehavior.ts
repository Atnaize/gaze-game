import { UnitBehavior } from '../UnitBehavior'
import { Unit, Position } from '../../../types'

/**
 * PatrolBehavior - Follow a path of waypoints
 *
 * Movement: Follow waypoint path, optionally loop
 * Animation: 'moving' between waypoints, 'idle' at waypoints (if pauseAtWaypoints)
 * Combat: Optional (can attack while patrolling if enabled)
 * Complete: When reaches end (or never if looping)
 */
export class PatrolBehavior implements UnitBehavior {
  private waypoints: Position[]
  private currentWaypointIndex: number = 0
  private loop: boolean
  private pauseAtWaypoints: boolean
  private pauseDuration: number
  private isPaused: boolean = false
  private pauseUntilTime: number = 0

  constructor(
    waypoints: Position[],
    loop: boolean = true,
    pauseAtWaypoints: boolean = false,
    pauseDuration: number = 2000
  ) {
    if (waypoints.length === 0) {
      throw new Error('PatrolBehavior requires at least one waypoint')
    }
    this.waypoints = waypoints
    this.loop = loop
    this.pauseAtWaypoints = pauseAtWaypoints
    this.pauseDuration = pauseDuration
  }

  getDestination(unit: Unit): Position | null {
    // If paused at waypoint, return null
    if (this.isPaused) {
      return null
    }

    // Get current waypoint
    const waypoint = this.waypoints[this.currentWaypointIndex]

    // Check if reached waypoint
    const dx = waypoint.x - unit.x
    const dy = waypoint.y - unit.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < 15) {
      // Reached waypoint - advance to next
      this.advanceToNextWaypoint()

      if (this.pauseAtWaypoints) {
        this.startPause()
        return null
      }

      return this.waypoints[this.currentWaypointIndex]
    }

    return waypoint
  }

  getSpeedMultiplier(): number {
    return 1.0
  }

  getAnimationState(unit: Unit): 'idle' | 'moving' | 'attacking' | 'hurt' {
    return this.isPaused ? 'idle' : 'moving'
  }

  shouldAttack(unit: Unit): boolean {
    return false // Patrolling units don't auto-attack (can be extended)
  }

  getAttackTarget(unit: Unit): Unit | null {
    return null
  }

  isComplete(unit: Unit): boolean {
    // Complete when reached last waypoint (if not looping)
    return !this.loop && this.currentWaypointIndex === this.waypoints.length - 1 && !this.isPaused
  }

  update(unit: Unit, deltaTime: number): void {
    if (this.isPaused) {
      const now = Date.now()
      if (now >= this.pauseUntilTime) {
        this.isPaused = false
      }
    }
  }

  private advanceToNextWaypoint(): void {
    this.currentWaypointIndex++

    if (this.currentWaypointIndex >= this.waypoints.length) {
      if (this.loop) {
        this.currentWaypointIndex = 0
      } else {
        this.currentWaypointIndex = this.waypoints.length - 1
      }
    }
  }

  private startPause(): void {
    this.isPaused = true
    this.pauseUntilTime = Date.now() + this.pauseDuration
  }
}
