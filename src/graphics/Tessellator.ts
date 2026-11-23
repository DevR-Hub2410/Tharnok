export class Tessellator {
    private vertices: number[] = []
    private vertexCount: number = 0

    private drawing: boolean = false

    private vao: WebGLVertexArrayObject
    private vbo: WebGLBuffer

    constructor(private gl: WebGL2RenderingContext) {
        const vao = gl.createVertexArray()
        const vbo = gl.createBuffer()

        if(!vao || !vbo) {
            throw new Error('Dont create buffers')
        }

        this.vao = vao
        this.vbo = vbo

        this.setupBuffers()
    }

    private setupBuffers(): void {
        const gl = this.gl
        const stride = 3 * 4

        gl.bindVertexArray(this.vao)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)

        gl.enableVertexAttribArray(0)
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0)

        gl.bindVertexArray(null)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }

    public begin(): void {
        if(this.drawing) {
            throw new Error('Tessellator is already drawing!')
        }

        this.vertices = []
        this.vertexCount = 0

        this.drawing = true
    }

    public vertex(x: number, y: number, z: number): void {
        if(!this.drawing) {
            throw new Error("Call begin() before vertex()")
        }
        this.vertices.push(x, y, z)
        this.vertexCount++
    }

    public end(): void {
        if(!this.drawing) {
            throw new Error("Call begin() before end()")
        }

        this.drawing = false
        if(this.vertexCount === 0) {
            return
        }

        const gl = this.gl
        const data = new Float32Array(this.vertices)

        gl.bindVertexArray(this.vao)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)

        gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount)

        gl.bindVertexArray(null)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }

    public dispose(): void {
        this.gl.deleteBuffer(this.vbo)
        this.gl.deleteVertexArray(this.vao)
    }
}