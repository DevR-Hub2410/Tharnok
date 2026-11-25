import { ShaderProgram } from "../graphics/ShaderProgram.js"
import { Tessellator } from "../graphics/Tessellator.js"
import { GameLoop } from "./GameLoop.js"

import vertexSource from "../../shaders/basic.vert?raw"
import fragmentSource from "../../shaders/basic.frag?raw"
import { Texture } from "../graphics/Texture.js"

export class Game {
    private gl: WebGL2RenderingContext
    
    private loop: GameLoop
    private t: Tessellator
    private shader: ShaderProgram
    private texture: Texture
    private atlas: WebGLTexture | null = null

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
        this.texture = new Texture(gl)
    }

    public async start(): Promise<void> {
        this.atlas = await this.texture.loadTexture(`${import.meta.env.BASE_URL}textures/gui.png`)
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

        if(!this.atlas) return

        this.shader.bind()
        gl.activeTexture(gl.TEXTURE0)
        this.texture.bind(this.atlas)

        this.shader.setInt('uTexture', 0)
        this.shader.setBoolean('useTexture', true)

        const {u0, v0, u1, v1} = this.getSpriteUV(0, 0)

        t.begin()

        t.color(1.0, 1.0, 1.0)
        t.vertexUV(-0.5, -0.5, 0.0, u0, v1)
        t.vertexUV(0.5, -0.5, 0.0, u1, v1)
        t.vertexUV(0.5, 0.5, 0.0, u1, v0)
        
        t.vertexUV(-0.5, -0.5, 0.0, u0, v1)
        t.vertexUV(0.5, 0.5, 0.0, u1, v0)
        t.vertexUV(-0.5, 0.5, 0.0, u0, v0)

        t.end()

        this.shader.unbind()
    }

    private getSpriteUV(col: number, row: number) {
        const spriteSize = 16
        const atlasSize = 256

        const u0 = col * (spriteSize / atlasSize)
        const v0 = 1.0 - (row * (spriteSize / atlasSize))
        const u1 = u0 +  (spriteSize / atlasSize)
        const v1 = 1.0 - ((row + 1) * (spriteSize / atlasSize))

        return {u0, v0, u1, v1}
    }
}