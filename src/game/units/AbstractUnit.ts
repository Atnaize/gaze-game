import { Unit, UnitState, Position } from '../../types/index'
import { GameConfig } from '../../config/GameConfig'
import { GameTimeManager } from '../managers/GameTimeManager'
import { UnitBehavior } from '../behaviors/UnitBehavior'

export abstract class AbstractUnit implements Unit {
  public id: string
  public x: number
  public y: number
  public health: number
  public maxHealth: number
  public attack: number
  public speed: number
  public state: UnitState
  public target?: Unit
  public sprite?: Phaser.GameObjects.Graphics | Phaser.GameObjects.Sprite
  public healthBar?: Phaser.GameObjects.Graphics
  public animatedSprite?: Phaser.GameObjects.Sprite

  protected currentBehavior: UnitBehavior | null = null
  protected lastAttackTime = 0
  private behaviorEntered = false

  constructor(
    id: string,
    position: Position,
    health: number,
    attack: number,
    speed: number
  ) {
    this.id = id
    this.x = position.x
    this.y = position.y
    this.health = health
    this.maxHealth = health
    this.attack = attack
    this.speed = speed
    this.state = 'idle'
  }

  /**
   * Override this method in subclasses to customize attack cooldown
   * @returns Attack cooldown in milliseconds
   */
  protected getAttackCooldown(): number {
    return GameConfig.ATTACK_COOLDOWN
  }

  protected abstract getColor(): number
  protected abstract getSize(): number

  public createSprite(scene: Phaser.Scene): void {
    if (!scene.add) return

    this.sprite = scene.add.graphics()
    this.drawSprite()
    this.createHealthBar(scene)
  }

  protected drawSprite(tint?: number): void {
    if (!this.sprite) return

    if (this.sprite instanceof Phaser.GameObjects.Graphics) {
      this.sprite.clear()
      const size = this.getSize()
      const color = tint || this.getColor()

      this.sprite.fillStyle(color)
      this.sprite.lineStyle(2, 0x000000)
      this.sprite.fillRect(-size / 2, -size / 2, size, size)
      this.sprite.strokeRect(-size / 2, -size / 2, size, size)
      this.sprite.setPosition(this.x, this.y)
    } else if (tint && this.sprite instanceof Phaser.GameObjects.Sprite) {
      this.sprite.setTint(tint)
      setTimeout(() => {
        if (this.sprite instanceof Phaser.GameObjects.Sprite) {
          this.sprite.clearTint()
        }
      }, 200)
    }
  }

  private createHealthBar(scene: Phaser.Scene): void {
    if (!scene.add) return

    this.healthBar = scene.add.graphics()
    this.updateHealthBar()
  }

  private updateHealthBar(): void {
    if (!this.healthBar) return

    this.healthBar.clear()

    const barWidth = this.getSize()
    const barHeight = 4
    const healthPercentage = this.health / this.maxHealth

    // Background
    this.healthBar.fillStyle(0x000000, 0.8)
    this.healthBar.fillRect(
      this.x - barWidth / 2,
      this.y - this.getSize() / 2 - 8,
      barWidth,
      barHeight
    )

    // Health bar
    const healthColor = healthPercentage > 0.5 ? 0x00ff00 :
                       healthPercentage > 0.25 ? 0xffff00 : 0xff0000
    this.healthBar.fillStyle(healthColor)
    this.healthBar.fillRect(
      this.x - barWidth / 2,
      this.y - this.getSize() / 2 - 8,
      barWidth * healthPercentage,
      barHeight
    )
  }

  /**
   * Main update loop - Behavior System V2
   * Units are now behavior-driven for clean separation of concerns
   */
  public update(deltaTime: number, gameSpeed: number): void {
    if (this.state === 'dead') return

    const adjustedDelta = deltaTime * gameSpeed

    // If no behavior, select one
    if (!this.currentBehavior) {
      this.selectBehavior()
      this.behaviorEntered = false
    }

    // Execute behavior if we have one
    const behavior = this.currentBehavior
    if (behavior) {
      // Call onEnter if just selected
      if (!this.behaviorEntered) {
        behavior.onEnter?.(this)
        this.behaviorEntered = true
      }

      // Update behavior state
      behavior.update(this, deltaTime)

      // Check if complete
      if (behavior.isComplete(this)) {
        behavior.onExit?.(this)
        this.currentBehavior = null
        this.behaviorEntered = false
        return // Will select new behavior next frame
      }

      // Execute behavior
      this.executeBehavior(adjustedDelta)
    }

    // Update visuals
    this.updateVisuals()
  }

  /**
   * Execute the current behavior's instructions
   */
  protected executeBehavior(adjustedDelta: number): void {
    if (!this.currentBehavior) return

    // 1. Movement
    const destination = this.currentBehavior.getDestination(this)
    if (destination) {
      this.moveToward(destination, adjustedDelta)
    }

    // 2. Combat
    if (this.currentBehavior.shouldAttack(this)) {
      const target = this.currentBehavior.getAttackTarget(this)
      if (target) {
        this.performAttack(target)
      } else {
        // Special case: AttackWallBehavior (enemy attacking wall)
        this.attackWall()
      }
    }

    // 3. Animation state (behavior controls what animation plays)
    this.state = this.currentBehavior.getAnimationState(this)
  }

