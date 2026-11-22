export class GameTime {
    private lastTime: number = 0
    private elapsedTime: number = 0

    private delta: number = 0

    private fps: number = 0
    private frameCount: number = 0
    private fpsTimer: number = 0

    get deltaTime(): number {
        return this.delta
    }

    get totalTime(): number {
        return this.elapsedTime
    }

    get FPS(): number {
        return this.fps
    }

    public reset(): void {
        this.lastTime = 0
        this.elapsedTime = 0

        this.delta = 0

        this.fps = 0
        this.frameCount = 0
        this.fpsTimer = 0
    }

    public update(currentTime: number): void {
        if(this.lastTime === 0) {
            this.lastTime = currentTime
            return
        }

        this.delta = (currentTime - this.lastTime) / 1000
        this.lastTime = currentTime

        this.elapsedTime += this.delta

        this.frameCount++
        this.fpsTimer += this.delta

        if(this.fpsTimer >= 1) {
            this.fps = this.frameCount
            this.frameCount = 0
            this.fpsTimer = 0
        }
    }
}