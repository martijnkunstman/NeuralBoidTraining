// Sensor import removed (unused)

export class DebugPanel {
    private element: HTMLDivElement;
    private genRow: HTMLSpanElement;
    private aliveRow: HTMLSpanElement;
    private scoreRow: HTMLSpanElement;
    private highScoreRow: HTMLSpanElement;
    private timeRow: HTMLSpanElement;
    private totalTimeRow: HTMLSpanElement;

    private pauseBtn: HTMLButtonElement;
    private onPauseToggle: () => void;
    private isPaused: boolean = false;

    private resetBtn: HTMLButtonElement;
    private onReset: () => void;

    private trainInput: HTMLInputElement;
    private trainBtn: HTMLButtonElement;
    private onFastTrain: (gens: number) => void;

    constructor(onPauseToggle: () => void, onReset: () => void, onFastTrain: (gens: number) => void) {
        this.onPauseToggle = onPauseToggle;
        this.onReset = onReset;
        this.onFastTrain = onFastTrain;

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

        // Fast Train Controls
        const trainRow = document.createElement('div');
        trainRow.style.marginBottom = '10px';
        trainRow.style.display = 'flex';
        trainRow.style.gap = '5px';

        this.trainInput = document.createElement('input');
        this.trainInput.type = 'number';
        this.trainInput.value = '5';
        this.trainInput.style.width = '40px';
        this.trainInput.style.background = '#333';
        this.trainInput.style.border = '1px solid #555';
        this.trainInput.style.color = 'white';
        this.trainInput.style.padding = '2px';
        this.trainInput.style.borderRadius = '4px';

        this.trainBtn = document.createElement('button');
        this.trainBtn.innerText = 'FAST TRAIN';
        this.trainBtn.style.background = '#8800ff';
        this.trainBtn.style.border = 'none';
        this.trainBtn.style.color = 'white';
        this.trainBtn.style.padding = '2px 8px';
        this.trainBtn.style.borderRadius = '4px';
        this.trainBtn.style.cursor = 'pointer';
        this.trainBtn.style.flexGrow = '1';
        this.trainBtn.onclick = () => {
            const gens = parseInt(this.trainInput.value) || 1;
            this.trainBtn.disabled = true;
            this.trainBtn.innerText = 'TRAINING...';
            // Allow UI to update before locking up
            setTimeout(() => {
                this.onFastTrain(gens);
                this.trainBtn.disabled = false;
                this.trainBtn.innerText = 'FAST TRAIN';
            }, 50);
        };

        trainRow.appendChild(this.trainInput);
        trainRow.appendChild(this.trainBtn);
        this.element.appendChild(trainRow);

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
        this.scoreRow = createRow('Current Best:', '#ffcc00');
        this.highScoreRow = createRow('High Score:', '#ffa500');
        this.timeRow = createRow('Gen Time:', '#ff4444');
        this.totalTimeRow = createRow('Total Time:', '#ffffff');

        document.body.appendChild(this.element);
    }

    private togglePause(): void {
        this.isPaused = !this.isPaused;
        this.pauseBtn.innerText = this.isPaused ? 'RESUME' : 'PAUSE';
        this.pauseBtn.style.background = this.isPaused ? '#4facfe' : '#ff4b2b';
        this.onPauseToggle();
    }

    update(generation: number, aliveCount: number, currentBest: number, allTimeBest: number, genTime: number, totalTime: number): void {
        this.genRow.innerText = generation.toString();
        this.aliveRow.innerText = aliveCount.toString();
        this.scoreRow.innerText = currentBest.toFixed(2);
        this.highScoreRow.innerText = allTimeBest.toFixed(2);
        this.timeRow.innerText = genTime.toFixed(1) + 's';

        // Format total time mm:ss
        const m = Math.floor(totalTime / 60);
        const s = Math.floor(totalTime % 60);
        this.totalTimeRow.innerText = `${m}:${s.toString().padStart(2, '0')}`;
    }
}
