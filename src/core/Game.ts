import { ShaderProgram } from "../graphics/ShaderProgram.js"
import { Tessellator } from "../graphics/Tessellator.js"
import { GameLoop } from "./GameLoop.js"

import vertexSource from "../../shaders/basic.vert?raw"
import fragmentSource from "../../shaders/basic.frag?raw"

export class Game {
    private gl: WebGL2RenderingContext
    
    private loop: GameLoop
    private t: Tessellator
    private shader: ShaderProgram

    constructor(private canvas: HTMLCanvasElement) {
        const gl = canvas.getContext('webgl2')
        if(!gl) {
            throw new Error('WebGL 2 is not supported')
        }

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        this.gl = gl

        this.loop = new GameLoop(this.tick, this.render)
        this.shader = new ShaderProgram(gl, vertexSource, fragmentSource)
        this.t = new Tessellator(gl)
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
        const t = this.t
        gl.viewport(0, 0, this.canvas.width, this.canvas.height)
        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        this.shader.bind()

        t.begin()

        t.vertex(-0.5, -0.5, 0.0)
        t.vertex(0.5, -0.5, 0.0)
        t.vertex(0.5, 0.5, 0.0)

        t.vertex(-0.5, -0.5, 0.0)
        t.vertex(0.5, 0.5, 0.0)
        t.vertex(-0.5, 0.5, 0.0)

        t.end()

        this.shader.unbind()
    }
}