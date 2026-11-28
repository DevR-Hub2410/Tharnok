export class Matrix4 {
    public elements: Float32Array

    constructor() {
        this.elements = new Float32Array(16)
        this.identity()
    }

    public identity(): this {
        const m = this.elements
        m.fill(0)

        m[0] = 1
        m[5] = 1
        m[10] = 1
        m[15] = 1

        return this
    }

    public setTranslation(x: number, y: number, z: number): this {
        this.elements[12] = x
        this.elements[13] = y
        this.elements[14] = z

        return this
    }

    public setScale(x: number, y: number, z: number): this {
        this.identity()

        this.elements[0] = x
        this.elements[5] = y
        this.elements[10] = z

        return this
    }

    public setRotationX(angle: number): this {
        const c = Math.cos(angle)
        const s = Math.sin(angle)

        this.identity()

        this.elements[5] = c
        this.elements[6] = s
        this.elements[9] = -s
        this.elements[10] = c

        return this
    }

    public setRotationY(angle: number): this {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        
        this.identity()

        this.elements[0] = c
        this.elements[2] = -s
        this.elements[8] = s
        this.elements[10] = c

        return this
    }

    public setRotationZ(angle: number): this {
        const c = Math.cos(angle)
        const s = Math.sin(angle)

        this.identity()

        this.elements[0] = c
        this.elements[1] = s
        this.elements[4] = -s
        this.elements[5] = c

        return this
    }

    public multiply(matrix: Matrix4): this {
        const a = this.elements.slice()
        const b = matrix.elements
        const out = this.elements

        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 4; row++) {
                let sum = 0
                for (let k = 0; k < 4; k++) {
                    sum += a[k * 4 + row]! * b[col * 4 + k]!
                }
                out[col * 4 + row] = sum
            }
        }

        return this
    }

    public static perspective(fov: number, aspect: number, near: number, far: number): Matrix4 {
        if(aspect <= 0 || near <= 0 || far <= near) {
            throw new Error('Invalid perspective parameters')
        }

        const matrix = new Matrix4()
        const m = matrix.elements

        const f = 1 / Math.tan(fov / 2)

        m.fill(0)

        m[0] = f / aspect
        m[5] = f
        m[10] = (far + near) / (near - far)
        m[11] = -1
        m[14] = (2 * far * near) / (near - far)

        return matrix
    }

    public clone(): Matrix4 {
        const matrix = new Matrix4()
        matrix.elements.set(this.elements)

        return matrix
    }

    public rotateY(angle: number): this {
        const rot = new Matrix4().setRotationY(angle)
        return this.multiply(rot)
    }

    public translate(x: number, y: number, z: number): this {
        const trans = new Matrix4().setTranslation(x, y, z)
        return this.multiply(trans)
    }

    public static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
        const matrix = new Matrix4()
        const e = matrix.elements

        e[0] = 2 / (right - left)
        e[5] = 2 / (top - bottom)
        e[10] = -2 / (far - near)

        e[12] = -(right + left) / (right - left)
        e[13] = -(top + bottom) / (top - bottom)
        e[14] = -(far + near) / (far - near)

        return matrix
    }
}