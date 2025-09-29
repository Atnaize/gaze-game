import { GameConfig } from '../../config/GameConfig'

export interface SpriteMetadata {
  name: string
  folderPath: string
  animations: AnimationData[]
}

export interface AnimationData {
  name: string
  frames: string[]
  frameRate: number
  repeat: boolean
  frameCount?: number // Optional: specify exact frame count to avoid loading missing frames
}

export interface LoadedSprite {
  key: string
  metadata: SpriteMetadata
  loaded: boolean
}

export class SpriteLoader {
  private static instance: SpriteLoader
  private loadedSprites: Map<string, LoadedSprite> = new Map()
  private spriteMetadata: Map<string, SpriteMetadata> = new Map()

  static getInstance(): SpriteLoader {
    if (!SpriteLoader.instance) {
      SpriteLoader.instance = new SpriteLoader()
    }
    return SpriteLoader.instance
  }

  private constructor() {
    this.initializeSpriteMetadata()
  }

  private initializeSpriteMetadata(): void {
    const sprites: SpriteMetadata[] = [
      // Fantasy Creatures
      {
        name: 'Skeleton_Warrior_1',
        folderPath: 'Skeleton_Warrior_1',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Skeleton_Warrior_2',
        folderPath: 'Skeleton_Warrior_2',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Skeleton_Warrior_3',
        folderPath: 'Skeleton_Warrior_3',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Skeleton_Crusader_1',
        folderPath: 'Skeleton_Crusader_1',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Skeleton_Crusader_2',
        folderPath: 'Skeleton_Crusader_2',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Skeleton_Crusader_3',
        folderPath: 'Skeleton_Crusader_3',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Fallen_Angels_1',
        folderPath: 'Fallen_Angels_1',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Fallen_Angels_2',
        folderPath: 'Fallen_Angels_2',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Fallen_Angels_3',
        folderPath: 'Fallen_Angels_3',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Reaper_Man_1',
        folderPath: 'Reaper_Man_1',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Reaper_Man_2',
        folderPath: 'Reaper_Man_2',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Reaper_Man_3',
        folderPath: 'Reaper_Man_3',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Necromancer_of_the_Shadow_1',
        folderPath: 'Necromancer_of_the_Shadow_1',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Necromancer_of_the_Shadow_2',
        folderPath: 'Necromancer_of_the_Shadow_2',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Necromancer_of_the_Shadow_3',
        folderPath: 'Necromancer_of_the_Shadow_3',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Dark_Oracle_1',
        folderPath: 'Dark_Oracle_1',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Dark_Oracle_2',
        folderPath: 'Dark_Oracle_2',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Dark_Oracle_3',
        folderPath: 'Dark_Oracle_3',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Zombie_Villager_1',
        folderPath: 'Zombie_Villager_1',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Zombie_Villager_2',
        folderPath: 'Zombie_Villager_2',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Zombie_Villager_3',
        folderPath: 'Zombie_Villager_3',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Wraith_01',
        folderPath: 'Wraith_01',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Wraith_02',
        folderPath: 'Wraith_02',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Wraith_03',
        folderPath: 'Wraith_03',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Valkyrie_1',
        folderPath: 'Valkyrie_1',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Valkyrie_2',
        folderPath: 'Valkyrie_2',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Valkyrie_3',
        folderPath: 'Valkyrie_3',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Golem_1',
        folderPath: 'Golem_1',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Golem_2',
        folderPath: 'Golem_2',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Golem_3',
        folderPath: 'Golem_3',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Minotaur_1',
        folderPath: 'Minotaur_1',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Minotaur_2',
        folderPath: 'Minotaur_2',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Minotaur_3',
        folderPath: 'Minotaur_3',
        animations: this.getStandardAnimations()
      },
      // Goblin Types
      {
        name: 'Goblin',
        folderPath: 'Goblin',
        animations: this.getStandardAnimations()
      },
      // Classic Enemies
      {
        name: 'Ogre',
        folderPath: 'Ogre',
        animations: this.getStandardAnimations()
      },
      {
        name: 'Orc',
        folderPath: 'Orc',
        animations: this.getStandardAnimations()
      },
      // Soldier Sprites
      {
        name: 'Swordsman',
        folderPath: 'Swordsman',
        animations: this.getSwordsmanAnimations()
      }
    ]

    sprites.forEach(sprite => {
      this.spriteMetadata.set(sprite.name, sprite)
    })
  }

  private getStandardAnimations(): AnimationData[] {
    return [
      { name: 'Idle', frames: [], frameRate: GameConfig.SPRITE_IDLE_FRAME_RATE, repeat: true },
      { name: 'Walking', frames: [], frameRate: GameConfig.SPRITE_WALK_FRAME_RATE, repeat: true },
      { name: 'Running', frames: [], frameRate: GameConfig.SPRITE_RUN_FRAME_RATE, repeat: true },
      { name: 'Hurt', frames: [], frameRate: GameConfig.SPRITE_HURT_FRAME_RATE, repeat: false },
      { name: 'Dying', frames: [], frameRate: GameConfig.SPRITE_DEATH_FRAME_RATE, repeat: false },
      { name: 'Slashing', frames: [], frameRate: GameConfig.SPRITE_ATTACK_FRAME_RATE, repeat: true },
      { name: 'Throwing', frames: [], frameRate: GameConfig.SPRITE_ATTACK_FRAME_RATE, repeat: false }
    ]
  }

