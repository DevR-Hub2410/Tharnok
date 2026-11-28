import type { Tessellator } from "./Tessellator.js"

export interface ModelVertex {
    position: [number, number, number]
    uv: [number, number]
    normal: [number, number, number]
}

export interface ModelBounds {
    min: [number, number, number]
    max: [number, number, number]
    size: [number, number, number]
}

export class Model {
    public vertices: ModelVertex[] = []

    public render(t: Tessellator): void {
        t.begin()
        t.color(1.0, 1.0, 1.0, 1.0)

        for(const vertex of this.vertices) {
            const [x, y, z] = vertex.position
            const [u, v] = vertex.uv
            const [nx, ny, nz] = vertex.normal

            t.vertexUV(x, y, z, nx, ny, nz, u, v)
        }

        t.end()
    }

    public bounds: ModelBounds = {
        min: [0, 0, 0],
        max: [0, 0, 0],
        size: [0, 0, 0]
    }

    public calculateBounds(): void {
        if(this.vertices.length === 0) return

        const min: [number, number, number] = [Infinity, Infinity, Infinity]
        const max: [number, number, number] = [-Infinity, -Infinity, -Infinity]
        
        for(const vertex of this.vertices) {
            const [x, y, z] = vertex.position

            min[0] = Math.min(min[0], x)
            min[1] = Math.min(min[1], y)
            min[2] = Math.min(min[2], z)

            max[0] = Math.max(max[0], x)
            max[1] = Math.max(max[1], y)
            max[2] = Math.max(max[2], z)
        }

        this.bounds = {
            min,
            max,
            size: [max[0] - min[0], max[1] - min[1], max[2] - min[2]]
        }
    }
}