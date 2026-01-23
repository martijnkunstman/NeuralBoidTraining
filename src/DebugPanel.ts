// Sensor import removed (unused)

export class DebugPanel {
    private element: HTMLDivElement;
    private genRow: HTMLSpanElement;
    private aliveRow: HTMLSpanElement;
    private scoreRow: HTMLSpanElement;
    private timeRow: HTMLSpanElement;

    private pauseBtn: HTMLButtonElement;
    private onPauseToggle: () => void;
    private isPaused: boolean = false;

    private resetBtn: HTMLButtonElement;
    private onReset: () => void;

    constructor(onPauseToggle: () => void, onReset: () => void) {
        this.onPauseToggle = onPauseToggle;
        this.onReset = onReset;

        this.element = document.createElement('div');
        this.element.style.position = 'absolute';
        this.element.style.bottom = '20px';
        this.element.style.right = '20px';
        this.element.style.padding = '15px';
        this.element.style.background = 'rgba(0, 0, 0, 0.8)';
        this.element.style.borderRadius = '8px';
        this.element.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        this.element.style.color = '#fff';
        this.element.style.fontFamily = 'monospace';
        this.element.style.fontSize = '12px';
        this.element.style.minWidth = '250px';

        // Header + Buttons
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '10px';

        const title = document.createElement('span');
        title.innerText = 'STATUS';
        title.style.color = '#4facfe';
        title.style.fontWeight = 'bold';

        const buttonGroup = document.createElement('div');
        buttonGroup.style.display = 'flex';
        buttonGroup.style.gap = '5px';

        this.pauseBtn = document.createElement('button');
        this.pauseBtn.innerText = 'PAUSE';
        this.pauseBtn.style.background = '#ff4b2b';
        this.pauseBtn.style.border = 'none';
        this.pauseBtn.style.color = 'white';
        this.pauseBtn.style.padding = '2px 8px';
        this.pauseBtn.style.borderRadius = '4px';
        this.pauseBtn.style.cursor = 'pointer';
        this.pauseBtn.onclick = () => this.togglePause();

        this.resetBtn = document.createElement('button');
        this.resetBtn.innerText = 'RESET';
        this.resetBtn.style.background = '#aa0000';
        this.resetBtn.style.border = 'none';
        this.resetBtn.style.color = 'white';
        this.resetBtn.style.padding = '2px 8px';
        this.resetBtn.style.borderRadius = '4px';
        this.resetBtn.style.cursor = 'pointer';
        this.resetBtn.onclick = () => {
            if (confirm('Are you sure you want to reset training? This will clear saved data.')) {
                this.onReset();
            }
        };

        buttonGroup.appendChild(this.pauseBtn);
        buttonGroup.appendChild(this.resetBtn);

        header.appendChild(title);
        header.appendChild(buttonGroup);
        this.element.appendChild(header);

        // Helper to create row
        const createRow = (label: string, color: string = '#aaa') => {
            const row = document.createElement('div');
            row.style.marginBottom = '5px';
            row.style.display = 'flex';
            row.style.justifyContent = 'space-between';

            const labelSpan = document.createElement('span');
            labelSpan.innerText = label;
            labelSpan.style.color = color;

            const valueSpan = document.createElement('span');
            valueSpan.style.fontWeight = 'bold';

            row.appendChild(labelSpan);
            row.appendChild(valueSpan);
            this.element.appendChild(row);
            return valueSpan;
        };

        this.genRow = createRow('Generation:', '#4facfe');
        this.aliveRow = createRow('Alive:', '#00ff88');
        this.scoreRow = createRow('Best Score:', '#ffcc00');
        this.timeRow = createRow('Time:', '#ff4444');

        document.body.appendChild(this.element);
    }

    private togglePause(): void {
        this.isPaused = !this.isPaused;
        this.pauseBtn.innerText = this.isPaused ? 'RESUME' : 'PAUSE';
        this.pauseBtn.style.background = this.isPaused ? '#4facfe' : '#ff4b2b';
        this.onPauseToggle();
    }

    update(generation: number, aliveCount: number, bestScore: number, time: number): void {
        this.genRow.innerText = generation.toString();
        this.aliveRow.innerText = aliveCount.toString();
        this.scoreRow.innerText = bestScore.toFixed(2);
        this.timeRow.innerText = time.toFixed(1) + 's';
    }
}
