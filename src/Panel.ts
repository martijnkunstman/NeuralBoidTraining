export type PanelPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'bottom-center';

export class Panel {
    protected element: HTMLDivElement;
    protected content: HTMLDivElement;
    private toggleBtn: HTMLSpanElement;
    protected isCollapsed: boolean = false;

    constructor(title: string, position: PanelPosition, width: string = '300px', height: string = 'auto') {
        this.element = document.createElement('div');
        this.element.className = `game-panel panel-${position}`;
        this.element.style.width = width;
        if (height !== 'auto') {
            this.element.style.height = height;
        }

        // Header
        const header = document.createElement('div');
        header.className = 'panel-header';

        const titleSpan = document.createElement('div');
        titleSpan.className = 'panel-title';
        titleSpan.innerHTML = `<span>${title}</span>`;

        this.toggleBtn = document.createElement('span');
        this.toggleBtn.className = 'panel-toggle';
        this.toggleBtn.innerHTML = '−'; // Minus sign

        header.appendChild(titleSpan);
        header.appendChild(this.toggleBtn);
        header.onclick = () => this.toggleCollapse();

        this.element.appendChild(header);

        // Content
        this.content = document.createElement('div');
        this.content.className = 'panel-content';
        this.element.appendChild(this.content);

        document.body.appendChild(this.element);
    }

    private toggleCollapse(): void {
        this.isCollapsed = !this.isCollapsed;
        this.element.classList.toggle('collapsed', this.isCollapsed);
        this.toggleBtn.innerHTML = this.isCollapsed ? '+' : '−';
    }

    // Helper to add rows cleanly
    protected createRow(label: string, initialValue: string = ''): HTMLElement {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.marginBottom = '2px'; // Tighter spacing

        const labelSpan = document.createElement('span');
        labelSpan.style.opacity = '0.7';
        labelSpan.innerText = label;

        const valueSpan = document.createElement('span');
        valueSpan.style.fontWeight = 'bold';
        valueSpan.innerText = initialValue;

        row.appendChild(labelSpan);
        row.appendChild(valueSpan);
        this.content.appendChild(row);

        return valueSpan;
    }
}
