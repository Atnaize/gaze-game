import { Enemy, EnemyType, Soldier, EnemyConfig } from '../../types'
import { GameConfig } from '../../config/GameConfig'
import { SpriteLoader } from '../loaders/SpriteLoader'
import { GameTimeManager } from '../managers/GameTimeManager'

export abstract class BaseEnemy implements Enemy {
  public id: string
  public x: number
  public y: number
  public health: number
  public maxHealth: number
  public attack: number
  public speed: number
  public state: 'idle' | 'moving' | 'attacking' | 'dead' | 'hurt' = 'idle'
  public faction: 'enemy' = 'enemy'
  public reward: number
  public target?: Soldier
  public sprite?: Phaser.GameObjects.Sprite
  public healthBar?: Phaser.GameObjects.Graphics

  protected spriteLoader: SpriteLoader
  protected soldiers: Soldier[] = []
  protected config: EnemyConfig
  protected currentAnimation = 'idle'
  protected scene?: Phaser.Scene

  constructor(config: EnemyConfig, x: number = 0, y: number = 0) {
    this.id = `${config.type}_${Date.now()}_${Math.random()}`
    this.x = x
    this.y = y
    this.config = config
    this.spriteLoader = SpriteLoader.getInstance()

    // Apply configuration with multipliers
    this.maxHealth = config.health * GameConfig.ENEMY_HEALTH_MULTIPLIER
    this.health = this.maxHealth
    this.attack = config.attack * GameConfig.ENEMY_ATTACK_MULTIPLIER
    this.speed = config.speed * GameConfig.ENEMY_SPEED_MULTIPLIER
    this.reward = config.reward * GameConfig.ENEMY_REWARD_MULTIPLIER
  }

  get type(): EnemyType {
    return this.config.type
  }

  get spriteKey(): string {
    return this.config.spriteKey
  }

  get description(): string {
    return this.config.description
  }

  async createSprite(scene: Phaser.Scene): Promise<void> {
    this.scene = scene

    try {
      // Ensure sprite is loaded
      await this.spriteLoader.loadSprite(scene, this.spriteKey)

      // Get the first frame of idle animation as the default sprite
      const metadata = this.spriteLoader.getMetadata(this.spriteKey)
      if (!metadata) {
        console.warn(`No metadata found for sprite: ${this.spriteKey}`)
        this.createFallbackSprite(scene)
        return
      }

      const idleAnimation = metadata.animations.find(anim => anim.name === 'Idle')
      if (!idleAnimation || idleAnimation.frames.length === 0) {
        console.warn(`No idle animation found for sprite: ${this.spriteKey}`)
        this.createFallbackSprite(scene)
        return
      }

      // Find the first valid frame
      let firstValidFrame = null
      for (const frameKey of idleAnimation.frames) {
        const texture = scene.textures.get(frameKey)
        if (texture && texture.key !== '__MISSING') {
          firstValidFrame = frameKey
          break
        }
      }

      if (!firstValidFrame) {
        console.warn(`No valid frames found for idle animation in sprite: ${this.spriteKey}`)
        this.createFallbackSprite(scene)
        return
      }

      this.sprite = scene.add.sprite(this.x, this.y, firstValidFrame)
      this.sprite.setScale(GameConfig.ENEMY_SPRITE_SCALE)
      this.sprite.setFlipX(true)
      this.sprite.setDepth(10)

      // Start with idle animation
      this.playAnimation('Idle')

      this.createHealthBar(scene)
    } catch (error) {
      console.error(`Failed to create sprite for ${this.spriteKey}:`, error)
      this.createFallbackSprite(scene)
    }
  }

  createAnimatedSprite(scene: Phaser.Scene): void {
    this.createSprite(scene)
  }

  private createFallbackSprite(scene: Phaser.Scene): void {
    // Create a simple colored rectangle as fallback
    const graphics = scene.add.graphics()
    graphics.fillStyle(0xff0000)
    graphics.fillRect(0, 0, 32, 32)
    graphics.generateTexture('fallback_enemy', 32, 32)
    graphics.destroy()

    this.sprite = scene.add.sprite(this.x, this.y, 'fallback_enemy')
    this.sprite.setScale(GameConfig.ENEMY_SPRITE_SCALE)
    this.sprite.setDepth(10)
    this.createHealthBar(scene)
  }

  private createHealthBar(scene: Phaser.Scene): void {
    if (!this.sprite) return

    this.healthBar = scene.add.graphics()
    this.healthBar.setDepth(15)
    this.updateHealthBar()
  }

  private updateHealthBar(): void {
    if (!this.healthBar || !this.sprite) return

    this.healthBar.clear()

    const barWidth = 40
    const barHeight = 4
    const barX = this.sprite.x - barWidth / 2
    const barY = this.sprite.y - this.sprite.height * this.sprite.scaleY / 2 - 8

    // Background
    this.healthBar.fillStyle(0x000000, 0.7)
    this.healthBar.fillRect(barX, barY, barWidth, barHeight)

    // Health bar
    const healthPercentage = this.health / this.maxHealth
    const healthColor = healthPercentage > 0.5 ? 0x00ff00 : healthPercentage > 0.25 ? 0xffff00 : 0xff0000
    this.healthBar.fillStyle(healthColor)
    this.healthBar.fillRect(barX, barY, barWidth * healthPercentage, barHeight)
  }

