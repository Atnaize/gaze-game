import React, { useEffect, useRef, useCallback } from 'react'
import { GameConfig } from '../config/GameConfig'
import { BattleManager } from '../game/managers/BattleManager'
import { GameTimeManager } from '../game/managers/GameTimeManager'
import { useBattleStore } from '../stores/battleStore'
import { useGameStore } from '../stores/gameStore'

interface BattleArenaProps {
  className?: string
}

export const BattleArena: React.FC<BattleArenaProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<Phaser.Scene | null>(null)
  const battleManagerRef = useRef<BattleManager | null>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  const { updateArenaState, addTreasure, setCurrentWave, resetArena } = useBattleStore()
  const { updateResource } = useGameStore()

  useEffect(() => {
    if (!containerRef.current) return

    // Phaser game configuration for battle arena
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: GameConfig.BATTLE_AREA_WIDTH,
      height: GameConfig.BATTLE_AREA_HEIGHT,
      parent: containerRef.current,
      backgroundColor: '#1a1a1a',
      scene: {
        preload: function() {
          // Sprite loading is now handled by the individual units
          console.log('BattleArena preload complete')
        },

        create: function() {
          console.log('BattleArena scene created!')
          sceneRef.current = this

          battleManagerRef.current = new BattleManager(this)
          console.log('BattleManager created!')

          // Battle arena is ready (removed visual border indicator)

          // Set up event listeners
          this.events.on('wave_started', (data: { wave: any }) => {
            setCurrentWave(data.wave)
          })

          this.events.on('game_over', (eventData: { totalWaves: number, stats: any }) => {
            console.log('BattleArena: Game Over detected - pausing game and forwarding to React layer')

            // Pause the game immediately
            const timeManager = GameTimeManager.getInstance()
            timeManager.setPaused(true)

            // Emit game over event to React layer via window event
            const customEvent = new CustomEvent('phaser_game_over', { detail: eventData })
            window.dispatchEvent(customEvent)
          })

          this.events.on('treasure_earned', (data: { amount: number }) => {
            updateResource('gold', data.amount)
            addTreasure(data.amount)
          })

          this.events.on('battle_defeat', () => {
            // Handle defeat - could show message or effects
          })

          // Initialize arena with reset state
          useBattleStore.getState().resetArena()
        },

        update: function(_time: number, delta: number) {
          if (!battleManagerRef.current) return

          // Important: Update GameTimeManager first so BattleManager has correct time
          const timeManager = GameTimeManager.getInstance()
          timeManager.update(delta)

          // BattleManager now handles pause/speed internally via GameTimeManager
          battleManagerRef.current.update(delta)

          // Update store with current arena state
          const arenaState = battleManagerRef.current.getArenaState()
          const timeToNextWave = battleManagerRef.current.getTimeToNextWave()

          updateArenaState({
            ...arenaState,
            nextWaveTime: timeToNextWave
          })
        }
      }
    }

    gameRef.current = new Phaser.Game(config)

    return () => {
      if (battleManagerRef.current) {
        battleManagerRef.current.destroy()
      }
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [])

  // Function to add soldier to battle arena (called from outside)
  const addSoldierToBattle = useCallback((barracksId?: string, maxUnits?: number) => {
    if (battleManagerRef.current) {
      // Check if this barracks can add more soldiers
      if (barracksId && maxUnits && !battleManagerRef.current.canAddSoldierFromBarracks(barracksId, maxUnits)) {
        console.log(`Cannot add soldier from barracks ${barracksId}: already at max capacity ${maxUnits}`)
        return false
      }
      battleManagerRef.current.addSoldier(barracksId)
      return true
    }
    return false
  }, [])

  // Function to check soldier count for a barracks
  const getSoldiersCountByBarracks = useCallback((barracksId: string) => {
    if (battleManagerRef.current) {
      return battleManagerRef.current.getSoldiersCountByBarracks(barracksId)
    }
    return 0
  }, [])

  // Expose the functions to parent components
  useEffect(() => {
    // Store reference to functions in a way that can be accessed
    ;(window as any).addSoldierToBattle = addSoldierToBattle
    ;(window as any).getSoldiersCountByBarracks = getSoldiersCountByBarracks

    return () => {
      delete (window as any).addSoldierToBattle
      delete (window as any).getSoldiersCountByBarracks
    }
  })

  // Listen for game restart events
  useEffect(() => {
    const handleGameRestart = () => {
      console.log('BattleArena: Received restart event - resetting battle')

      // Reset game time manager
      const timeManager = GameTimeManager.getInstance()
      timeManager.reset()

      // Reset battle state immediately
      resetArena()

      // If battle manager exists, destroy and recreate it
      if (battleManagerRef.current) {
        battleManagerRef.current.destroy()
        battleManagerRef.current = null
      }

      // Recreate battle manager if scene exists
      if (sceneRef.current) {
        battleManagerRef.current = new BattleManager(sceneRef.current)
        console.log('BattleManager recreated!')
      }
    }

    window.addEventListener('phaser_game_restart' as any, handleGameRestart)

    return () => {
      window.removeEventListener('phaser_game_restart' as any, handleGameRestart)
    }
  }, [resetArena])

  return (
    <div
      ref={containerRef}
      className={`battle-arena-container ${className || ''}`}
    />
  )
}