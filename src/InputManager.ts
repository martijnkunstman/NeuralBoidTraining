export class InputManager {
    private keys: Record<string, boolean> = {};

    constructor() {
        window.addEventListener('keydown', (e) => this.keys[e.key.toLowerCase()] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key.toLowerCase()] = false);
    }

    isKeyPressed(key: string): boolean {
        return this.keys[key.toLowerCase()] || false;
    }
}
