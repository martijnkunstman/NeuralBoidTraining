import { Panel } from './Panel';

export class DebugPanel extends Panel {
    private genRow: HTMLElement;
    private aliveRow: HTMLElement;
    private scoreRow: HTMLElement;
    private highScoreRow: HTMLElement;
    private timeRow: HTMLElement;
    private totalTimeRow: HTMLElement;

    private pauseBtn!: HTMLButtonElement;
    private onPauseToggle: () => void;
    private isPaused: boolean = false;

    private resetBtn!: HTMLButtonElement;
    private onReset: () => void;

    private trainInput!: HTMLInputElement;
    private trainBtn!: HTMLButtonElement;
    private onFastTrain: (gens: number) => void;

    constructor(onPauseToggle: () => void, onReset: () => void, onFastTrain: (gens: number) => void) {
        super('Simulation Control', 'bottom-right', '280px');

        this.onPauseToggle = onPauseToggle;
        this.onReset = onReset;
        this.onFastTrain = onFastTrain;

        this.setupControls();
        this.addSeparator();

        this.genRow = this.createRow('Generation:', '0');
        this.aliveRow = this.createRow('Alive:', '0');
        this.scoreRow = this.createRow('Current Best:', '0.00');
        this.scoreRow.style.color = '#ffcc00';
        this.highScoreRow = this.createRow('High Score:', '0.00');
        this.highScoreRow.style.color = '#ffa500';

        this.addSeparator();

        this.timeRow = this.createRow('Gen Time:', '0.0s');
        this.totalTimeRow = this.createRow('Total Time:', '0:00');
    }

    private setupControls(): void {
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.flexDirection = 'column';
        controls.style.gap = '8px';
        controls.style.marginBottom = '10px';

        // Row 1: Pause & Reset
        const btnRow = document.createElement('div');
        btnRow.style.display = 'flex';
        btnRow.style.gap = '5px';

        this.pauseBtn = document.createElement('button');
        this.pauseBtn.innerText = 'PAUSE';
        this.pauseBtn.className = 'panel-btn';
        this.pauseBtn.style.flex = '1';
        this.pauseBtn.onclick = () => this.togglePause();

        this.resetBtn = document.createElement('button');
        this.resetBtn.innerText = 'RESET';
        this.resetBtn.className = 'panel-btn';
        this.resetBtn.style.flex = '1';
        this.resetBtn.style.color = '#ff8888';
        this.resetBtn.style.borderColor = '#ff8888';
        this.resetBtn.onclick = () => {
            if (confirm('Reset training? Data will be lost.')) {
                this.onReset();
            }
        };

        btnRow.appendChild(this.pauseBtn);
        btnRow.appendChild(this.resetBtn);
        controls.appendChild(btnRow);

        // Row 2: Fast Train
        const trainRow = document.createElement('div');
        trainRow.style.display = 'flex';
        trainRow.style.gap = '5px';

        this.trainInput = document.createElement('input');
        this.trainInput.type = 'number';
        this.trainInput.value = '5';
        this.trainInput.className = 'panel-input';
        this.trainInput.style.width = '50px';

        this.trainBtn = document.createElement('button');
        this.trainBtn.innerText = 'FAST TRAIN';
        this.trainBtn.className = 'panel-btn';
        this.trainBtn.style.flex = '1';
        this.trainBtn.onclick = () => {
            const gens = parseInt(this.trainInput.value) || 1;
            this.trainBtn.disabled = true;
            this.trainBtn.innerText = 'TRAINING...';
            setTimeout(() => {
                this.onFastTrain(gens);
                this.trainBtn.disabled = false;
                this.trainBtn.innerText = 'FAST TRAIN';
            }, 50);
        };

        trainRow.appendChild(this.trainInput);
        trainRow.appendChild(this.trainBtn);
        controls.appendChild(trainRow);

        this.content.appendChild(controls);
    }

    private addSeparator(): void {
        const sep = document.createElement('div');
        sep.style.height = '1px';
        sep.style.background = 'rgba(255, 255, 255, 0.1)';
        sep.style.margin = '8px 0';
        this.content.appendChild(sep);
    }

    private togglePause(): void {
        this.isPaused = !this.isPaused;
        this.pauseBtn.innerText = this.isPaused ? 'RESUME' : 'PAUSE';
        this.onPauseToggle();
    }

    update(generation: number, aliveCount: number, currentBest: number, allTimeBest: number, genTime: number, totalTime: number): void {
        this.genRow.innerText = generation.toString();
        this.aliveRow.innerText = aliveCount.toString();
        this.scoreRow.innerText = currentBest.toFixed(2);
        this.highScoreRow.innerText = allTimeBest.toFixed(2);
        this.timeRow.innerText = genTime.toFixed(1) + 's';

        const m = Math.floor(totalTime / 60);
        const s = Math.floor(totalTime % 60);
        this.totalTimeRow.innerText = `${m}:${s.toString().padStart(2, '0')}`;
    }
}
