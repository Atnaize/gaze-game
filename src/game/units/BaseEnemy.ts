import { Enemy, EnemyType, Soldier, EnemyConfig } from '../../types'
import { GameConfig } from '../../config/GameConfig'
import { SpriteLoader } from '../loaders/SpriteLoader'
import { GameTimeManager } from '../managers/GameTimeManager'
import { UnitBehavior } from '../behaviors/UnitBehavior'
import { CombatBehavior } from '../behaviors/combat/CombatBehavior'
import { AttackWallBehavior } from '../behaviors/combat/AttackWallBehavior'

/**
 * BaseEnemy - Behavior System V2
 *
 * Enemies automatically switch between behaviors:
 * - Soldiers present → CombatBehavior (attack closest soldier)
 * - No soldiers → AttackWallBehavior (move to and attack wall)
 */
export abstract class BaseEnemy implements Enemy {
  public id: string
  public x: number
  public y: number
  public health: number
  public maxHealth: number
  public attack: number
  public speed: number
  public state: 'idle' | 'moving' | 'attacking' | 'dead' | 'hurt' = 'idle'
  public faction: 'enemy' = 'enemy' as const
  public reward: number
  public target?: Soldier
  public sprite?: Phaser.GameObjects.Sprite
  public healthBar?: Phaser.GameObjects.Graphics

  protected spriteLoader: SpriteLoader
  protected soldiers: Soldier[] = []
  protected nearbyEnemies: Enemy[] = []
  protected config: EnemyConfig
  protected currentAnimation = 'idle'
  protected scene?: Phaser.Scene
  protected lastAttackTime = 0
  protected currentBehavior: UnitBehavior | null = null
  private behaviorEntered = false

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

  /**
   * Get attack cooldown for this enemy
   * Uses config value if provided, otherwise defaults to GameConfig.ATTACK_COOLDOWN
   * @returns Attack cooldown in milliseconds
   */
  protected getAttackCooldown(): number {
    return this.config.attackCooldown ?? GameConfig.ATTACK_COOLDOWN
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

  setNearbyEnemies(enemies: Enemy[]): void {
    this.nearbyEnemies = enemies.filter(e => e.id !== this.id)
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

  /**
   * Behavior-driven update loop
   */
  update(deltaTime: number, gameSpeed: number): void {
    if (this.state === 'dead') return

    // Check if game is paused
    const timeManager = GameTimeManager.getInstance()
    if (timeManager.isPaused_()) {
      this.playAnimation('Idle')
      this.updatePosition()
      return
    }

    const adjustedDelta = deltaTime * gameSpeed

    // Select behavior if needed
    if (!this.currentBehavior) {
      this.selectBehavior()
      this.behaviorEntered = false
    }

    // Execute behavior
    const behavior = this.currentBehavior
    if (behavior) {
      if (!this.behaviorEntered) {
        behavior.onEnter?.(this)
        this.behaviorEntered = true
      }

      behavior.update(this, deltaTime)

      // Check if complete
      if (behavior.isComplete(this)) {
        behavior.onExit?.(this)
        this.currentBehavior = null
        this.behaviorEntered = false
        return
      }

      this.executeBehavior(adjustedDelta)
    }

    this.applySeparationForce()
    this.updatePosition()
  }

  /**
   * Select behavior based on game state
   */
  protected selectBehavior(): void {
    const aliveSoldiers = this.soldiers.filter(s => s.state !== 'dead')

    if (aliveSoldiers.length > 0) {
      // Attack closest soldier
      const closest = this.findClosestSoldier()
      if (closest) {
        this.currentBehavior = new CombatBehavior(closest)
        this.target = closest
        return
      }
    }

    // No soldiers - attack wall
    this.currentBehavior = new AttackWallBehavior()
    this.target = undefined
  }

  /**
   * Execute current behavior
   */
  protected executeBehavior(adjustedDelta: number): void {
    if (!this.currentBehavior) return

    // 1. Movement
    const destination = this.currentBehavior.getDestination(this)
    if (destination) {
      const dx = destination.x - this.x
      const dy = destination.y - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance > 1) {
        const speedMultiplier = this.currentBehavior.getSpeedMultiplier()
        const moveDistance = (this.speed * speedMultiplier * adjustedDelta) / 1000
        this.x += (dx / distance) * moveDistance
        this.y += (dy / distance) * moveDistance
      }
    }

    // 2. Combat
    if (this.currentBehavior.shouldAttack(this)) {
      const target = this.currentBehavior.getAttackTarget(this)
      if (target) {
        target.takeDamage(this.attack)
      } else {
        // AttackWallBehavior - emit wall damage
        if (this.scene) {
          this.scene.events.emit('wall_damaged', { damage: this.attack })
        }
      }
    }

    // 3. Animation
    const animState = this.currentBehavior.getAnimationState(this)
    this.state = animState

    // Map state to animation
    switch (animState) {
      case 'idle':
        this.playAnimation('Idle')
        break
      case 'moving':
        this.playAnimation('Running')
        break
      case 'attacking':
        this.playAnimation('Slashing')
        break
      case 'hurt':
        this.playAnimation('Hurt')
        break
    }
  }

  private applySeparationForce(): void {
    let separationX = 0
    let separationY = 0
    let nearbyCount = 0

    for (const enemy of this.nearbyEnemies) {
      if (enemy.state === 'dead') continue

      const dx = this.x - enemy.x
      const dy = this.y - enemy.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < GameConfig.UNIT_COLLISION_RADIUS && distance > 0) {
        // Push away from nearby unit
        const force = (GameConfig.UNIT_COLLISION_RADIUS - distance) / GameConfig.UNIT_COLLISION_RADIUS
        separationX += (dx / distance) * force
        separationY += (dy / distance) * force
        nearbyCount++
      }
    }

    if (nearbyCount > 0) {
      // Apply averaged separation force
      this.x += separationX * GameConfig.UNIT_SEPARATION_FORCE
      this.y += separationY * GameConfig.UNIT_SEPARATION_FORCE
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