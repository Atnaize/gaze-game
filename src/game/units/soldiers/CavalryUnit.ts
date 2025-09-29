import { SoldierUnit } from '../SoldierUnit'
import { Position } from '../../../types/index'

export class CavalryUnit extends SoldierUnit {
  constructor(id: string, position: Position) {
    super(id, position, 'cavalry')

    // Cavalry-specific stats
    this.health = SoldierUnit.SOLDIER_HEALTH * 1.3
    this.maxHealth = this.health
    this.attack = SoldierUnit.SOLDIER_ATTACK * 1.1
    this.speed = SoldierUnit.SOLDIER_SPEED * 1.5
  }

  protected getColor(): number {
    return 0xFFD700 // Gold color for cavalry
  }

  protected getSize(): number {
    return SoldierUnit.SOLDIER_SIZE * 1.2 // Larger
  }
}