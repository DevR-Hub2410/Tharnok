import { Game } from "./core/Game.js"

const canvas = document.getElementById('game') as HTMLCanvasElement

const game = new Game(canvas)
game.start()