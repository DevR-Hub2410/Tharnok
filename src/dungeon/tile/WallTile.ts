import type { Model } from "../../graphics/Model.js";
import { Tile } from "./Tile.js";

export class WallTile extends Tile {
    public static readonly ID = 1

    constructor(model: Model, texture: WebGLTexture) {
        super(WallTile.ID, model, texture)
    }
}