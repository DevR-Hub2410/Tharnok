import type { Tessellator } from "./Tessellator.js"

export interface ModelVertex {
    position: [number, number, number]
    uv: [number, number]
    normal: [number, number, number]
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
}