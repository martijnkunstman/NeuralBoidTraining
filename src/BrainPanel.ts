import { Panel } from './Panel';
import { NeuralNetwork } from './NeuralNetwork';

export class BrainPanel extends Panel {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private width: number = 250;
    private height: number = 180;

    constructor() {
        super('Neural Network', 'bottom-left', 'auto');

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.display = 'block';
        this.canvas.style.background = 'rgba(0,0,0,0.3)';

        this.content.appendChild(this.canvas);
        this.content.style.padding = '0'; // Maximize space

        this.ctx = this.canvas.getContext('2d')!;
    }

    draw(brain: NeuralNetwork): void {
        if (this.isCollapsed) return;

        const w = this.width;
        const h = this.height;

        this.ctx.clearRect(0, 0, w, h);


        const layerGap = w * 0.4; // Spread out layers
        const startX = w * 0.1;

        // Positions
        const inputX = startX;
        const hiddenX = startX + layerGap;
        const outputX = startX + layerGap * 2;

        const inputStepY = h / (brain.inputNodes + 1);
        const hiddenStepY = h / (brain.hiddenNodes + 1);
        const outputStepY = h / (brain.outputNodes + 1);

        // Draw Weights
        // Input -> Hidden
        for (let i = 0; i < brain.inputNodes; i++) {
            const sourceVal = brain.lastInput[i] || 0;
            for (let j = 0; j < brain.hiddenNodes; j++) {
                const weight = brain.weightsIH[j][i];
                const iy = (i + 1) * inputStepY;
                const hy = (j + 1) * hiddenStepY;

                this.drawConnection(inputX, iy, hiddenX, hy, weight, sourceVal);
            }
        }

        // Hidden -> Output
        for (let i = 0; i < brain.hiddenNodes; i++) {
            const sourceVal = brain.lastHidden[i] || 0;
            for (let j = 0; j < brain.outputNodes; j++) {
                const weight = brain.weightsHO[j][i];
                const hy = (i + 1) * hiddenStepY;
                const oy = (j + 1) * outputStepY;

                this.drawConnection(hiddenX, hy, outputX, oy, weight, sourceVal);
            }
        }

        // Draw Nodes
        this.drawNodes(inputX, inputStepY, brain.inputNodes, brain.lastInput);
        this.drawNodes(hiddenX, hiddenStepY, brain.hiddenNodes, brain.lastHidden);
        this.drawNodes(outputX, outputStepY, brain.outputNodes, brain.lastOutput);
    }

    private drawConnection(x1: number, y1: number, x2: number, y2: number, weight: number, sourceVal: number) {
        // Calculate "Activity" = Signal strength
        const signal = weight * sourceVal;

        // Structure visibility (weight only) - faint backup
        // Activity visibility (signal) - bright

        // We want to see the structure faintly, but active paths brightly.
        const baseAlpha = Math.min(Math.abs(weight) * 0.1, 0.2); // Faint structure
        const activityAlpha = Math.min(Math.abs(signal), 1.0);   // Bright activity

        const alpha = Math.max(baseAlpha, activityAlpha);

        if (alpha < 0.05) return; // Cull invisible

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);

        // Color based on Weight sign
        this.ctx.strokeStyle = weight > 0
            ? `rgba(0, 255, 136, ${alpha})`
            : `rgba(255, 68, 68, ${alpha})`;

        // Thin lines as requested
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    private drawNodes(x: number, stepY: number, count: number, values: number[] | Float32Array) {
        const nodeRadius = 4; // Moved locally or use class const if preferred
        for (let i = 0; i < count; i++) {
            const y = (i + 1) * stepY;
            const val = values[i] || 0;

            this.ctx.beginPath();
            this.ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);

            // Activation intensity
            const intensity = Math.min(Math.abs(val), 1);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.8 + 0.2})`;
            this.ctx.fill();

            // Border usually white or simplified
            // this.ctx.strokeStyle = '#fff';
            // this.ctx.stroke();
        }
    }
}
