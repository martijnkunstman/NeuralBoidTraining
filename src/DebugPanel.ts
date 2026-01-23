import { Sensor } from './Boid';

export class DebugPanel {
    private element: HTMLDivElement;
    private sensorRow: HTMLDivElement;
    private inputRow: HTMLDivElement;
    private pauseBtn: HTMLButtonElement;
    private onPauseToggle: () => void;
    private isPaused: boolean = false;

    constructor(onPauseToggle: () => void) {
        this.onPauseToggle = onPauseToggle;

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
        this.element.style.minWidth = '300px';

        // Header + Pause Button
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.marginBottom = '10px';

        const title = document.createElement('span');
        title.innerText = 'DEBUG DATA';
        title.style.color = '#4facfe';
        title.style.fontWeight = 'bold';

        this.pauseBtn = document.createElement('button');
        this.pauseBtn.innerText = 'PAUSE';
        this.pauseBtn.style.background = '#ff4b2b';
        this.pauseBtn.style.border = 'none';
        this.pauseBtn.style.color = 'white';
        this.pauseBtn.style.padding = '2px 8px';
        this.pauseBtn.style.borderRadius = '4px';
        this.pauseBtn.style.cursor = 'pointer';
        this.pauseBtn.onclick = () => this.togglePause();

        header.appendChild(title);
        header.appendChild(this.pauseBtn);
        this.element.appendChild(header);

        // Sensor Row
        this.element.appendChild(document.createTextNode('SENSORS (21):'));
        this.sensorRow = document.createElement('div');
        this.sensorRow.style.marginBottom = '10px';
        this.sensorRow.style.marginTop = '2px';
        this.sensorRow.style.wordBreak = 'break-all';
        this.sensorRow.style.color = '#aaa';
        this.element.appendChild(this.sensorRow);

        // Input Row
        this.element.appendChild(document.createTextNode('NEURAL INPUTS (14):'));
        this.inputRow = document.createElement('div');
        this.inputRow.style.marginTop = '2px';
        this.inputRow.style.wordBreak = 'break-all';
        this.inputRow.style.color = '#aaa';
        this.element.appendChild(this.inputRow);

        document.body.appendChild(this.element);
    }

    private togglePause(): void {
        this.isPaused = !this.isPaused;
        this.pauseBtn.innerText = this.isPaused ? 'RESUME' : 'PAUSE';
        this.pauseBtn.style.background = this.isPaused ? '#4facfe' : '#ff4b2b';
        this.onPauseToggle();
    }

    update(sensors: Sensor[], inputs: number[]): void {
        // Update Sensor Text
        const sensorValues = sensors.map(s => s.reading.toFixed(2));
        this.sensorRow.innerText = sensorValues.join(', ');

        // Update Input Text
        const inputValues = inputs.map(v => v.toFixed(2));
        this.inputRow.innerText = inputValues.join(', ');
    }
}
