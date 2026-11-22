import { GameLoop } from "./GameLoop.js"

export class Game {
    private gl: WebGL2RenderingContext
    
    private loop: GameLoop

    constructor(private canvas: HTMLCanvasElement) {
        const gl = canvas.getContext('webgl2')
        if(!gl) {
            throw new Error('WebGL 2 is not supported')
        }

        this.gl = gl

        this.loop = new GameLoop(this.tick, this.render)
    }

    public start(): void {
        this.loop.start()
    }

    public stop(): void {
        this.loop.stop()
    }

    private tick = (deltaTime: number): void => {

    }

    private render = (): void => {
        const gl = this.gl
        gl.viewport(0, 0, this.canvas.width, this.canvas.height)
        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    }
}