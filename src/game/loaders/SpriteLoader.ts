import { GameConfig } from '../../config/GameConfig'

export interface SpriteMetadata {
  name: string
  folderPath: string
  animations: AnimationData[]
  spriteType?: 'individual' | 'spritesheet'
}

export interface AnimationData {
  name: string
  frames: string[]
  frameRate: number
  repeat: boolean
  spriteSheetConfig?: {
    frameWidth: number
    frameHeight: number
    frameCount: number
    fileName: string
  }
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
      // Soldier Sprites (Sprite Sheets)
      {
        name: 'Swordsman',
        folderPath: 'Swordsman',
        spriteType: 'spritesheet',
        animations: this.getSwordsmanAnimations()
      },
      {
        name: 'Swordsman2',
        folderPath: 'Swordsman2',
        spriteType: 'spritesheet',
        animations: this.getSwordsmanAnimations()
      },
      {
        name: 'Swordsman3',
        folderPath: 'Swordsman3',
        spriteType: 'spritesheet',
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
    return [
      {
        name: 'Idle',
        frames: [],
        frameRate: GameConfig.SPRITE_IDLE_FRAME_RATE,
        repeat: true,
        spriteSheetConfig: {
          frameWidth: 128,
          frameHeight: 64, // 256px / 4 rows = 64px per row
          frameCount: 12, // 12 columns as described
          fileName: 'idle.png'
        }
      },
      {
        name: 'Walking',
        frames: [],
        frameRate: GameConfig.SPRITE_WALK_FRAME_RATE,
        repeat: true,
        spriteSheetConfig: {
          frameWidth: 128,
          frameHeight: 64, // 256px / 4 rows = 64px per row
          frameCount: 6, // 6 columns per row
          fileName: 'walk.png'
        }
      },
      {
        name: 'Running',
        frames: [],
        frameRate: GameConfig.SPRITE_RUN_FRAME_RATE,
        repeat: true,
        spriteSheetConfig: {
          frameWidth: 128,
          frameHeight: 64, // 256px / 4 rows = 64px per row
          frameCount: 8, // 8 columns per row
          fileName: 'run.png'
        }
      },
      {
        name: 'Hurt',
        frames: [],
        frameRate: GameConfig.SPRITE_HURT_FRAME_RATE,
        repeat: false,
        spriteSheetConfig: {
          frameWidth: 128,
          frameHeight: 64, // 256px / 4 rows = 64px per row
          frameCount: 6, // 6 columns per row
          fileName: 'hurt.png'
        }
      },
      {
        name: 'Dying',
        frames: [],
        frameRate: GameConfig.SPRITE_DEATH_FRAME_RATE,
        repeat: false,
        spriteSheetConfig: {
          frameWidth: 128,
          frameHeight: 64, // 256px / 4 rows = 64px per row
          frameCount: 8, // 8 columns per row
          fileName: 'death.png'
        }
      },
      {
        name: 'Slashing',
        frames: [],
        frameRate: GameConfig.SPRITE_ATTACK_FRAME_RATE,
        repeat: true,
        spriteSheetConfig: {
          frameWidth: 128,
          frameHeight: 64, // 256px / 4 rows = 64px per row
          frameCount: 8, // 8 columns per row
          fileName: 'attack.png'
        }
      }
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
      if (metadata.spriteType === 'spritesheet') {
        await this.loadSpriteSheets(scene, metadata)
      } else {
        await this.loadSpriteFrames(scene, metadata)
      }
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

  private async loadSpriteSheets(scene: Phaser.Scene, metadata: SpriteMetadata): Promise<void> {
    const basePath = `sprites/${metadata.folderPath}`

    // Load sprite sheets for each animation
    for (const animation of metadata.animations) {
      if (!animation.spriteSheetConfig) continue

      const spriteSheetPath = `${basePath}/${animation.spriteSheetConfig.fileName}`
      const spriteSheetKey = `${metadata.name}_${animation.name}_sheet`

      // Load the sprite sheet with 4 rows of frames
      scene.load.spritesheet(spriteSheetKey, spriteSheetPath, {
        frameWidth: animation.spriteSheetConfig.frameWidth,
        frameHeight: animation.spriteSheetConfig.frameHeight,
        endFrame: (animation.spriteSheetConfig.frameCount * 4) - 1 // 4 rows
      })

      // Generate frame keys for all frames in all 4 rows
      const frames: string[] = []
      for (let i = 0; i < animation.spriteSheetConfig.frameCount * 4; i++) {
        frames.push(`${spriteSheetKey}:${i}`)
      }
      animation.frames = frames
    }

    return new Promise((resolve) => {
      const completeHandler = () => {
        console.log(`Loaded sprite sheets for: ${metadata.name}`)
        resolve()
      }

      scene.load.once('complete', completeHandler)
      scene.load.start()
    })
  }

  private async loadSpriteFrames(scene: Phaser.Scene, metadata: SpriteMetadata): Promise<void> {
    const basePath = `sprites/${metadata.folderPath}`
    const spriteBaseName = this.getSpriteBaseName(metadata.name)

    // Handle different sprite structures
    for (const animation of metadata.animations) {
      const frames: string[] = []

      // All sprites now use the standard structure: sprites/SpriteName/AnimationName/
      const animationPath = `${basePath}/${animation.name}`
      const fileNamePattern = `0_${spriteBaseName}_${animation.name}_{index}.png`

      // Load frames for this animation
      for (let frameIndex = 0; frameIndex < 12; frameIndex++) {
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
      if (metadata.spriteType === 'spritesheet') {
        // For sprite sheets with 4 rows (down, left, right, up), create directional animations
        const directions = ['down', 'left', 'right', 'up'] // Row 0, 1, 2, 3
        const frameCount = animData.spriteSheetConfig?.frameCount || 0
        const [textureKey] = animData.frames[0].split(':') // Get the texture key

        directions.forEach((direction, dirIndex) => {
          const validFrames: any[] = []

          // Calculate frame indices for this direction row
          // Each row has frameCount frames, so row 0 = 0-11, row 1 = 12-23, etc.
          const startFrame = dirIndex * frameCount
          for (let frameIdx = 0; frameIdx < frameCount; frameIdx++) {
            const frameIndex = startFrame + frameIdx
            validFrames.push({ key: textureKey, frame: frameIndex })
          }

          if (validFrames.length === 0) {
            console.warn(`No valid frames for animation: ${animData.name}_${direction} in sprite: ${metadata.name}`)
            return
          }

          const dirAnimKey = `${metadata.name}_${animData.name}_${direction}`
          if (scene.anims.exists(dirAnimKey)) {
            scene.anims.remove(dirAnimKey)
          }

          scene.anims.create({
            key: dirAnimKey,
            frames: validFrames,
            frameRate: animData.frameRate,
            repeat: animData.repeat ? -1 : 0
          })

          console.log(`Created directional animation: ${dirAnimKey} with ${validFrames.length} frames (frames ${startFrame}-${startFrame + frameCount - 1})`)
        })

        // Create default animation (right direction - row 2)
        const defaultFrames: any[] = []
        const rightRowStartFrame = 2 * frameCount // Row 2 (right direction)
        for (let frameIdx = 0; frameIdx < frameCount; frameIdx++) {
          const frameIndex = rightRowStartFrame + frameIdx
          defaultFrames.push({ key: textureKey, frame: frameIndex })
        }

        const animKey = `${metadata.name}_${animData.name}`
        if (scene.anims.exists(animKey)) {
          scene.anims.remove(animKey)
        }

        scene.anims.create({
          key: animKey,
          frames: defaultFrames,
          frameRate: animData.frameRate,
          repeat: animData.repeat ? -1 : 0
        })

        console.log(`Created default animation: ${animKey} with ${defaultFrames.length} frames (right direction)`)
      } else {
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
      }
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