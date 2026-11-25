export class ShaderProgram {
    private program: WebGLProgram

    constructor(private gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string) {
        const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexSource)
        const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentSource)

        const program = gl.createProgram()
        if(!program) {
            throw new Error('Could not create shader program')
        }

        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)

        if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const log = this.gl.getProgramInfoLog(program)
            this.gl.deleteProgram(program)

            throw new Error(`Shader linking error: ${log}`)
        }

        gl.deleteShader(vertexShader)
        gl.deleteShader(fragmentShader)

        this.program = program
    }

    private compileShader(type: number, source: string): WebGLShader {
        const shader = this.gl.createShader(type)
        if(!shader) {
            throw new Error('Could not create shader')
        }

        this.gl.shaderSource(shader, source)
        this.gl.compileShader(shader)

        if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            const log = this.gl.getShaderInfoLog(shader)
            this.gl.deleteShader(shader)

            throw new Error(`Shader compilation error: ${log}`)
        }
        return shader
    }

    public bind(): void {
        this.gl.useProgram(this.program)
    }

    public unbind(): void {
        this.gl.useProgram(null)
    }

    public dispose(): void {
        this.gl.deleteProgram(this.program)
    }

    public setInt(name: string, value: number): void {
        const location = this.gl.getUniformLocation(this.program, name)
        if(location === null) return

        this.gl.uniform1i(location, value)
    }

    public setBoolean(name: string, value: boolean): void {
        const location = this.gl.getUniformLocation(this.program, name)
        if(location === null) return
        
        this.gl.uniform1i(location, value ? 1 : 0)
    }
}