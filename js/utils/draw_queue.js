function DrawQueue() {


    this.elements = [];
    this.needsUpdate = false;


    this.reset = function() {
        this.elements = [];
    };


    this.forceUpdate = function() {
        this.needsUpdate = true;
    };


    this.add = function(element) {
        this.elements.push(element);
        this.needsUpdate = true;
    };


    this.remove = function(element) {
        for(var i = 0; i < this.elements.length; i++) {
            if(this.elements[i] == element) {
                this.elements.splice(i, 1);
                break;
            }
        }
    };


    this.comparator = function(a, b) {
        if(a.z < b.z) {
            return -1;
        }
        if(a.z > b.z) {
            return 1;
        }
        return 0;
    };


    this.draw = function() {
        if(this.needsUpdate) {
            this.elements.sort(this.comparator);
            this.needsUpdate = false;
        }
        for(var i = 0; i < this.elements.length; i++) {
            this.elements[i].draw();
        }
    };

}