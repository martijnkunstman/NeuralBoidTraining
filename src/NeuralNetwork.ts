
export class NeuralNetwork {
    inputNodes: number;
    hiddenNodes: number;
    outputNodes: number;

    weightsIH: number[][]; // Weights Input -> Hidden
    weightsHO: number[][]; // Weights Hidden -> Output

    biasH: number[]; // Bias Hidden
    biasO: number[]; // Bias Output

    // State for visualization
    lastInput: number[] = [];
    lastHidden: number[] = [];
    lastOutput: number[] = [];

    constructor(inputNodes: number, hiddenNodes: number, outputNodes: number) {
        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodes;
        this.outputNodes = outputNodes;

        this.weightsIH = this.createMatrix(this.hiddenNodes, this.inputNodes);
        this.weightsHO = this.createMatrix(this.outputNodes, this.hiddenNodes);

        this.biasH = new Array(this.hiddenNodes).fill(0).map(_ => Math.random() * 2 - 1);
        this.biasO = new Array(this.outputNodes).fill(0).map(_ => Math.random() * 2 - 1);

        this.randomize();
    }

    private createMatrix(rows: number, cols: number): number[][] {
        return Array.from({ length: rows }, () => new Array(cols).fill(0));
    }

    randomize() {
        for (let i = 0; i < this.hiddenNodes; i++) {
            for (let j = 0; j < this.inputNodes; j++) {
                this.weightsIH[i][j] = Math.random() * 2 - 1; // -1 to 1
            }
        }

        for (let i = 0; i < this.outputNodes; i++) {
            for (let j = 0; j < this.hiddenNodes; j++) {
                this.weightsHO[i][j] = Math.random() * 2 - 1; // -1 to 1
            }
        }

        this.biasH = this.biasH.map(_ => Math.random() * 2 - 1);
        this.biasO = this.biasO.map(_ => Math.random() * 2 - 1);
    }

    feedForward(inputArray: number[]): number[] {
        if (inputArray.length !== this.inputNodes) {
            console.error(`NeuralNetwork: Expected ${this.inputNodes} inputs, got ${inputArray.length}`);
            return new Array(this.outputNodes).fill(0);
        }

        this.lastInput = [...inputArray];

        // Generating the Hidden Outputs
        let hidden = new Array(this.hiddenNodes).fill(0);
        for (let i = 0; i < this.hiddenNodes; i++) {
            let sum = 0;
            for (let j = 0; j < this.inputNodes; j++) {
                sum += this.weightsIH[i][j] * inputArray[j];
            }
            sum += this.biasH[i];
            hidden[i] = this.sigmoid(sum);
        }
        this.lastHidden = [...hidden];

        // Generating the Output's Output
        let output = new Array(this.outputNodes).fill(0);
        for (let i = 0; i < this.outputNodes; i++) {
            let sum = 0;
            for (let j = 0; j < this.hiddenNodes; j++) {
                sum += this.weightsHO[i][j] * hidden[j];
            }
            sum += this.biasO[i];
            output[i] = this.sigmoid(sum);
        }
        this.lastOutput = [...output];

        return output;
    }

    sigmoid(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }

    copy(): NeuralNetwork {
        const nn = new NeuralNetwork(this.inputNodes, this.hiddenNodes, this.outputNodes);
        nn.weightsIH = this.weightsIH.map(row => [...row]);
        nn.weightsHO = this.weightsHO.map(row => [...row]);
        nn.biasH = [...this.biasH];
        nn.biasO = [...this.biasO];
        return nn;
    }

    mutate(rate: number, amount: number) {
        const mutateVal = (val: number) => {
            if (Math.random() < rate) {
                // Tweak weight by a random amount
                return val + (Math.random() * 2 - 1) * amount;
            }
            return val;
        };

        this.weightsIH = this.weightsIH.map(row => row.map(mutateVal));
        this.weightsHO = this.weightsHO.map(row => row.map(mutateVal));
        this.biasH = this.biasH.map(mutateVal);
        this.biasO = this.biasO.map(mutateVal);
    }
    toJSON(): any {
        return {
            inputNodes: this.inputNodes,
            hiddenNodes: this.hiddenNodes,
            outputNodes: this.outputNodes,
            weightsIH: this.weightsIH,
            weightsHO: this.weightsHO,
            biasH: this.biasH,
            biasO: this.biasO
        };
    }

    static fromJSON(data: any): NeuralNetwork {
        const nn = new NeuralNetwork(data.inputNodes, data.hiddenNodes, data.outputNodes);
        nn.weightsIH = data.weightsIH;
        nn.weightsHO = data.weightsHO;
        nn.biasH = data.biasH;
        nn.biasO = data.biasO;
        return nn;
    }
}
