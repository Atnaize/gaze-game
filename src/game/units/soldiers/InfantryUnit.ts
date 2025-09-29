import { SoldierUnit } from '../SoldierUnit'
import { Position } from '../../../types/index'

export class InfantryUnit extends SoldierUnit {
  constructor(id: string, position: Position) {
    super(id, position, 'infantry')

    // Infantry-specific stats (default soldier stats)
    this.health = SoldierUnit.SOLDIER_HEALTH
    this.maxHealth = this.health
    this.attack = SoldierUnit.SOLDIER_ATTACK
    this.speed = SoldierUnit.SOLDIER_SPEED
  }

  protected getColor(): number {
    return 0x4169E1 // Royal blue color for infantry
  }

  protected getSize(): number {
    return SoldierUnit.SOLDIER_SIZE
  }
}