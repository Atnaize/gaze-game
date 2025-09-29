/**
 * Global GameTimeManager - Single source of truth for all time operations
 *
 * This manager handles pause/speed globally so no individual system needs to check these states.
 * All systems should use this manager's time methods instead of raw delta time.
 */
export class GameTimeManager {
  private static instance: GameTimeManager | null = null

  private gameTime = 0 // Accumulated game time (not real time)
  private isPaused = false
  private gameSpeed = 1

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): GameTimeManager {
    if (!GameTimeManager.instance) {
      GameTimeManager.instance = new GameTimeManager()
    }
    return GameTimeManager.instance
  }

  /**
   * Must be called every frame with real delta time
   * This is the only place where pause/speed logic exists
   */
  public update(realDeltaTime: number): void {
    if (!this.isPaused) {
      const gameTimeDelta = realDeltaTime * this.gameSpeed
      this.gameTime += gameTimeDelta
    }
  }

  /**
   * Get current accumulated game time (respects pause/speed)
   * Use this instead of Date.now() or real time
   */
  public getGameTime(): number {
    return this.gameTime
  }

  /**
   * Get delta time for this frame (automatically handles pause/speed)
   * Returns 0 if paused, scaled delta if speed != 1
   * Use this instead of raw delta time in all systems
   */
  public getDeltaTime(realDeltaTime: number): number {
    if (this.isPaused) {
      return 0
    }
    return realDeltaTime * this.gameSpeed
  }

  /**
   * Check if game is currently paused
   */
  public isPaused_(): boolean {
    return this.isPaused
  }

  /**
   * Get current game speed multiplier
   */
  public getGameSpeed(): number {
    return this.gameSpeed
  }

  /**
   * Set pause state (called by game controls)
   */
  public setPaused(paused: boolean): void {
    this.isPaused = paused
  }

  /**
   * Set game speed (called by game controls)
   */
  public setGameSpeed(speed: number): void {
    this.gameSpeed = speed
  }

  /**
   * Create a timer that respects game time
   * Returns a function that checks if the timer has elapsed
   */
  public createTimer(duration: number): () => boolean {
    const startTime = this.gameTime
    return () => {
      return (this.gameTime - startTime) >= duration
    }
  }

  /**
   * Get time remaining for a timer created at a specific game time
   */
  public getTimeRemaining(startTime: number, duration: number): number {
    const elapsed = this.gameTime - startTime
    return Math.max(0, duration - elapsed)
  }

  /**
   * Reset the time manager (useful for testing or game restart)
   */
  public reset(): void {
    this.gameTime = 0
    this.isPaused = false
    this.gameSpeed = 1
  }
}