import { Position, Unit, UnitState } from '../../types'

/**
 * UnitBehavior Interface V2
 *
 * Behaviors are self-contained strategies that control ALL aspects of unit behavior:
 * - Movement (where to go, how fast)
 * - Animation (which animation to play)
 * - Combat (when to attack, who to attack)
 * - State (unit state transitions)
 *
 * This pattern provides:
 * - Clean separation of concerns
 * - Reusability across ally and enemy units
 * - Easy extension with new behaviors
 * - Complete control over unit behavior
 */
export interface UnitBehavior {
  /**
   * Get the current destination position for movement
   * @param unit The unit executing this behavior
   * @returns Position to move toward, or null if unit should stay still
   */
  getDestination(unit: Unit): Position | null

  /**
   * Get speed multiplier for movement
   * @returns Multiplier applied to unit's base speed (0.5 = half speed, 1.0 = normal, 1.5 = faster)
   */
  getSpeedMultiplier(): number

  /**
   * Get the animation state this behavior wants the unit to display
   * Behavior decides animation based on its internal logic
   * @param unit The unit executing this behavior
   * @returns Animation state ('idle', 'moving', 'attacking', 'hurt')
   */
  getAnimationState(unit: Unit): Exclude<UnitState, 'dead'>

  /**
   * Check if this behavior wants to attack right now
   * @param unit The unit executing this behavior
   * @returns true if unit should attempt attack
   */
  shouldAttack(unit: Unit): boolean

  /**
   * Get the target to attack (if shouldAttack returns true)
   * @param unit The unit executing this behavior
   * @returns Target unit to attack, or null
   */
  getAttackTarget(unit: Unit): Unit | null

  /**
   * Check if this behavior has completed its objective
   * When complete, unit will select a new behavior
   * @param unit The unit executing this behavior
   * @returns true if behavior is done
   */
  isComplete(unit: Unit): boolean

  /**
   * Update behavior state each frame
   * @param unit The unit executing this behavior
   * @param deltaTime Time since last update in milliseconds
   */
  update(unit: Unit, deltaTime: number): void

  /**
   * Called when behavior becomes active
   * Optional hook for initialization
   * @param unit The unit starting this behavior
   */
  onEnter?(unit: Unit): void

  /**
   * Called when behavior ends (completed or interrupted)
   * Optional hook for cleanup
   * @param unit The unit ending this behavior
   */
  onExit?(unit: Unit): void
}
