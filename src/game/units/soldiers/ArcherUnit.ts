import { SoldierUnit } from '../SoldierUnit'
import { Position } from '../../../types/index'

export class ArcherUnit extends SoldierUnit {
  constructor(id: string, position: Position) {
    super(id, position, 'archer')

    // Archer-specific stats
    this.health = SoldierUnit.SOLDIER_HEALTH * 0.8
    this.maxHealth = this.health
    this.attack = SoldierUnit.SOLDIER_ATTACK * 1.2
    this.speed = SoldierUnit.SOLDIER_SPEED * 0.9
  }

  protected getColor(): number {
    return 0x32CD32 // Lime green color for archers
  }

  protected getSize(): number {
    return SoldierUnit.SOLDIER_SIZE * 0.9 // Slightly smaller
  }
}