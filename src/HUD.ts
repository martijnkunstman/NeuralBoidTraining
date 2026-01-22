export class HUD {
    private element: HTMLDivElement;
    private leftStat: HTMLElement;
    private rightStat: HTMLElement;
    private velStat: HTMLElement;
    private rotStat: HTMLElement;
    private foodStat: HTMLElement;
    private poisonStat: HTMLElement;

    private collectedStat: HTMLElement;
    private trainingStat: HTMLElement;

    constructor(seed: number, foodCount: number, poisonCount: number) {
        this.element = document.createElement('div');
        this.element.style.position = 'absolute';
        this.element.style.top = '20px';
        this.element.style.left = '20px';
        this.element.style.padding = '20px';
        this.element.style.background = 'rgba(0, 0, 0, 0.7)';
        this.element.style.borderRadius = '12px';
        this.element.style.backdropFilter = 'blur(10px)';
        this.element.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        this.element.style.pointerEvents = 'none';
        this.element.style.fontSize = '14px';
        this.element.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold; color: #4facfe;">BOID SYSTEMS</div>
            <div id="seed-stat">Seed: ${seed}</div>
            <div style="margin-top: 8px; opacity: 0.7;">---</div>
            <div id="left-stat">Left Thruster: 0</div>
            <div id="right-stat">Right Thruster: 0</div>
            <div id="vel-stat">Velocity: 0</div>
            <div id="rot-stat">Rotation Power: 0</div>
            <div style="margin-top: 8px; opacity: 0.7;">---</div>
            <div id="food-stat">Food: ${foodCount}</div>
            <div id="poison-stat">Poison: ${poisonCount}</div>
            <div id="collected-stat">Collected: 0 food, 0 poison</div>
            <div style="margin-top: 8px; opacity: 0.7;">---</div>
            <div id="training-stat">Mode: Manual | Gen: 0 | Best: 0</div>
            <div style="margin-top: 10px; opacity: 0.6; font-size: 12px;">Q/A: Left | W/S: Right | T: Auto Mode</div>
            <button id="reset-btn" style="
                margin-top: 15px;
                width: 100%;
                background: #ff4b2b;
                color: white;
                border: none;
                padding: 8px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                pointer-events: auto;
                transition: opacity 0.2s;
            " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">RESET EVOLUTION</button>
        `;
        document.body.appendChild(this.element);

        document.getElementById('reset-btn')!.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all evolution progress?')) {
                localStorage.clear();
                window.location.reload();
            }
        });

        this.leftStat = document.getElementById('left-stat')!;
        this.rightStat = document.getElementById('right-stat')!;
        this.velStat = document.getElementById('vel-stat')!;
        this.rotStat = document.getElementById('rot-stat')!;
        this.foodStat = document.getElementById('food-stat')!;
        this.poisonStat = document.getElementById('poison-stat')!;
        this.collectedStat = document.getElementById('collected-stat')!;
        this.trainingStat = document.getElementById('training-stat')!;
    }

    updateStats(
        leftThruster: number,
        rightThruster: number,
        velocity: { x: number, y: number },
        angularVelocity: number,
        foodCount: number,
        poisonCount: number,
        foodCollected: number,
        poisonCollected: number,
        trainMode: boolean,
        generation: number,
        maxFitness: number,
        currentScore: number
    ): void {
        this.leftStat.innerText = `Left Thruster: ${Math.round(leftThruster)}%`;
        this.rightStat.innerText = `Right Thruster: ${Math.round(rightThruster)}%`;

        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        const angle = Math.round(Math.atan2(velocity.y, velocity.x) * 180 / Math.PI);
        this.velStat.innerText = `Velocity: ${Math.round(speed)} | Angle: ${angle}°`;

        this.rotStat.innerText = `Rotation Power: ${angularVelocity.toFixed(2)}`;
        this.foodStat.innerText = `Food: ${foodCount}`;
        this.poisonStat.innerText = `Poison: ${poisonCount}`;
        this.collectedStat.innerText = `Collected: ${foodCollected} food, ${poisonCollected} poison`;

        this.trainingStat.innerText = `Mode: ${trainMode ? 'AUTO' : 'MANUAL'} | Gen: ${generation} | Score: ${currentScore} | Best: ${maxFitness}`;
        if (trainMode) {
            this.trainingStat.style.color = '#00ff00';
        } else {
            this.trainingStat.style.color = '#ffffff';
        }
    }
}
