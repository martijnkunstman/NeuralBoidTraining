import { Panel } from './Panel';

export class StatsPanel extends Panel {
    private leftStat: HTMLElement;
    private rightStat: HTMLElement;
    private velStat: HTMLElement;
    private rotStat: HTMLElement;
    private foodStat: HTMLElement;
    private poisonStat: HTMLElement;
    private collectedStat: HTMLElement;

    constructor(seed: number, foodCount: number, poisonCount: number) {
        super('Boid Systems', 'top-left', '260px');
        this.element.style.display = 'none';

        this.createRow('Seed:', seed.toString());
        this.addSeparator();

        this.leftStat = this.createRow('Left Thruster:', '0%');
        this.rightStat = this.createRow('Right Thruster:', '0%');
        this.velStat = this.createRow('Velocity:', '0');
        this.rotStat = this.createRow('Rotation Power:', '0');

        this.addSeparator();

        this.foodStat = this.createRow('Food:', foodCount.toString());
        this.poisonStat = this.createRow('Poison:', poisonCount.toString());
        this.collectedStat = this.createRow('Collected:', '0'); // Simplified label

        // Controls hint
        const hint = document.createElement('div');
        hint.style.marginTop = '10px';
        hint.style.fontSize = '10px';
        hint.style.opacity = '0.5';
        hint.innerText = 'Q/A: Left | W/S: Right';
        this.content.appendChild(hint);
    }

    private addSeparator(): void {
        const sep = document.createElement('div');
        sep.style.height = '1px';
        sep.style.background = 'rgba(255, 255, 255, 0.1)';
        sep.style.margin = '8px 0';
        this.content.appendChild(sep);
    }

    updateStats(
        leftThruster: number,
        rightThruster: number,
        velocity: { x: number, y: number },
        angularVelocity: number,
        foodCount: number,
        poisonCount: number,
        foodCollected: number, // used as gen/time sometimes?
        poisonCollected: number
    ): void {
        this.leftStat.innerText = `${Math.round(leftThruster)}%`;
        this.rightStat.innerText = `${Math.round(rightThruster)}%`;

        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        const angle = Math.round(Math.atan2(velocity.y, velocity.x) * 180 / Math.PI);
        this.velStat.innerText = `${Math.round(speed)} | ${angle}°`;

        this.rotStat.innerText = angularVelocity.toFixed(2);
        this.foodStat.innerText = foodCount.toString();
        this.poisonStat.innerText = poisonCount.toString();

        // Handling the "overloaded" meaning from Game.ts (Gen / Time) or actual collected
        // Ideally we should fix the interface, but for now just display what's passed
        // In Game.ts it passes: Gen, Time, Score, 0
        // Let's just switch to displaying raw text if we want flexibility or stick to the contract.
        // The original HUD text was: `Collected: ${foodCollected} food, ${poisonCollected} poison`
        // But Game.ts actually sends gen/time/score there.
        // Let's fix this in Game.ts later to be cleaner, but for now render as is:
        this.collectedStat.innerText = `${foodCollected} / ${poisonCollected}`;
    }

    // Helper to update specific fields if we want cleaner API later
    updateEnvironment(food: number, poison: number): void {
        this.foodStat.innerText = food.toString();
        this.poisonStat.innerText = poison.toString();
    }
}
