const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement
const gl = canvas.getContext('webgl2')

if(!gl) {
    throw new Error('WebGL 2 is not supported')
}

gl.viewport(0, 0, canvas.width, canvas.height)
gl.clearColor(0.05, 0.05, 0.05, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)