  playAnimation(animationName: string): void {
    if (!this.sprite || !this.scene) return

    const animKey = `${this.spriteKey}_${animationName}`

    try {
      if (this.scene.anims.exists(animKey)) {
        // For continuous actions like attacking or running, restart the animation if it's not playing
        if (this.currentAnimation !== animationName || !this.sprite.anims.isPlaying) {
          this.sprite.play(animKey)
          this.currentAnimation = animationName
        }
      } else {
        console.warn(`Animation ${animKey} does not exist for enemy ${this.id}`)
      }
    } catch (error) {
      console.warn(`Failed to play animation ${animKey}:`, error)
    }
  }

  setSoldiers(soldiers: Soldier[]): void {
    this.soldiers = soldiers
  }

  takeDamage(damage: number): void {
    if (this.state === 'dead') return

    this.health -= damage
    this.updateHealthBar()

    if (this.health <= 0) {
      this.health = 0
      this.state = 'dead'
      this.playAnimation('Dying')

      // Start fade-out animation after delay
      setTimeout(() => {
        this.startFadeOut()
      }, GameConfig.DEATH_FADE_DELAY)
    } else {
      this.state = 'hurt'
      this.playAnimation('Hurt')
      // Return to previous state after hurt animation
      setTimeout(() => {
        if (this.state === 'hurt') {
          this.state = 'idle'
          this.playAnimation('Idle')
        }
      }, 500)
    }
  }

  update(deltaTime: number, gameSpeed: number): void {
    if (this.state === 'dead') return

    // Check if game is paused and force idle animation
    const timeManager = GameTimeManager.getInstance()
    if (timeManager.isPaused_()) {
      this.playAnimation('Idle')
      this.updatePosition() // Still update visual position
      return
    }

    this.updateMovement(deltaTime, gameSpeed)
    this.updateCombat()
    this.updatePosition()
  }

  private updateMovement(deltaTime: number, gameSpeed: number): void {
    if (this.state === 'hurt') return

    const closestSoldier = this.findClosestSoldier()
    if (closestSoldier) {
      this.target = closestSoldier
      const distance = Phaser.Math.Distance.Between(this.x, this.y, closestSoldier.x, closestSoldier.y)

      if (distance > GameConfig.ATTACK_RANGE) {
        this.state = 'moving'
        this.playAnimation('Running')

        const angle = Phaser.Math.Angle.Between(this.x, this.y, closestSoldier.x, closestSoldier.y)
        this.x += Math.cos(angle) * this.speed * deltaTime * gameSpeed / 1000
        this.y += Math.sin(angle) * this.speed * deltaTime * gameSpeed / 1000
      } else {
        this.state = 'attacking'
        this.playAnimation('Slashing')
      }
    } else {
      // No soldiers - move toward the kingdom wall
      this.moveTowardWall(deltaTime, gameSpeed)
    }
  }

  private moveTowardWall(deltaTime: number, gameSpeed: number): void {
    const wallX = GameConfig.KINGDOM_WALL_X + GameConfig.KINGDOM_WALL_WIDTH
    const wallY = GameConfig.KINGDOM_WALL_Y + GameConfig.KINGDOM_WALL_HEIGHT / 2

    const distanceToWall = Phaser.Math.Distance.Between(this.x, this.y, wallX, wallY)

    if (distanceToWall > GameConfig.ATTACK_RANGE) {
      this.state = 'moving'
      this.playAnimation('Running')

      const angle = Phaser.Math.Angle.Between(this.x, this.y, wallX, wallY)
      this.x += Math.cos(angle) * this.speed * deltaTime * gameSpeed / 1000
      this.y += Math.sin(angle) * this.speed * deltaTime * gameSpeed / 1000
    } else {
      this.state = 'attacking'
      this.playAnimation('Slashing')
    }
  }

  private updateCombat(): void {
    if (this.state !== 'attacking' || !this.target) return

    const distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y)
    if (distance <= GameConfig.ATTACK_RANGE) {
      this.target.takeDamage(this.attack)
    }
  }

  private updatePosition(): void {
    if (this.sprite) {
      this.sprite.x = this.x
      this.sprite.y = this.y
    }

    if (this.healthBar) {
      this.updateHealthBar()
    }
  }

  private findClosestSoldier(): Soldier | undefined {
    if (this.soldiers.length === 0) return undefined

    let closest: Soldier | undefined
    let minDistance = Infinity

    for (const soldier of this.soldiers) {
      if (soldier.state === 'dead') continue

      const distance = Phaser.Math.Distance.Between(this.x, this.y, soldier.x, soldier.y)
      if (distance < minDistance) {
        minDistance = distance
        closest = soldier
      }
    }

    return closest
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
  }

  destroy(): void {
    if (this.sprite) {
      this.sprite.destroy()
      this.sprite = undefined
    }

    if (this.healthBar) {
      this.healthBar.destroy()
      this.healthBar = undefined
    }

    this.scene = undefined
  }
}