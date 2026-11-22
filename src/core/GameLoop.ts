import { GameTime } from "./GameTime.js"

export class GameLoop {
    private running: boolean = false
    private time: GameTime = new GameTime()

    constructor(private run: (deltaTime: number) => void, private render: () => void) {}

    public start(): void {
        if(this.running) return
        this.running = true

        this.time.reset()

        requestAnimationFrame(this.loop)
    }

    public stop(): void {
        this.running = false
    }

    private loop = (currentTime: number): void => {
        if(!this.running) return

        this.time.update(currentTime)

        this.run(this.time.deltaTime)
        this.render()

        requestAnimationFrame(this.loop)
    }
}