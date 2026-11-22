export class Game {
    private gl: WebGL2RenderingContext
    private running: boolean = false

    constructor(private canvas: HTMLCanvasElement) {
        const gl = canvas.getContext('webgl2')
        if(!gl) {
            throw new Error('WebGL 2 is not supported')
        }

        this.gl = gl
    }

    public start(): void {
        this.running = true
        requestAnimationFrame(this.run)
    }

    private run = (timer: number): void => {
        if(!this.running) return

        this.tick(timer)
        this.render()

        requestAnimationFrame(this.run)
    }

    private tick(timer: number): void {

    }

    private render(): void {
        const gl = this.gl
        gl.viewport(0, 0, this.canvas.width, this.canvas.height)
        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    }
}