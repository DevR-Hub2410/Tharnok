export class Tessellator {
    private vertices: number[] = []
    private vertexCount: number = 0

    private drawing: boolean = false
    
    private hasColor: boolean = false;
    private r: number = 1.0
    private g: number = 1.0
    private b: number = 1.0
    private a: number = 1.0

    private hasTexture: boolean = false
    private u: number = 0.0
    private v: number = 0.0

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
        const FLOAT_SIZE = Float32Array.BYTES_PER_ELEMENT
        const stride = 12 * FLOAT_SIZE

        gl.bindVertexArray(this.vao)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)

        gl.enableVertexAttribArray(0)
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0)

        gl.enableVertexAttribArray(1)
        gl.vertexAttribPointer(1, 4, gl.FLOAT, false, stride, 3 * FLOAT_SIZE)

        gl.enableVertexAttribArray(2)
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, stride, 7 * FLOAT_SIZE)

        gl.enableVertexAttribArray(3)
        gl.vertexAttribPointer(3, 3, gl.FLOAT, false, stride, 9 * FLOAT_SIZE)

        gl.bindVertexArray(null)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }

    public begin(): void {
        if(this.drawing) {
            throw new Error('Tessellator is already drawing!')
        }

        this.vertices = []
        this.vertexCount = 0

        this.hasColor = false
        this.hasTexture = false

        this.drawing = true
    }

    public color(r: number, g: number, b: number, a: number = 1.0): void {
        this.r = r
        this.g = g
        this.b = b
        this.a = a

        this.hasColor = true
    }

    public tex(u: number, v: number): void {
        this.u = u
        this.v = v

        this.hasTexture = true
    }

    public vertexUV(x: number, y: number, z: number, nx: number, ny: number, nz: number, u: number, v: number): void {
        this.tex(u, v)
        this.vertex(x, y, z, nx, ny, nz)
    }

    public vertex(x: number, y: number, z: number, nx: number, ny: number, nz: number): void {
        if(!this.drawing) {
            throw new Error("Call begin() before vertex()")
        }
        this.vertices.push(x, y, z)
        this.vertices.push(this.hasColor ? this.r : 1.0, this.hasColor ? this.g : 1.0, this.hasColor ? this.b : 1.0, this.hasColor ? this.a : 1.0)
        this.vertices.push(this.hasTexture ? this.u : 0.0, this.hasTexture ? this.v : 0.0)
        this.vertices.push(nx, ny, nz)
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