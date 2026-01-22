import brain from 'brain.js';

export class Brain {
    private network: brain.NeuralNetwork;
    private inputSize: number;
    private hiddenSize: number;
    private outputSize: number;
    public lastInputs: number[] = [];

    constructor(inputSize: number, hiddenSize: number, outputSize: number, network?: brain.NeuralNetwork) {
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;

        if (network) {
            this.network = network;
        } else {
            this.network = new brain.NeuralNetwork({
                inputSize: this.inputSize,
                hiddenLayers: [this.hiddenSize, this.hiddenSize],
                outputSize: this.outputSize,
                activation: 'sigmoid'
            });
            // Initialize with random weights if needed, but brain.js usually does this on train.
            // However, we are not using backprop training, we are using GA. 
            // We need to initialize it. A simple 'train' with 1 sample might work, or just let it be.
            // brain.js requires training to set weights usually. 
            // Actually, for GA, we usually manually set weights or use a library that supports it.
            // brain.js might be tricky for direct weight manipulation without 'toJSON' / 'fromJSON'.
            // Let's force an initialization.
            // Force initialization
            // Force initialization with randomish values so weights aren't all zero
            const dummyInput = new Array(inputSize).fill(0).map(() => Math.random());
            const dummyOutput = new Array(outputSize).fill(0).map(() => Math.random());
            this.network.train([{ input: dummyInput, output: dummyOutput }], { iterations: 1 });
        }
    }

    predict(inputs: number[]): number[] {
        return this.network.run(inputs) as number[];
    }

    mutate(rate: number, amount: number): void {
        const json = this.network.toJSON();

        // Mutate weights
        if (json.layers) {
            this.mutateLayers(json.layers, rate, amount);
        }

        this.network = new brain.NeuralNetwork({
            inputSize: this.inputSize,
            hiddenLayers: [this.hiddenSize, this.hiddenSize],
            outputSize: this.outputSize,
            activation: 'sigmoid'
        });
        this.network.fromJSON(json);
    }

    private mutateLayers(layers: any[], rate: number, amount: number): void {
        for (const layer of layers) {
            if (layer.weights) {
                for (const nodeKey in layer.weights) {
                    const weights = layer.weights[nodeKey];
                    for (const k in weights) {
                        if (Math.random() < rate) {
                            weights[k] += (Math.random() * 2 - 1) * amount;
                            // Clamp weights? simplified: keep them unbounded or loose
                            if (weights[k] > 10) weights[k] = 10;
                            if (weights[k] < -10) weights[k] = -10;
                        }
                    }
                }
            }
            if (layer.biases) {
                for (const k in layer.biases) {
                    if (Math.random() < rate) {
                        layer.biases[k] += (Math.random() * 2 - 1) * amount;
                        if (layer.biases[k] > 10) layer.biases[k] = 10;
                        if (layer.biases[k] < -10) layer.biases[k] = -10;
                    }
                }
            }
        }
    }

    copy(): Brain {
        const json = this.network.toJSON();
        const newNet = new brain.NeuralNetwork({
            inputSize: this.inputSize,
            hiddenLayers: [this.hiddenSize, this.hiddenSize],
            outputSize: this.outputSize,
            activation: 'sigmoid'
        });
        newNet.fromJSON(json);
        return new Brain(this.inputSize, this.hiddenSize, this.outputSize, newNet);
    }

    getNetwork(): brain.NeuralNetwork {
        return this.network;
    }
}
