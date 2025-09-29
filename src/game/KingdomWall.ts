import { KingdomWall as KingdomWallInterface } from '../types'
import { GameConfig } from '../config/GameConfig'

export class KingdomWall implements KingdomWallInterface {
  public currentHP: number
  public maxHP: number
  public sprite?: Phaser.GameObjects.Graphics
  public hpBar?: Phaser.GameObjects.Graphics
  public hpText?: Phaser.GameObjects.Text
  public isDestroyed: boolean = false

  private scene?: Phaser.Scene

  constructor() {
    this.maxHP = GameConfig.KINGDOM_WALL_MAX_HP
    this.currentHP = this.maxHP
  }

  createVisuals(scene: Phaser.Scene): void {
    this.scene = scene
    this.createWallSprite(scene)
    this.createHealthBar(scene)
    this.updateVisuals()
  }

  private createWallSprite(scene: Phaser.Scene): void {
    this.sprite = scene.add.graphics()
    this.drawWall()
  }

  private drawWall(): void {
    if (!this.sprite) return

    this.sprite.clear()

    const x = GameConfig.KINGDOM_WALL_X
    const y = GameConfig.KINGDOM_WALL_Y
    const width = GameConfig.KINGDOM_WALL_WIDTH
    const height = GameConfig.KINGDOM_WALL_HEIGHT

    const hpPercentage = this.currentHP / this.maxHP

    // Determine wall color based on damage
    let wallColor: number
    if (hpPercentage > GameConfig.WALL_DAMAGED_THRESHOLD) {
      wallColor = GameConfig.WALL_FULL_COLOR
    } else if (hpPercentage > GameConfig.WALL_CRITICAL_THRESHOLD) {
      wallColor = GameConfig.WALL_DAMAGED_COLOR
    } else {
      wallColor = GameConfig.WALL_CRITICAL_COLOR
    }

    // Draw main wall
    this.sprite.fillStyle(wallColor)
    this.sprite.fillRect(x, y, width, height)

    // Add border
    this.sprite.lineStyle(2, 0x000000)
    this.sprite.strokeRect(x, y, width, height)

    // Add damage cracks for damaged states
    if (hpPercentage <= GameConfig.WALL_DAMAGED_THRESHOLD) {
      this.drawCracks(hpPercentage)
    }

    // Add some wall details (stone blocks pattern)
    this.drawStonePattern()
  }

  private drawCracks(hpPercentage: number): void {
    if (!this.sprite) return

    const x = GameConfig.KINGDOM_WALL_X
    const y = GameConfig.KINGDOM_WALL_Y
    const width = GameConfig.KINGDOM_WALL_WIDTH
    const height = GameConfig.KINGDOM_WALL_HEIGHT

    this.sprite.lineStyle(1, GameConfig.WALL_CRACK_COLOR)

    // More cracks as HP decreases
    const numCracks = Math.floor((1 - hpPercentage) * 8)

    for (let i = 0; i < numCracks; i++) {
      const crackX = x + (Math.random() * width)
      const crackY = y + (Math.random() * height)
      const crackLength = 10 + Math.random() * 20

      // Draw crack lines
      this.sprite.moveTo(crackX, crackY)
      this.sprite.lineTo(crackX + (Math.random() - 0.5) * crackLength, crackY + crackLength)
    }
  }

  private drawStonePattern(): void {
    if (!this.sprite) return

    const x = GameConfig.KINGDOM_WALL_X
    const y = GameConfig.KINGDOM_WALL_Y
    const width = GameConfig.KINGDOM_WALL_WIDTH
    const height = GameConfig.KINGDOM_WALL_HEIGHT

    this.sprite.lineStyle(1, 0x000000, 0.3)

    // Draw horizontal lines for stone blocks
    for (let blockY = y + 20; blockY < y + height; blockY += 40) {
      this.sprite.moveTo(x, blockY)
      this.sprite.lineTo(x + width, blockY)
    }

    // Draw vertical lines (offset every other row)
    for (let blockY = y; blockY < y + height; blockY += 40) {
      const offset = (Math.floor(blockY / 40) % 2) * 10
      for (let blockX = x + offset; blockX < x + width; blockX += 20) {
        this.sprite.moveTo(blockX, blockY)
        this.sprite.lineTo(blockX, Math.min(blockY + 40, y + height))
      }
    }
  }

  private createHealthBar(scene: Phaser.Scene): void {
    this.hpBar = scene.add.graphics()
    this.hpText = scene.add.text(
      GameConfig.KINGDOM_WALL_X + GameConfig.KINGDOM_WALL_WIDTH + 10,
      GameConfig.KINGDOM_WALL_Y - 20,
      '',
      {
        fontSize: '14px',
        color: '#ffffff',
        fontFamily: 'Arial'
      }
    )
    this.updateHealthBar()
  }

  private updateHealthBar(): void {
    if (!this.hpBar || !this.hpText) return

    this.hpBar.clear()

    const barX = GameConfig.KINGDOM_WALL_X + GameConfig.KINGDOM_WALL_WIDTH + 10
    const barY = GameConfig.KINGDOM_WALL_Y
    const barWidth = 100
    const barHeight = 8

    const hpPercentage = this.currentHP / this.maxHP

    // Background
    this.hpBar.fillStyle(0x000000, 0.8)
    this.hpBar.fillRect(barX, barY, barWidth, barHeight)

    // Health bar
    const healthColor = hpPercentage > 0.5 ? 0x00ff00 :
                       hpPercentage > 0.25 ? 0xffff00 : 0xff0000
    this.hpBar.fillStyle(healthColor)
    this.hpBar.fillRect(barX, barY, barWidth * hpPercentage, barHeight)

    // Border
    this.hpBar.lineStyle(1, 0xffffff)
    this.hpBar.strokeRect(barX, barY, barWidth, barHeight)

    // Update text
    this.hpText.setText(`Wall: ${Math.round(this.currentHP)}/${Math.round(this.maxHP)}`)
    this.hpText.setPosition(barX, barY - 20)
  }

  takeDamage(damage: number): void {
    if (this.isDestroyed) return

    this.currentHP = Math.max(0, this.currentHP - damage)

    if (this.currentHP <= 0) {
      this.isDestroyed = true
    }

    this.updateVisuals()
  }

  private updateVisuals(): void {
    this.drawWall()
    this.updateHealthBar()
  }

  repair(amount: number): void {
    if (this.isDestroyed) return

    this.currentHP = Math.min(this.maxHP, this.currentHP + amount)
    this.updateVisuals()
  }

  getHPPercentage(): number {
    return this.currentHP / this.maxHP
  }

  destroy(): void {
    if (this.sprite) {
      this.sprite.destroy()
      this.sprite = undefined
    }
    if (this.hpBar) {
      this.hpBar.destroy()
      this.hpBar = undefined
    }
    if (this.hpText) {
      this.hpText.destroy()
      this.hpText = undefined
    }
  }
}