  private getSwordsmanAnimations(): AnimationData[] {
    // Swordsman frame counts: Idle=12, Walking=8, Hurt=5, Dying=8, Slashing=8
    return [
      { name: 'Idle', frames: [], frameRate: GameConfig.SPRITE_IDLE_FRAME_RATE, repeat: true, frameCount: 12 },
      { name: 'Walking', frames: [], frameRate: GameConfig.SPRITE_WALK_FRAME_RATE, repeat: true, frameCount: 8 },
      { name: 'Hurt', frames: [], frameRate: GameConfig.SPRITE_HURT_FRAME_RATE, repeat: false, frameCount: 5 },
      { name: 'Dying', frames: [], frameRate: GameConfig.SPRITE_DEATH_FRAME_RATE, repeat: false, frameCount: 8 },
      { name: 'Slashing', frames: [], frameRate: GameConfig.SPRITE_ATTACK_FRAME_RATE, repeat: true, frameCount: 8 }
    ]
  }


  async loadSprite(scene: Phaser.Scene, spriteKey: string): Promise<boolean> {
    const metadata = this.spriteMetadata.get(spriteKey)
    if (!metadata) {
      console.warn(`Sprite metadata not found for: ${spriteKey}`)
      return false
    }

    if (this.isLoaded(spriteKey)) {
      return true
    }

    try {
      await this.loadSpriteFrames(scene, metadata)
      this.createAnimations(scene, metadata)

      this.loadedSprites.set(spriteKey, {
        key: spriteKey,
        metadata,
        loaded: true
      })

      return true
    } catch (error) {
      console.error(`Failed to load sprite: ${spriteKey}`, error)
      return false
    }
  }

  private async loadSpriteFrames(scene: Phaser.Scene, metadata: SpriteMetadata): Promise<void> {
    const basePath = `sprites/${metadata.folderPath}`
    const spriteBaseName = this.getSpriteBaseName(metadata.name)

    // All sprites use standard structure: sprites/SpriteName/AnimationName/0_SpriteName_AnimationName_000.png
    for (const animation of metadata.animations) {
      const frames: string[] = []
      const animationPath = `${basePath}/${animation.name}`
      const fileNamePattern = `0_${spriteBaseName}_${animation.name}_{index}.png`

      // Load frames for this animation (use specified frameCount or default to 12)
      const maxFrames = animation.frameCount || 12
      for (let frameIndex = 0; frameIndex < maxFrames; frameIndex++) {
        const frameName = fileNamePattern.replace('{index}', frameIndex.toString().padStart(3, '0'))
        const framePath = `${animationPath}/${frameName}`
        const frameKey = `${metadata.name}_${animation.name}_${frameIndex}`

        // Queue the image for loading
        scene.load.image(frameKey, framePath)
        frames.push(frameKey)
      }

      animation.frames = frames
    }

    return new Promise((resolve) => {
      const completeHandler = () => {
        console.log(`Loaded sprite frames for: ${metadata.name}`)
        resolve()
      }

      const errorHandler = () => {
        // Suppress console noise for expected missing frames
        // Most sprites have 6-15 frames per animation, so 15-20 will fail
      }

      scene.load.once('complete', completeHandler)
      scene.load.on('loaderror', errorHandler)

      scene.load.start()
    })
  }

  private getSpriteBaseName(spriteName: string): string {
    // Handle special cases for different sprite folder structures
    if (spriteName.includes('Goblin')) {
      // Goblin sprites use standard naming: "0_Goblin_Idle_000.png"
      return 'Goblin'
    }

    // Convert sprite keys like "Skeleton_Warrior_1" to file names like "Skeleton_Warrior"
    const parts = spriteName.split('_')
    if (parts.length >= 3 && !isNaN(parseInt(parts[parts.length - 1]))) {
      // Remove the last number part
      return parts.slice(0, -1).join('_')
    }
    return spriteName
  }

  private createAnimations(scene: Phaser.Scene, metadata: SpriteMetadata): void {
    metadata.animations.forEach(animData => {
      // For individual frame sprites, filter out frames that failed to load
      const validFrames = animData.frames
        .filter(frameKey => {
          const texture = scene.textures.get(frameKey)
          return texture && texture.key !== '__MISSING'
        })
        .map(frameKey => ({ key: frameKey }))

      if (validFrames.length === 0) {
        console.warn(`No valid frames for animation: ${animData.name} in sprite: ${metadata.name}`)
        return
      }

      const animKey = `${metadata.name}_${animData.name}`

      if (scene.anims.exists(animKey)) {
        scene.anims.remove(animKey)
      }

      scene.anims.create({
        key: animKey,
        frames: validFrames,
        frameRate: animData.frameRate,
        repeat: animData.repeat ? -1 : 0
      })

      console.log(`Created animation: ${animKey} with ${validFrames.length} frames`)
    })
  }


  isLoaded(spriteKey: string): boolean {
    return this.loadedSprites.get(spriteKey)?.loaded || false
  }

  getMetadata(spriteKey: string): SpriteMetadata | undefined {
    return this.spriteMetadata.get(spriteKey)
  }

  getAllSpriteKeys(): string[] {
    return Array.from(this.spriteMetadata.keys())
  }

  getLoadedSprites(): LoadedSprite[] {
    return Array.from(this.loadedSprites.values())
  }

  async loadAllSprites(scene: Phaser.Scene): Promise<void> {
    const spriteKeys = this.getAllSpriteKeys()
    const loadPromises = spriteKeys.map(key => this.loadSprite(scene, key))
    await Promise.all(loadPromises)
  }
}