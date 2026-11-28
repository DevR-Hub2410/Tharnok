export class InputManager {
    private keys: Set<string> = new Set()
    private buttons: Set<number> = new Set()

    public mouseX: number = 0
    public mouseY: number = 0

    constructor(private canvas: HTMLCanvasElement) {
        window.addEventListener('keydown', this.onKeyDown)
        window.addEventListener('keyup', this.onKeyUp)
        window.addEventListener('blur', this.onBlur)

        canvas.addEventListener('mousedown', this.onMouseDown)
        window.addEventListener('mouseup', this.onMouseUp)
        document.addEventListener('mousemove', this.onMouseMove)
    }

    private onKeyDown = (event: KeyboardEvent): void => {
        this.keys.add(event.code)
    }

    private onKeyUp = (event: KeyboardEvent): void =>  {
        this.keys.delete(event.code)
    }

    private onMouseDown = (event: MouseEvent): void => {
        this.buttons.add(event.button)
    }

    private onMouseUp = (event: MouseEvent): void => {
        this.buttons.delete(event.button)
    }

    private onMouseMove = (event: MouseEvent): void => {
        this.mouseX += event.movementX
        this.mouseY += event.movementY
    }

    private onBlur = (): void =>  {
        this.keys.clear()
        this.buttons.clear()
    }

    public isKeyDown(key: string): boolean {
        return this.keys.has(key)
    }

    public isButtonDown(button: number): boolean {
        return this.buttons.has(button)
    }

    public getMouseDelta(): {x: number, y: number} {
        const delta = {
            x: this.mouseX,
            y: this.mouseY
        }

        this.mouseX = 0
        this.mouseY = 0

        return delta
    }

    public destroy(): void {
        window.removeEventListener('keydown', this.onKeyDown)
        window.removeEventListener('keyup', this.onKeyUp)
        window.removeEventListener('blur', this.onBlur)

        this.canvas.removeEventListener('mousedown', this.onMouseDown)
        window.removeEventListener('mouseup', this.onMouseUp)
        document.removeEventListener('mousemove', this.onMouseMove)

        this.keys.clear()
        this.buttons.clear()
    }
}