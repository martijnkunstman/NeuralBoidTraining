declare module 'brain.js' {
    export class NeuralNetwork {
        constructor(options?: any);
        train(data: any[], options?: any): any;
        run(input: any[]): any[];
        toJSON(): any;
        fromJSON(json: any): void;
    }
}
