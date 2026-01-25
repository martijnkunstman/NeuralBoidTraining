import { Panel } from './Panel';

export class DebugPanel extends Panel {
    private pauseBtn!: HTMLButtonElement;
    private onPauseToggle: () => void;
    private isPaused: boolean = false;

    private resetBtn!: HTMLButtonElement;
    private onReset: () => void;

    private trainInput!: HTMLInputElement;
    private trainBtn!: HTMLButtonElement;
    private onFastTrain: (gens: number) => void;

    constructor(onPauseToggle: () => void, onReset: () => void, onFastTrain: (gens: number) => void) {
        super('Simulation Control', 'top-left', '280px');

        this.onPauseToggle = onPauseToggle;
        this.onReset = onReset;
        this.onFastTrain = onFastTrain;

        this.setupControls();
        // Stats text removed as requested
    }

    private genStat!: HTMLElement;
    private timerStat!: HTMLElement;
    private aliveStat!: HTMLElement;
    private scoreStat!: HTMLElement;

    private setupControls(): void {
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.flexDirection = 'column';
        controls.style.gap = '8px';
        controls.style.marginBottom = '0'; // align bottom

        // Stats Section
        const statsCtn = document.createElement('div');
        statsCtn.style.background = 'rgba(0,0,0,0.3)';
        statsCtn.style.padding = '8px';
        statsCtn.style.borderRadius = '4px';
        statsCtn.style.marginBottom = '10px';
        statsCtn.style.fontSize = '12px';
        statsCtn.style.fontFamily = 'monospace';
        statsCtn.style.color = '#00ff88';

        this.genStat = document.createElement('div');
        this.timerStat = document.createElement('div');
        this.aliveStat = document.createElement('div');
        this.scoreStat = document.createElement('div');

        statsCtn.appendChild(this.genStat);
        statsCtn.appendChild(this.timerStat);
        statsCtn.appendChild(this.aliveStat);
        statsCtn.appendChild(this.scoreStat);

        controls.appendChild(statsCtn);

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

    private togglePause(): void {
        this.isPaused = !this.isPaused;
        this.pauseBtn.innerText = this.isPaused ? 'RESUME' : 'PAUSE';
        this.onPauseToggle();
    }

    update(generation: number, aliveCount: number, currentBest: number, _allTimeBest: number, timeRemaining: number, _totalTime: number): void {
        this.genStat.innerText = `Generation:  ${generation}`;
        this.timerStat.innerText = `Time Left:   ${timeRemaining.toFixed(1)}s`;
        this.aliveStat.innerText = `Alive:       ${aliveCount}`;
        this.scoreStat.innerText = `Best Score:  ${currentBest.toFixed(2)}`;
    }
}
