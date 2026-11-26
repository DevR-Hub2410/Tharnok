export class Vector2 {
    private x: number
    private y: number

    constructor(x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }

    public set(x: number, y:number): this {
        this.x = x
        this.y = y
        return this
    }

    public add(vector: Vector2): this {
        this.x += vector.x
        this.y += vector.y
        return this
    }

    public subtract(vector: Vector2): this {
        this.x -= vector.x
        this.y -= vector.y
        return this
    }

    public multiply(scalar: number): this {
        this.x *= scalar
        this.y *= scalar
        return this
    }

    public divide(scalar: number): this {
        if(scalar === 0) {
            throw new Error('Division by zero')
        }
        this.x /= scalar
        this.y /= scalar
        return this
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    public normalizer(): this {
        const length = this.length()

        if(length > 0) {
            this.divide(length)
        }

        return this
    }

    public dot(vector: Vector2): number {
        return this.x * vector.x + this.y * vector.y
    }

    public distance(vector: Vector2): number {
        const dx = this.x - vector.x
        const dy = this.y - vector.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    public clone(): Vector2 {
        return new Vector2(this.x, this.y)
    }

    public copy(vector: Vector2): this {
        this.x = vector.x
        this.y = vector.y
        return this
    }

}