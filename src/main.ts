import './style.css';
import { Game } from './Game';
import { ConsolePanel } from './ConsolePanel';

async function run() {
    // Initialize console panel first to capture all logs
    new ConsolePanel();

    console.log('Starting boid simulation...');

    // Dynamic import is the most compatible way for Rapier in Vite
    const RAPIER = await import('@dimforge/rapier2d-compat');

    // Check if we need to call init.
    if ((RAPIER as any).init) {
        await (RAPIER as any).init();
    }

    console.log('RAPIER module ready');

    // Create and start the game
    const game = new Game(RAPIER);
    game.start();
}

run().catch(console.error);

