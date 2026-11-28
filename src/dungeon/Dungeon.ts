import type { Model } from "../graphics/Model.js"
import { Tile } from "./tile/Tile.js"

export class Dungeon {
    public width: number
    public height: number
    public depth: number

    public blocks: Uint16Array

    constructor(width: number, height: number, depth: number) {
        this.width = width
        this.height = height
        this.depth = depth

        this.blocks = new Uint16Array(width * height * depth)
    }

    public getIndex(x: number, y: number, z: number): number {
        return (y * this.depth + z) * this.width + x
    }

    public isValidPosition(x: number, y: number, z: number): boolean {
        return (x >= 0 && x < this.width && y >= 0 && y < this.height && z >= 0 && z < this.depth)
    }

    public getTile(x: number, y: number, z: number): number {
        if(!this.isValidPosition(x, y, z)) {
            return Tile.AIR
        }

        return this.blocks[this.getIndex(x, y, z)]!
    }

    public setTile(x: number, y: number, z: number, id: number): void {
        if(!this.isValidPosition(x, y, z)) {
            return
        }

        this.blocks[this.getIndex(x, y, z)]! = id
    }

    public generate(): void {
        for (let x = 0; x < this.width; x++) {
            for (let z = 0; z < this.depth; z++) {
                const isCorner = (x === 0 || x === this.width - 1) && (z === 0 || z === this.depth - 1)
                if (isCorner) continue

                const isBorder = x === 0 || x === this.width - 1 || z === 0 || z === this.depth - 1
                if (isBorder) {
                    this.setTile(x, 0, z, Tile.WALL)
                }
            }
        }
    }
}