class PriorityQueue {


    constructor(scoreCallback) {
        this.elements = [];
        this.scoreCallback = scoreCallback;
    }


    setScoreCallback(scoreCallback) {
        this.scoreCallback = scoreCallback;
    }


    size() {
        return this.elements.length;
    }


    push(element) {
        this.elements.push(element);
        this.bubbleUp(this.elements.length - 1);
    }


    pop() {
        let element = this.elements[0];
        let end = this.elements.pop();
        if(this.elements.length > 0) {
            this.elements[0] = end;
            this.sinkDown(0);
        }
        return element;
    }


    remove(node) {
        for(let i = 0; i < this.elements.length; i++) {
            if(this.elements[i] === node) {
                let end = this.elements.pop();
                if(i !== this.elements.length - 1) {
                    this.elements[i] = end;
                    this.bubbleUp(i);
                    this.sinkDown(i);
                }
                break;
            }
        }
    }


    rescore(node) {
        for(let i = 0; i < this.elements.length; i++) {
            if(this.elements[i] === node) {
                this.bubbleUp(i);
                this.sinkDown(i);
                break;
            }
        }
    }


    bubbleUp(n) {
        let element = this.elements[n];
        let score = this.scoreCallback(element);
        while(n > 0) {
            let parentN = Math.floor((n + 1) / 2) - 1;
            let parent = this.elements[parentN];
            if(score < this.scoreCallback(parent)) {
                this.elements[parentN] = element;
                this.elements[n] = parent;
                n = parentN;
            } else {
                break;
            }
        }
    }


    sinkDown(n) {
        let length = this.elements.length;
        let element = this.elements[n];
        let score = this.scoreCallback(element);

        while(true) {
            let child2n = (n + 1) * 2;
            let child1n = child2n - 1;
            let oldN = n;

            if(child2n < length) {
                let child1 = this.elements[child1n];
                let child1Score = this.scoreCallback(child1);
                let child2 = this.elements[child2n];
                let child2Score = this.scoreCallback(child2);
                if(child1Score < score) {
                    if(child2Score < child1Score) {
                        this.elements[n] = this.elements[child2n];
                        this.elements[child2n] = element;
                        n = child2n;
                    } else {
                        this.elements[n] = this.elements[child1n];
                        this.elements[child1n] = element;
                        n = child1n;
                    }
                } else if(child2Score < score) {
                    this.elements[n] = this.elements[child2n];
                    this.elements[child2n] = element;
                    n = child2n;
                }

            } else if(child1n < length) {
                let child1 = this.elements[child1n];
                let child1Score = this.scoreCallback(child1);
                if(score > child1Score) {
                    this.elements[n] = this.elements[child1n];
                    this.elements[child1n] = element;
                    n = child1n;
                }
            }
            if(n === oldN) {
                break;
            }
        }
    }

}


export default PriorityQueue;