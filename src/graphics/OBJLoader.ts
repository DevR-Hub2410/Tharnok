import { Model, type ModelVertex } from "./Model.js";

export class OBJLoader {
    public static async load(path: string): Promise<Model> {
        const response = await fetch(path)
        if(!response.ok) {
            throw new Error(`Could not load OBJ: ${path}`)
        }
        const source = await response.text()

        return this.parse(source)
    }

    public static parse(source: string): Model {
        const positions: number[][] = []
        const texCoords: number[][] = []
        const normals: number[][] = []

        const model = new Model()

        const lines = source.split(/\r?\n/)

        for(const line of lines) {
            const parts = line.trim().split(/\s+/)

            if(!parts[0] || parts[0].startsWith('#')) {
                continue
            }

            switch(parts[0]) {
                case 'v': {
                    positions.push([Number(parts[1]), Number(parts[2]), Number(parts[3])])
                    break
                }
                case 'vt': {
                    texCoords.push([Number(parts[1]), Number(parts[2])])
                    break
                }
                case 'vn': {
                    normals.push([Number(parts[1]), Number(parts[2]), Number(parts[3])])
                    break
                }
                case 'f': {
                    const face = parts.slice(1).map(value => {
                        const indices = value.split('/')

                        return {
                            position: this.getIndex(indices[0]!, positions.length),
                            uv: indices[1] ? this.getIndex(indices[1], texCoords.length) : -1,
                            normal: indices[2] ? this.getIndex(indices[2], normals.length) : -1
                        }
                    })
                    
                    for(let i = 1; i < face.length - 1; i++) {
                        const triangle = [face[0], face[i], face[i + 1]]

                        const p0 = positions[triangle[0]!.position]
                        const p1 = positions[triangle[1]!.position]
                        const p2 = positions[triangle[2]!.position]

                        const ax = p1![0]! - p0![0]!
                        const ay = p1![1]! - p0![1]!
                        const az = p1![2]! - p0![2]!

                        const bx = p2![0]! - p0![0]!
                        const by = p2![1]! - p0![1]!
                        const bz = p2![2]! - p0![2]!

                        let nx = ay * bz - az * by
                        let ny = az * bx - ax * bz
                        let nz = ax * by - ay * bx

                        const length = Math.sqrt(nx * nx + ny * ny + nz * nz)

                        if(length > 0) {
                            nx /= length
                            ny /= length
                            nz /= length
                        }
                        for(const vertex of triangle) {
                            const position = positions[vertex!.position]
                            const uv = vertex!.uv >= 0 ? texCoords[vertex!.uv] : undefined
                            const normal = vertex!.normal >= 0 ? normals[vertex!.normal] : [nx, ny, nz]

                            if(!position) {
                                throw new Error('Invalid OBJ position index')
                            }

                            if(!normal) {
                                throw new Error('Invalid OBJ normal index')
                            }

                            const modelVertex: ModelVertex = {
                                position: [position[0]!, position[1]!, position[2]!],
                                uv: uv ? [uv[0]!, uv[1]!] : [0, 0],
                                normal: [normal[0]!, normal[1]!, normal[2]!]
                            }

                            model.vertices.push(modelVertex)
                        }
                    }

                    break
                }
            }
        }
        model.calculateBounds()
        return model
    }

    private static getIndex(value: string, length: number): number {
        const index = Number(value)

        if(!Number.isInteger(index) || index === 0) {
            throw new Error(`Invalid OBJ index: ${value}`)
        }

        return index > 0 ? index - 1 : length + index
    }
}