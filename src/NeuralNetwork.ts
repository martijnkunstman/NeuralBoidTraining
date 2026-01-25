
export class NeuralNetwork {
    inputNodes: number;
    hiddenNodes: number;
    outputNodes: number;

    weightsIH: Float32Array[]; // Weights Input -> Hidden
    weightsHO: Float32Array[]; // Weights Hidden -> Output

    biasH: Float32Array; // Bias Hidden
    biasO: Float32Array; // Bias Output

    // State for visualization
    lastInput: Float32Array;
    lastHidden: Float32Array;
    lastOutput: Float32Array;

    constructor(inputNodes: number, hiddenNodes: number, outputNodes: number) {
        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodes;
        this.outputNodes = outputNodes;

        this.weightsIH = this.createMatrix(this.hiddenNodes, this.inputNodes);
        this.weightsHO = this.createMatrix(this.outputNodes, this.hiddenNodes);

        this.biasH = new Float32Array(this.hiddenNodes);
        this.biasO = new Float32Array(this.outputNodes);

        this.lastInput = new Float32Array(this.inputNodes);
        this.lastHidden = new Float32Array(this.hiddenNodes);
        this.lastOutput = new Float32Array(this.outputNodes);

        this.randomize();
    }

    private createMatrix(rows: number, cols: number): Float32Array[] {
        return Array.from({ length: rows }, () => new Float32Array(cols));
    }

    randomize() {
        for (let i = 0; i < this.hiddenNodes; i++) {
            for (let j = 0; j < this.inputNodes; j++) {
                this.weightsIH[i][j] = Math.random() * 2 - 1; // -1 to 1
            }
            this.biasH[i] = Math.random() * 2 - 1;
        }

        for (let i = 0; i < this.outputNodes; i++) {
            for (let j = 0; j < this.hiddenNodes; j++) {
                this.weightsHO[i][j] = Math.random() * 2 - 1; // -1 to 1
            }
            this.biasO[i] = Math.random() * 2 - 1;
        }
    }

    feedForward(inputArray: number[] | Float32Array): Float32Array {
        if (inputArray.length !== this.inputNodes) {
            console.error(`NeuralNetwork: Expected ${this.inputNodes} inputs, got ${inputArray.length}`);
            return this.lastOutput;
        }

        // Reuse arrays, do not allocate new ones
        for (let i = 0; i < this.inputNodes; i++) {
            this.lastInput[i] = inputArray[i];
        }

        // Generating the Hidden Outputs
        for (let i = 0; i < this.hiddenNodes; i++) {
            let sum = 0;
            for (let j = 0; j < this.inputNodes; j++) {
                sum += this.weightsIH[i][j] * this.lastInput[j];
            }
            sum += this.biasH[i];
            this.lastHidden[i] = this.sigmoid(sum);
        }

        // Generating the Output's Output
        for (let i = 0; i < this.outputNodes; i++) {
            let sum = 0;
            for (let j = 0; j < this.hiddenNodes; j++) {
                sum += this.weightsHO[i][j] * this.lastHidden[j];
            }
            sum += this.biasO[i];
            this.lastOutput[i] = this.sigmoid(sum);
        }

        return this.lastOutput;
    }

    sigmoid(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }

    copy(): NeuralNetwork {
        const nn = new NeuralNetwork(this.inputNodes, this.hiddenNodes, this.outputNodes);

        // Manual deep copy for Float32Arrays to ensure speed/independence
        for (let i = 0; i < this.hiddenNodes; i++) {
            nn.weightsIH[i].set(this.weightsIH[i]);
        }
        for (let i = 0; i < this.outputNodes; i++) {
            nn.weightsHO[i].set(this.weightsHO[i]);
        }
        nn.biasH.set(this.biasH);
        nn.biasO.set(this.biasO);

        return nn;
    }

    // Sexual reproduction: Mix weights with another parent
    crossover(partner: NeuralNetwork): NeuralNetwork {
        const child = new NeuralNetwork(this.inputNodes, this.hiddenNodes, this.outputNodes);

        // Turn rate 0.5 = 50% chance from either parent
        const mix = (a: number, b: number) => Math.random() < 0.5 ? a : b;

        for (let i = 0; i < this.hiddenNodes; i++) {
            for (let j = 0; j < this.inputNodes; j++) {
                child.weightsIH[i][j] = mix(this.weightsIH[i][j], partner.weightsIH[i][j]);
            }
            child.biasH[i] = mix(this.biasH[i], partner.biasH[i]);
        }

        for (let i = 0; i < this.outputNodes; i++) {
            for (let j = 0; j < this.hiddenNodes; j++) {
                child.weightsHO[i][j] = mix(this.weightsHO[i][j], partner.weightsHO[i][j]);
            }
            child.biasO[i] = mix(this.biasO[i], partner.biasO[i]);
        }

        return child;
    }

    mutate(rate: number, amount: number) {
        const mutateVal = (val: number) => {
            if (Math.random() < rate) {
                // Tweak weight by a random amount
                return val + (Math.random() * 2 - 1) * amount;
            }
            return val;
        };

        for (let i = 0; i < this.hiddenNodes; i++) {
            for (let j = 0; j < this.inputNodes; j++) {
                this.weightsIH[i][j] = mutateVal(this.weightsIH[i][j]);
            }
            this.biasH[i] = mutateVal(this.biasH[i]);
        }

        for (let i = 0; i < this.outputNodes; i++) {
            for (let j = 0; j < this.hiddenNodes; j++) {
                this.weightsHO[i][j] = mutateVal(this.weightsHO[i][j]);
            }
            this.biasO[i] = mutateVal(this.biasO[i]);
        }
    }

    toJSON(): any {
        return {
            inputNodes: this.inputNodes,
            hiddenNodes: this.hiddenNodes,
            outputNodes: this.outputNodes,
            // Convert TypedArrays to regular arrays for JSON
            weightsIH: this.weightsIH.map(row => Array.from(row)),
            weightsHO: this.weightsHO.map(row => Array.from(row)),
            biasH: Array.from(this.biasH),
            biasO: Array.from(this.biasO)
        };
    }

    static fromJSON(data: any): NeuralNetwork {
        const nn = new NeuralNetwork(data.inputNodes, data.hiddenNodes, data.outputNodes);

        // Restore from JSON (arrays) to TypedArrays
        if (data.weightsIH) {
            for (let i = 0; i < data.hiddenNodes; i++) {
                nn.weightsIH[i].set(data.weightsIH[i]);
            }
        }
        if (data.weightsHO) {
            for (let i = 0; i < data.outputNodes; i++) {
                nn.weightsHO[i].set(data.weightsHO[i]);
            }
        }
        if (data.biasH) nn.biasH.set(data.biasH);
        if (data.biasO) nn.biasO.set(data.biasO);

        return nn;
    }

}
