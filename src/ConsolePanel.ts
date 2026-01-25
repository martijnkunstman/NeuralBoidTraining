/**
 * Console Panel - Displays console.log output on screen
 * Shows last 100 lines with auto-scroll
 */
export class ConsolePanel {
    private element: HTMLDivElement;
    private content: HTMLDivElement;
    private lines: string[] = [];
    private readonly MAX_LINES = 100;
    private originalConsoleLog: (...args: any[]) => void;

    constructor() {
        // Create container
        this.element = document.createElement('div');
        this.element.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 600px;
            height: 150px;
            background: rgba(0, 0, 0, 0.85);
            border: 1px solid #333;
            border-radius: 8px;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 11px;
            color: #00ff00;
            z-index: 1000;
            display: flex;
            flex-direction: column;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 6px 10px;
            background: rgba(255, 255, 255, 0.1);
            border-bottom: 1px solid #333;
            font-weight: bold;
            color: #888;
            flex-shrink: 0;
        `;
        header.textContent = '📋 Console Output';
        this.element.appendChild(header);

        // Scrollable content area
        this.content = document.createElement('div');
        this.content.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 8px 10px;
            scroll-behavior: smooth;
        `;
        this.element.appendChild(this.content);

        document.body.appendChild(this.element);

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
