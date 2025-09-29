import { AbstractUnit } from './AbstractUnit'
import { Soldier, SoldierType, Position, Enemy } from '../../types/index'
import { GameConfig } from '../../config/GameConfig'
import { SpriteLoader } from '../loaders/SpriteLoader'
import { GameTimeManager } from '../managers/GameTimeManager'

export class SoldierUnit extends AbstractUnit implements Soldier {
  public type: SoldierType
  public faction: 'player' = 'player'
  private spriteKey?: string
  private direction: 'down' | 'left' | 'right' | 'up' = 'right' // Default facing right

  // Soldier Configuration
  static readonly SOLDIER_HEALTH = 100
  static readonly SOLDIER_ATTACK = 25
  static readonly SOLDIER_SPEED = 50
  static readonly SOLDIER_SIZE = 12
  static readonly SOLDIER_COLOR = 0x3498db

  private enemies: Enemy[] = []

  constructor(id: string, position: Position, type: SoldierType = 'infantry') {
    super(
      id,
      position,
      SoldierUnit.SOLDIER_HEALTH,
      SoldierUnit.SOLDIER_ATTACK,
      SoldierUnit.SOLDIER_SPEED
    )
    this.type = type
  }

  protected getColor(): number {
    return SoldierUnit.SOLDIER_COLOR
  }

  protected getSize(): number {
    return SoldierUnit.SOLDIER_SIZE
  }

  public setEnemies(enemies: Enemy[]): void {
    this.enemies = enemies
  }

  protected findTarget(): void {
    if (this.enemies.length === 0) return

    let closestEnemy: Enemy | undefined
    let closestDistance = Infinity

    for (const enemy of this.enemies) {
      if (enemy.state === 'dead') continue

      const dx = enemy.x - this.x
      const dy = enemy.y - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < closestDistance) {
        closestDistance = distance
        closestEnemy = enemy
      }
    }

