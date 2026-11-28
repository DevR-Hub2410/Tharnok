export class Device {
    public static isAndroid(): boolean {
        return /Android/i.test(navigator.userAgent)
    }

    public static isMobile(): boolean {
        return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    }
}