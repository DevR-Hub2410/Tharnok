import { Matrix4 } from "../math/Matrix4.js";
import { Vector3 } from "../math/Vector3.js";

export class Camera {
    public position: Vector3
    public rotation: Vector3

    private viewMatrix: Matrix4
    private projectionMatrix: Matrix4

    private fov: number
    private near: number
    private far: number

    constructor(position: Vector3 = new Vector3(0, 0, 3), fov: number = 70, aspect: number = 1, near: number = 0.1, far: number = 1000) {
        this.position = position
        this.rotation = new Vector3(0, 0, 0)

        this.viewMatrix = new Matrix4()
        this.projectionMatrix = new Matrix4()

        this.fov = fov * Math.PI / 180
        this.near = near
        this.far = far

        this.updateProjection(aspect)
        this.updateView()
    }

    public updateView(): void {
        const pitch = this.rotation.x
        const yaw = this.rotation.y

        const cosPitch = Math.cos(pitch)

        const fx = Math.sin(yaw) * cosPitch
        const fy = Math.sin(pitch)
        const fz = -Math.cos(yaw) * cosPitch

        let rx = -fz
        let ry = 0
        let rz = fx

        const rightLength = Math.sqrt(rx * rx + ry * ry + rz * rz)

        rx /= rightLength
        ry /= rightLength
        rz /= rightLength

        const ux = ry * fz - rz * fy
        const uy = rz * fx - rx * fz
        const uz = rx * fy - ry * fx

        const x = this.position.x
        const y = this.position.y
        const z = this.position.z

        const m = this.viewMatrix.elements

        m[0] = rx
        m[1] = ux
        m[2] = -fx
        m[3] = 0

        m[4] = ry
        m[5] = uy
        m[6] = -fy
        m[7] = 0

        m[8] = rz
        m[9] = uz
        m[10] = -fz
        m[11] = 0

        m[12] = -(rx * x + ry * y + rz * z)
        m[13] = -(ux * x + uy * y + uz * z)
        m[14] = fx * x + fy * y + fz * z
        m[15] = 1
    }

    public updateProjection(aspect: number): void {
        this.projectionMatrix = Matrix4.perspective(this.fov, aspect, this.near, this.far)
    }

    public rotate(dx: number, dy: number, sensitivity: number = 0.002): void {
        this.rotation.y += dx * sensitivity
        this.rotation.x -= dy * sensitivity

        const limit = 89 * Math.PI / 180

        this.rotation.x = Math.max(-limit, Math.min(limit, this.rotation.x))

        this.updateView()
    }

    public getViewMatrix(): Matrix4 {
        return this.viewMatrix
    }

    public getProjectionMatrix(): Matrix4 {
        return this.projectionMatrix
    }

    public getForward(): Vector3 {
        const pitch = this.rotation.x
        const yaw = this.rotation.y
        const cosPitch = Math.cos(pitch)

        return new Vector3(Math.sin(yaw) * cosPitch, Math.sin(pitch), -Math.cos(yaw) * cosPitch)
    }
}