  /**
   * Move unit toward a destination
   */
  protected moveToward(destination: Position, adjustedDelta: number): void {
    const dx = destination.x - this.x
    const dy = destination.y - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 1) {
      const speedMultiplier = this.currentBehavior?.getSpeedMultiplier() || 1.0
      const effectiveSpeed = this.speed * speedMultiplier
      const moveDistance = (effectiveSpeed * adjustedDelta) / 1000

      const moveX = (dx / distance) * moveDistance
      const moveY = (dy / distance) * moveDistance

      this.x += moveX
      this.y += moveY
    }
  }

  /**
   * Attack a unit target
   */
  protected performAttack(target: Unit): void {
    target.takeDamage(this.attack)

    // Visual attack effect
    if (this.sprite) {
      this.drawSprite(0xffff00)
      setTimeout(() => {
        if (this.sprite) this.drawSprite()
      }, 100)
    }
  }

  /**
   * Attack the kingdom wall (for enemies)
   * Subclasses can override this
   */
  protected attackWall(): void {
    // Default: do nothing (only enemies attack walls)
  }

  /**
   * Subclasses must implement behavior selection logic
   * This is called when currentBehavior is null
   */
  protected abstract selectBehavior(): void

  /**
   * @deprecated Use selectBehavior() instead
   * Kept for backward compatibility during migration
   */
  protected findTarget(): void {
    // Default implementation calls selectBehavior
    this.selectBehavior()
  }

  public takeDamage(damage: number): void {
    this.health = Math.max(0, this.health - damage)
    this.updateHealthBar()

    if (this.health <= 0) {
      this.die()
    }

    // Visual damage effect
    if (this.sprite) {
      this.drawSprite(0xff0000)
      setTimeout(() => {
        if (this.sprite && this.state !== 'dead') {
          this.drawSprite()
        }
      }, 200)
    }
  }

  private die(): void {
    this.state = 'dead'
    if (this.sprite) {
      if (this.sprite instanceof Phaser.GameObjects.Graphics) {
        this.drawSprite(0x666666)
        this.sprite.setAlpha(0.5)
      } else if (this.sprite instanceof Phaser.GameObjects.Sprite) {
        this.sprite.setTint(0x666666)
        this.sprite.setAlpha(0.5)
      }
    }

    // Start fade-out animation after delay
    setTimeout(() => {
      this.startFadeOut()
    }, GameConfig.DEATH_FADE_DELAY)
  }

  private startFadeOut(): void {
    if (!this.sprite || this.state !== 'dead') return

    const scene = this.sprite.scene
    if (!scene || !scene.tweens) return

    // Fade out the sprite
    scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      duration: GameConfig.DEATH_FADE_DURATION,
      ease: 'Power2',
      onComplete: () => {
        this.destroy()
      }
    })

    // Also fade out health bar if it exists
    if (this.healthBar) {
      scene.tweens.add({
        targets: this.healthBar,
        alpha: 0,
        duration: GameConfig.DEATH_FADE_DURATION,
        ease: 'Power2'
      })
    }

    // Fade out animated sprite if it exists
    if (this.animatedSprite) {
      scene.tweens.add({
        targets: this.animatedSprite,
        alpha: 0,
        duration: GameConfig.DEATH_FADE_DURATION,
        ease: 'Power2'
      })
    }
  }

  private updateVisuals(): void {
    if (this.sprite) {
      this.sprite.setPosition(this.x, this.y)
    }
    if (this.animatedSprite) {
      this.animatedSprite.setPosition(this.x, this.y)
    }
    this.updateHealthBar()
    this.updateAnimation()
  }

  // Base method for animated sprites - can be overridden
  public createAnimatedSprite(scene: Phaser.Scene): void {
    this.createSprite(scene)
  }

  // Base method for animation updates - can be overridden
  public updateAnimation(): void {
    // Default: no animation
  }

  // Shared method for creating health bars with proper sizing
  protected createUnitHealthBar(scene: Phaser.Scene, barWidth: number = this.getSize()): void {
    if (!scene.add) return

    this.healthBar = scene.add.graphics()
    this.updateUnitHealthBar(barWidth)
  }

  protected updateUnitHealthBar(barWidth: number = this.getSize(), yOffset: number = -8): void {
    if (!this.healthBar) return

    this.healthBar.clear()
    const barHeight = 4
    const healthPercentage = this.health / this.maxHealth

    // Background
    this.healthBar.fillStyle(0x000000, 0.8)
    this.healthBar.fillRect(
      this.x - barWidth / 2,
      this.y - this.getSize() / 2 + yOffset,
      barWidth,
      barHeight
    )

    // Health bar
    const healthColor = healthPercentage > 0.5 ? 0x00ff00 :
                       healthPercentage > 0.25 ? 0xffff00 : 0xff0000
    this.healthBar.fillStyle(healthColor)
    this.healthBar.fillRect(
      this.x - barWidth / 2,
      this.y - this.getSize() / 2 + yOffset,
      barWidth * healthPercentage,
      barHeight
    )
  }

  public destroy(): void {
    if (this.sprite) {
      this.sprite.destroy()
      this.sprite = undefined
    }
    if (this.animatedSprite) {
      this.animatedSprite.destroy()
      this.animatedSprite = undefined
    }
    if (this.healthBar) {
      this.healthBar.destroy()
      this.healthBar = undefined
    }
  }
}