import { UnitBehavior } from '../UnitBehavior'
import { Unit, Position } from '../../../types'
import { GameConfig } from '../../../config/GameConfig'

/**
 * AttackWallBehavior - Move toward and attack the kingdom wall (for enemies)
 *
 * Movement: Direct path to wall
 * Animation: 'moving' while approaching, 'attacking' when at wall
 * Combat: Attack wall when in range
 * Complete: Never (enemies attack until dead)
 */
export class AttackWallBehavior implements UnitBehavior {
  private wallPosition: Position
  private lastAttackTime: number = 0

  constructor() {
    // Wall position from GameConfig
    this.wallPosition = {
      x: GameConfig.KINGDOM_WALL_X,
      y: GameConfig.KINGDOM_WALL_Y + GameConfig.KINGDOM_WALL_HEIGHT / 2
    }
  }

  getDestination(unit: Unit): Position | null {
    const dx = this.wallPosition.x - unit.x
    const dy = this.wallPosition.y - unit.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // If in attack range, stop moving
    if (distance <= GameConfig.ATTACK_RANGE + 20) {
      return null
    }

    return this.wallPosition
  }

  getSpeedMultiplier(): number {
    return 1.0
  }

  getAnimationState(unit: Unit): 'idle' | 'moving' | 'attacking' | 'hurt' {
    const dx = this.wallPosition.x - unit.x
    const dy = this.wallPosition.y - unit.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= GameConfig.ATTACK_RANGE + 20) {
      return 'attacking'
    }

    return 'moving'
  }

  shouldAttack(unit: Unit): boolean {
    const dx = this.wallPosition.x - unit.x
    const dy = this.wallPosition.y - unit.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > GameConfig.ATTACK_RANGE + 20) {
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
    // Wall isn't a Unit - will be handled specially
    return null
  }

  isComplete(unit: Unit): boolean {
    return false // Never complete - attack wall until dead
  }

  update(unit: Unit, deltaTime: number): void {
    // Wall position is static
  }
}
