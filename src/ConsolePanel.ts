import { Panel } from './Panel';

/**
 * Console Panel - Displays console.log output on screen
 * Shows last 100 lines with auto-scroll
 */
export class ConsolePanel extends Panel {
    private lines: string[] = [];
    private readonly MAX_LINES = 100;
    private originalConsoleLog: (...args: any[]) => void;

    constructor() {
        super('Console Output', 'bottom-center', '600px', '200px');

        // Intercept console.log
        this.originalConsoleLog = console.log.bind(console);
        console.log = (...args: any[]) => {
            this.originalConsoleLog(...args);
            this.addLine(args.map(a => this.stringify(a)).join(' '));
        };

        // Also intercept console.warn and console.error
        const originalWarn = console.warn.bind(console);
        console.warn = (...args: any[]) => {
            originalWarn(...args);
            this.addLine('[WARN] ' + args.map(a => this.stringify(a)).join(' '), '#ffaa00');
        };

        const originalError = console.error.bind(console);
        console.error = (...args: any[]) => {
            originalError(...args);
            this.addLine('[ERROR] ' + args.map(a => this.stringify(a)).join(' '), '#ff4444');
        };
    }

    private stringify(value: any): string {
        if (typeof value === 'string') return value;
        if (typeof value === 'number' || typeof value === 'boolean') return String(value);
        try {
            return JSON.stringify(value);
        } catch {
            return String(value);
        }
    }

    private addLine(text: string, color: string = '#00ff00'): void {
        // Add timestamp
        const now = new Date();
        const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        this.lines.push(`<span style="color:#666">[${timestamp}]</span> <span style="color:${color}">${this.escapeHtml(text)}</span>`);

        // Keep only last MAX_LINES
        if (this.lines.length > this.MAX_LINES) {
            this.lines.shift();
        }

        // Update display
        this.content.innerHTML = this.lines.join('<br>');

        // Auto-scroll to bottom
        this.content.scrollTop = this.content.scrollHeight;
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
