import { Matrix4 } from "../math/Matrix4.js"
import type { ShaderProgram } from "./ShaderProgram.js"
import type { Tessellator } from "./Tessellator.js"

export class Font {
    private static readonly CHAR_WIDTH = 8
    private static readonly CHAR_HEIGHT = 8

    private static readonly TEXTURE_WIDTH = 256
    private static readonly TEXTURE_HEIGHT = 16

    private static readonly ROW_0 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    private static readonly ROW_1 = "0123456789.,:;!?+-*/() "

    constructor(private gl: WebGL2RenderingContext, private t: Tessellator, private shader: ShaderProgram, private texture: WebGLTexture) {}

    private getCharacterUV(char: string) {
        let row = -1
        let column = -1

        column = Font.ROW_0.indexOf(char)
        if(column !== -1) {
            row = 0
        }else {
            column = Font.ROW_1.indexOf(char)
            if(column !== -1) {
                row = 1
            }
        }

        if(row === -1) return null

        const u0 = (column * Font.CHAR_WIDTH) / Font.TEXTURE_WIDTH
        const v0 = 1 - ((row + 1) * Font.CHAR_HEIGHT) / Font.TEXTURE_HEIGHT
        const u1 = u0 + Font.CHAR_WIDTH / Font.TEXTURE_WIDTH
        const v1 = v0 + Font.CHAR_HEIGHT / Font.TEXTURE_HEIGHT

        return {u0, v0, u1, v1}
    }

    public drawText(text: string, x: number, y: number, scale: number = 1, r: number, g: number, b: number): void {
        const charWidth = Font.CHAR_WIDTH * scale
        const charHeight = Font.CHAR_HEIGHT * scale

        const projection = Matrix4.orthographic(0, this.gl.canvas.width, this.gl.canvas.height, 0, -1, 1)
        this.shader.setMatrix4('uModel', new Matrix4().elements)
        this.shader.setMatrix4('uView', new Matrix4().elements)
        this.shader.setMatrix4('uProjection', projection.elements)

        this.gl.activeTexture(this.gl.TEXTURE0)
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)

        this.shader.setInt('uTexture', 0)
        this.shader.setBoolean('useTexture', true)
        this.shader.setBoolean('useLighting', false)

        this.t.begin()

        for(let i = 0; i < text.length; i++) {
            const char = text[i]!.toUpperCase()
            if(char === ' ') continue

            const uv = this.getCharacterUV(char)
            if(!uv) continue

            const x0 = x + i * charWidth
            const y0 = y
            const x1 = x0 + charWidth
            const y1 = y0 + charHeight

            this.t.color(r, g, b, 1.0)
            this.t.vertexUV(x0, y0, 0, 0, 0, 1, uv.u0, uv.v1)
            this.t.vertexUV(x1, y0, 0, 0, 0, 1, uv.u1, uv.v1)
            this.t.vertexUV(x1, y1, 0, 0, 0, 1, uv.u1, uv.v0)

            this.t.vertexUV(x0, y0, 0, 0, 0, 1, uv.u0, uv.v1)
            this.t.vertexUV(x1, y1, 0, 0, 0, 1, uv.u1, uv.v0)
            this.t.vertexUV(x0, y1, 0, 0, 0, 1, uv.u0, uv.v0)
        }

        this.t.end()
    }
}