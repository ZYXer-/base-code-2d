function DrawQueue() {


    this.elements;


    this.init = function() {
        this.elements = [];
    };


    this.addElement = function(element) {
        this.elements.push(element);
        this.elements.sort(this.comparator);
    };


    this.removeElement = function(element) {
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
        for(var i = 0; i < this.elements.length; i++) {
            this.elements[i].draw();
        }
    };

}