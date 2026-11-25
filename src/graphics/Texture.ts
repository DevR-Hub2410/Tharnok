export class Texture {
    private gl: WebGL2RenderingContext
    private missingNo: HTMLCanvasElement

    private cache = new Map<string, WebGLTexture>()
    private pending = new Map<string, Promise<WebGLTexture>>()
    private lastTexture: WebGLTexture | null = null

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl

        this.missingNo = document.createElement("canvas")
        this.missingNo.width = 64
        this.missingNo.height = 64

        const ctx = this.missingNo.getContext("2d")!
        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(0, 0, 64, 64)
        ctx.fillStyle = "#000000"
        ctx.font = "10px monospace"
        ctx.fillText("missingtex", 2, 12)
    }

    public async loadTexture(url: string, mode: number = this.gl.NEAREST): Promise<WebGLTexture> {
        const key = `${url}:${mode}`

        const cached = this.cache.get(key)
        if(cached) {
            return Promise.resolve(cached)
        }

        const existing = this.pending.get(key)
        if(existing) {
            return existing
        }

        const promise = this.uploadTexture(url, mode).then(texture => {
            this.cache.set(key, texture)
            return texture
        }).finally(() => {
            this.pending.delete(key)
        })
        this.pending.set(key, promise)

        return promise
    }

    private async uploadTexture(url: string, mode: number): Promise<WebGLTexture> {
        const gl = this.gl
        const texture = gl.createTexture()
        if(!texture) {
            throw new Error('Failed to create WebGLTexture')
        }

        gl.bindTexture(gl.TEXTURE_2D, texture)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mode)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mode)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)

        try{
            const img = await this.readImage(url)
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
        }catch(e) {
            console.warn(`Failed to load texture: ${url}`, e)
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.missingNo)
        }

        gl.bindTexture(gl.TEXTURE_2D, null)

        return texture
    }

    private readImage(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.onerror = () => {
                reject(new Error(`Cannot load image: ${url}`))
            }

            img.crossOrigin = 'anonymous'
            img.src = url
        })
    }

    public bind(texture: WebGLTexture): void {
        if(this.lastTexture === texture) {
            return
        }

        this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
        this.lastTexture = texture
    }

    public releaseTexture(texture: WebGLTexture): void {
        const gl = this.gl;

        for (const [key, value] of this.cache) {
            if (value === texture) {
                this.cache.delete(key);
            }
        }

        if (this.lastTexture === texture) {
            gl.bindTexture(gl.TEXTURE_2D, null);
            this.lastTexture = null;
        }

        gl.deleteTexture(texture);
    }

    public dispose(): void {
        for (const texture of this.cache.values()) {
            this.gl.deleteTexture(texture);
        }

        this.cache.clear();
        this.pending.clear();

        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.lastTexture = null;
    }
}