import type { Model } from "../../graphics/Model.js"
import type { ShaderProgram } from "../../graphics/ShaderProgram.js"
import type { Tessellator } from "../../graphics/Tessellator.js"
import { Matrix4 } from "../../math/Matrix4.js"

export class Tile {
    public static tiles: Tile[] = []

    public static readonly AIR = 0
    public static readonly WALL = 1
    
    public readonly id: number
    public model: Model
    public texture: WebGLTexture

    constructor(id: number, model: Model, texture: WebGLTexture) {
        this.id = id
        this.model = model
        this.texture = texture

        Tile.tiles[id] = this
    }

    public render(gl: WebGL2RenderingContext, shader: ShaderProgram, t: Tessellator, x: number, y: number, z: number, rotation: number = 0) {
        const bounds = this.model.bounds

        const sizeX = bounds.size[0]
        const sizeY = bounds.size[1]

        const cellSize = sizeX

        const localCenterX = bounds.min[0] + sizeX * 0.5
        const localCenterY = bounds.min[1] + sizeY * 0.5

        const cellCenterX = (x + 0.5) * cellSize
        const cellCenterY = y * sizeY + localCenterY
        const cellCenterZ = (z + 0.5) * cellSize

        const halfCell = cellSize * 0.5
        const edgeOffsetX = Math.sin(rotation) * halfCell
        const edgeOffsetZ = Math.cos(rotation) * halfCell

        const modelMatrix = new Matrix4()
        modelMatrix.setTranslation(cellCenterX + edgeOffsetX, cellCenterY, cellCenterZ + edgeOffsetZ)
        modelMatrix.multiply(new Matrix4().setRotationY(rotation))
        modelMatrix.multiply(new Matrix4().setTranslation(-localCenterX, -localCenterY, 0))

        shader.setMatrix4('uModel', modelMatrix.elements)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.texture)

        shader.setInt('uTexture', 0)
        shader.setBoolean('useTexture', true)

        this.model.render(t)
    }
}