class DrawQueue {

    
    constructor() {
        this.elements = [];
        this.needsUpdate = false;
    }


    reset() {
        this.elements = [];
    }


    forceUpdate() {
        this.needsUpdate = true;
    }


    add(element) {
        this.elements.push(element);
        this.needsUpdate = true;
    }


    remove(element) {
        this.elements = this.elements.filter(item => item !== element);
    }


    comparator(a, b) {
        if(a.z < b.z) {
            return -1;
        }
        if(a.z > b.z) {
            return 1;
        }
        return 0;
    }


    draw() {
        if(this.needsUpdate) {
            this.elements.sort(this.comparator);
            this.needsUpdate = false;
        }
        this.elements.forEach(element => {
            element.draw();
        });
    }
    
}


export default DrawQueue;