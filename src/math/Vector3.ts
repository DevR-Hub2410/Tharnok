export class Vector3 {
    public x: number
    public y: number
    public z: number

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x
        this.y = y
        this.z = z
    }

    public set(x: number, y:number, z: number): this {
        this.x = x
        this.y = y
        this.z = z
        return this
    }

    public add(vector: Vector3): this {
        this.x += vector.x
        this.y += vector.y
        this.z += vector.z
        return this
    }

    public subtract(vector: Vector3): this {
        this.x -= vector.x
        this.y -= vector.y
        this.z -= vector.z
        return this
    }

    public multiply(scalar: number): this {
        this.x *= scalar
        this.y *= scalar
        this.z *= scalar
        return this
    }

    public divide(scalar: number): this {
        if(scalar === 0) {
            throw new Error('Division by zero')
        }
        this.x /= scalar
        this.y /= scalar
        this.z /= scalar
        return this
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }

    public normalizer(): this {
        const length = this.length()

        if(length > 0) {
            this.divide(length)
        }

        return this
    }

    public dot(vector: Vector3): number {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z
    }

    public cross(vector: Vector3): Vector3 {
        return new Vector3(this.y * vector.z - this.z * vector.y, this.z * vector.x - this.x * vector.z, this.x * vector.y - this.y * vector.x)
    }

    public distance(vector: Vector3): number {
        const dx = this.x - vector.x
        const dy = this.y - vector.y
        const dz = this.z - vector.z
        return Math.sqrt(dx * dx + dy * dy + dz * dz)
    }

    public clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z)
    }

    public copy(vector: Vector3): this {
        this.x = vector.x
        this.y = vector.y
        this.z = vector.z
        return this
    }

}