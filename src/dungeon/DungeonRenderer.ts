import type { ShaderProgram } from "../graphics/ShaderProgram.js";
import type { Tessellator } from "../graphics/Tessellator.js";
import type { Dungeon } from "./Dungeon.js";
import { Tile } from "./tile/Tile.js";

export class DungeonRenderer {
    private dungeon: Dungeon
    private gl: WebGL2RenderingContext
    private t: Tessellator
    private shader: ShaderProgram

    constructor(gl: WebGL2RenderingContext, dungeon: Dungeon, t: Tessellator, shader: ShaderProgram) {
        this.gl = gl
        this.dungeon = dungeon
        this.t = t
        this.shader = shader
    }

    public render(): void {
        const NORTH = 0
        const EAST = Math.PI / 2
        const SOUTH = Math.PI
        const WEST = -Math.PI / 2
        for(let x = 0; x < this.dungeon.width; x++) {
            for(let y = 0; y < this.dungeon.height; y++) {
                for(let z = 0; z < this.dungeon.depth; z++) {
                    const id = this.dungeon.getTile(x, y, z)
                    if(id === Tile.AIR) continue

                    const tile = Tile.tiles[id]
                    if(!tile) continue

                    let rotation = NORTH

                    // Esquinas
                    if (x === 0 && z === 0) {
                        rotation = (NORTH + EAST) / 2
                    } else if (x === this.dungeon.width - 1 && z === 0) {
                        rotation = (NORTH + WEST) / 2
                    } else if (x === 0 && z === this.dungeon.depth - 1) {
                        rotation = (SOUTH + EAST) / 2
                    } else if (x === this.dungeon.width - 1 && z === this.dungeon.depth - 1) {
                        rotation = (SOUTH + WEST) / 2
                    }

                    // Lados
                    else if (z === 0) {
                        rotation = NORTH
                    } else if (z === this.dungeon.depth - 1) {
                        rotation = SOUTH
                    } else if (x === 0) {
                        rotation = EAST
                    } else if (x === this.dungeon.width - 1) {
                        rotation = WEST
                    }

                    tile.render(this.gl, this.shader, this.t, x, y, z, rotation)
                }
            }
        }
    }
}