    if (closestEnemy) {
      this.target = closestEnemy
      this.state = 'moving'
    }
  }

  public getTypeStats(): { health: number; attack: number; speed: number } {
    switch (this.type) {
      case 'infantry':
        return {
          health: SoldierUnit.SOLDIER_HEALTH,
          attack: SoldierUnit.SOLDIER_ATTACK,
          speed: SoldierUnit.SOLDIER_SPEED
        }
      case 'archer':
        return {
          health: SoldierUnit.SOLDIER_HEALTH * 0.8,
          attack: SoldierUnit.SOLDIER_ATTACK * 1.2,
          speed: SoldierUnit.SOLDIER_SPEED * 0.9
        }
      case 'cavalry':
        return {
          health: SoldierUnit.SOLDIER_HEALTH * 1.3,
          attack: SoldierUnit.SOLDIER_ATTACK * 1.1,
          speed: SoldierUnit.SOLDIER_SPEED * 1.5
        }
      default:
        return {
          health: SoldierUnit.SOLDIER_HEALTH,
          attack: SoldierUnit.SOLDIER_ATTACK,
          speed: SoldierUnit.SOLDIER_SPEED
        }
    }
  }

  public static createSoldier(
    id: string,
    position: Position,
    type: SoldierType = 'infantry'
  ): SoldierUnit {
    const soldier = new SoldierUnit(id, position, type)
    const stats = soldier.getTypeStats()

    soldier.health = stats.health
    soldier.maxHealth = stats.health
    soldier.attack = stats.attack
    soldier.speed = stats.speed

    return soldier
  }

  public async createAnimatedSprite(scene: Phaser.Scene): Promise<void> {
    const spriteLoader = SpriteLoader.getInstance()

    // Select a random Swordsman sprite
    const swordsmanSprites = ['Swordsman', 'Swordsman2', 'Swordsman3']
    const randomSprite = swordsmanSprites[Math.floor(Math.random() * swordsmanSprites.length)]

    // Load the sprite if not already loaded
    const loaded = await spriteLoader.loadSprite(scene, randomSprite)

    if (!loaded) {
      console.warn(`Failed to load soldier sprite: ${randomSprite}, falling back to basic sprite`)
      this.createSprite(scene)
      return
    }

    // Create animated sprite using the sprite sheet
    const spriteSheetKey = `${randomSprite}_Idle_sheet`

    console.log(`Creating soldier sprite with key: ${spriteSheetKey}`)
    console.log(`Available textures:`, Object.keys(scene.textures.list))

    // Check if the texture exists
    if (!scene.textures.exists(spriteSheetKey)) {
      console.error(`Sprite sheet texture not found: ${spriteSheetKey}`)
      this.createSprite(scene)
      return
    }

    this.animatedSprite = scene.add.sprite(this.x, this.y, spriteSheetKey, 0)
    this.animatedSprite.setScale(2) // Reasonable scale for 128x256 sprites
    this.animatedSprite.setDepth(10)

    // Store sprite reference for animation management
    this.spriteKey = randomSprite

    // Start with idle animation immediately (right direction by default)
    const animationKey = `${randomSprite}_Idle_${this.direction}`

    try {
      if (scene.anims.exists(animationKey)) {
        this.animatedSprite.play(animationKey)
        console.log(`Successfully started animation: ${animationKey}`)
      } else {
        // Fallback to default animation without direction
        const fallbackAnimationKey = `${randomSprite}_Idle`
        console.warn(`Animation ${animationKey} does not exist, trying fallback: ${fallbackAnimationKey}`)
        if (scene.anims.exists(fallbackAnimationKey)) {
          this.animatedSprite.play(fallbackAnimationKey)
          console.log(`Successfully started fallback animation: ${fallbackAnimationKey}`)
        } else {
          console.warn(`Fallback animation ${fallbackAnimationKey} does not exist, setting frame 0`)
          this.animatedSprite.setFrame(0)
        }
      }
    } catch (error) {
      console.error(`Failed to play initial animation for ${randomSprite}:`, error)
      console.log(`Falling back to frame 0`)
      this.animatedSprite.setFrame(0)
    }

    console.log(`Created animated soldier sprite: ${randomSprite} at (${this.x}, ${this.y})`)
  }

  private updateDirection(): void {
    if (!this.target) return

    const dx = this.target.x - this.x
    const dy = this.target.y - this.y

    // Determine direction based on movement (prioritize horizontal movement)
    if (Math.abs(dx) > Math.abs(dy)) {
      this.direction = dx > 0 ? 'right' : 'left'
    } else {
      this.direction = dy > 0 ? 'down' : 'up'
    }
  }

  public updateAnimation(): void {
    if (!this.animatedSprite || !this.spriteKey) return

    // Update direction based on target
    this.updateDirection()

    // Get pause state from GameTimeManager to avoid circular dependency
    const timeManager = GameTimeManager.getInstance()
    const isPaused = timeManager.isPaused_()

    let animationKey = ''

    // If game is paused, always use idle animation
    if (isPaused) {
      animationKey = `${this.spriteKey}_Idle_${this.direction}`
    } else {
      switch (this.state) {
        case 'idle':
          animationKey = `${this.spriteKey}_Idle_${this.direction}`
          break
        case 'moving':
          animationKey = `${this.spriteKey}_Walking_${this.direction}`
          break
        case 'attacking':
          animationKey = `${this.spriteKey}_Slashing_${this.direction}`
          break
        case 'hurt':
          animationKey = `${this.spriteKey}_Hurt_${this.direction}`
          break
        case 'dead':
          animationKey = `${this.spriteKey}_Dying_${this.direction}`
          break
        default:
          animationKey = `${this.spriteKey}_Idle_${this.direction}`
      }
    }

    // Only change animation if it's different from current
    if (this.animatedSprite.anims?.currentAnim?.key !== animationKey) {
      try {
        this.animatedSprite.play(animationKey)
      } catch (error) {
        // Fallback to default animation without direction
        const fallbackAnimationKey = animationKey.replace(`_${this.direction}`, '')
        console.warn(`Failed to play animation: ${animationKey}, trying fallback: ${fallbackAnimationKey}`)
        try {
          this.animatedSprite.play(fallbackAnimationKey)
        } catch (fallbackError) {
          console.warn(`Failed to play fallback animation: ${fallbackAnimationKey}`, fallbackError)
        }
      }
    }
  }


  public takeDamage(damage: number): void {
    this.health = Math.max(0, this.health - damage)
    this.updateUnitHealthBar(30, -25)

    if (this.health <= 0) {
      this.state = 'dead'
      if (this.animatedSprite) {
        this.animatedSprite.setAlpha(0.7)
        this.updateAnimation()
      }

      // Start fade-out animation after delay
      setTimeout(() => {
        this.startSoldierFadeOut()
      }, GameConfig.DEATH_FADE_DELAY)
    } else {
      this.state = 'hurt'
      setTimeout(() => {
        if (this.state === 'hurt' && this.health > 0) {
          this.state = 'idle'
        }
      }, 300)
    }
  }

  private startSoldierFadeOut(): void {
    if (this.state !== 'dead') return

    // Get the scene from the sprite or animatedSprite
    let scene: Phaser.Scene | undefined
    if (this.sprite && this.sprite.scene) {
      scene = this.sprite.scene
    } else if (this.animatedSprite && this.animatedSprite.scene) {
      scene = this.animatedSprite.scene
    }

    if (!scene || !scene.tweens) return

    // Fade out the main sprite if it exists
    if (this.sprite) {
      scene.tweens.add({
        targets: this.sprite,
        alpha: 0,
        duration: GameConfig.DEATH_FADE_DURATION,
        ease: 'Power2',
        onComplete: () => {
          this.destroy()
        }
      })
    }

    // Fade out animated sprite if it exists
    if (this.animatedSprite) {
      scene.tweens.add({
        targets: this.animatedSprite,
        alpha: 0,
        duration: GameConfig.DEATH_FADE_DURATION,
        ease: 'Power2',
        onComplete: () => {
          if (!this.sprite) { // Only destroy if main sprite doesn't exist
            this.destroy()
          }
        }
      })
    }

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
}