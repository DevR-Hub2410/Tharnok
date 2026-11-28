import { ShaderProgram } from "../graphics/ShaderProgram.js"
import { Tessellator } from "../graphics/Tessellator.js"
import { GameLoop } from "./GameLoop.js"

import vertexSource from "../../shaders/basic.vert?raw"
import fragmentSource from "../../shaders/basic.frag?raw"
import { Texture } from "../graphics/Texture.js"
import { Camera } from "../graphics/Camera.js"
import { Vector3 } from "../math/Vector3.js"
import { Matrix4 } from "../math/Matrix4.js"
import type { Model } from "../graphics/Model.js"
import { OBJLoader } from "../graphics/OBJLoader.js"
import { WallTile } from "../dungeon/tile/WallTile.js"
import { Dungeon } from "../dungeon/Dungeon.js"
import { DungeonRenderer } from "../dungeon/DungeonRenderer.js"

export class Game {
    private gl: WebGL2RenderingContext
    
    private camera: Camera
    private model: Matrix4

    private keys: Record<string, boolean> = {}

    private loop: GameLoop
    private t: Tessellator
    private shader: ShaderProgram
    private texture: Texture
    private atlas: WebGLTexture | null = null

    private dungeon!: Dungeon
    private dungeonRenderer!: DungeonRenderer
    private wallModel: Model | null = null
    private wallTexture: WebGLTexture | null = null

    constructor(private canvas: HTMLCanvasElement) {
        const gl = canvas.getContext('webgl2')
        if(!gl) {
            throw new Error('WebGL 2 is not supported')
        }

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        gl.enable(gl.DEPTH_TEST)

        gl.enable(gl.CULL_FACE)
        gl.cullFace(gl.BACK)
        gl.frontFace(gl.CCW)

        this.gl = gl

        this.loop = new GameLoop(this.tick, this.render)
        this.shader = new ShaderProgram(gl, vertexSource, fragmentSource)
        this.t = new Tessellator(gl)
        this.texture = new Texture(gl)

        this.camera = new Camera(new Vector3(0, 0, 3), 70, this.gl.canvas.width / this.gl.canvas.height)
        this.model = new Matrix4()

        canvas.addEventListener('click', () => {
            canvas.requestPointerLock()
        })

        document.addEventListener('mousemove', (e) => {
            this.camera.rotate(e.movementX, e.movementY)
        })

        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true
        })

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false
        })

        this.dungeon = new Dungeon(10, 1, 10)
        this.dungeonRenderer = new DungeonRenderer(this.gl, this.dungeon, this.t, this.shader)
    }

    public async start(): Promise<void> {
        this.atlas = await this.texture.loadTexture(`${import.meta.env.BASE_URL}textures/gui.png`)
        this.wallModel = await OBJLoader.load(`${import.meta.env.BASE_URL}models/wall.obj`)
        this.wallTexture = await this.texture.loadTexture(`${import.meta.env.BASE_URL}textures/wall.png`)
        new WallTile(this.wallModel!, this.wallTexture!)
        this.dungeon.generate()
        this.loop.start()
    }

    public stop(): void {
        this.loop.stop()
    }

    private tick = (deltaTime: number): void => {
        this.updateCamera(deltaTime)
    }

    private render = (): void => {
        const gl = this.gl
        const t = this.t

        gl.viewport(0, 0, this.canvas.width, this.canvas.height)
        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        if(!this.atlas) return

        this.shader.bind()
        this.shader.setMatrix4('uModel', this.model.elements)
        this.shader.setMatrix4('uView', this.camera.getViewMatrix().elements)
        this.shader.setMatrix4('uProjection', this.camera.getProjectionMatrix().elements)

        // gl.activeTexture(gl.TEXTURE0)
        // this.texture.bind(this.atlas)

        this.dungeonRenderer.render()

        /* const {u0, v0, u1, v1} = this.getSpriteUV(0, 0)

        Cube.render(t, u0, v0, u1, v1) */

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

    private updateCamera(deltaTime: number): void {
        const speed = 5.0 * deltaTime
        const forward = this.camera.getForward()

        forward.y = 0
        forward.normalizer()

        const right = new Vector3(-forward.z, 0, forward.x)

        if(this.keys['KeyW']) {
            this.camera.position.add(forward.clone().multiply(speed))
        }
        if(this.keys['KeyS']) {
            this.camera.position.subtract(forward.clone().multiply(speed))
        }
        if(this.keys['KeyA']) {
            this.camera.position.subtract(right.clone().multiply(speed))
        }
        if(this.keys['KeyD']) {
            this.camera.position.add(right.clone().multiply(speed))
        }
        if(this.keys['Space']) {
            this.camera.position.y += speed
        }
        if(this.keys['ShiftLeft']) {
            this.camera.position.y -= speed
        }

        this.camera.updateView()
    }
}