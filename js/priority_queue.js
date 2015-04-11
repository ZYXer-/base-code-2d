function PriorityQueue() {

	this.elements = [];

	this.scoreCallback;


	this.setScoreCallback = function(scoreCallback) {
		this.scoreCallback = scoreCallback;
	};


	this.size =  function() {
		return this.elements.length;
	};


	this.push = function(element) {
		this.elements.push(element);
		this.bubbleUp(this.elements.length - 1);
	};


	this.pop = function() {
		var element = this.elements[0];
		var end = this.elements.pop();
		if(this.elements.length > 0) {
			this.elements[0] = end;
			this.sinkDown(0);
		}
		return element;
	};


	this.remove = function(node) {
		var length = this.elements.length;
		for(var i = 0; i < length; i++) {
			if(this.elements[i] == node) {
				var end = this.elements.pop();
				if(i != length - 1) {
					this.elements[i] = end;
					this.bubbleUp(i);
					this.sinkDown(i);
				}
				break;
			}
		}
	};


	this.rescore = function(node) {
		var length = this.elements.length;
		for(var i = 0; i < length; i++) {
			if(this.elements[i] == node) {
				this.bubbleUp(i);
				this.sinkDown(i);
				break;
			}
		}
	};


	this.bubbleUp = function(n) {
		var element = this.elements[n];
		var score = this.scoreCallback(element);
		while(n > 0) {
			var parentN = Math.floor((n + 1) / 2) - 1;
			var parent = this.elements[parentN];
			if(score < this.scoreCallback(parent)) {
				this.elements[parentN] = element;
				this.elements[n] = parent;
				n = parentN;
			} else {
				break;
			}
		}
	};


	this.sinkDown = function(n) {
		var length = this.elements.length;
		var element = this.elements[n];
		var score = this.scoreCallback(element);

		while(true) {
			var child2n = (n + 1) * 2;
			var child1n = child2n - 1;
			var oldN = n;

			if(child2n < length) {
				var child1 = this.elements[child1n];
				var child1Score = this.scoreCallback(child1);
				var child2 = this.elements[child2n];
				var child2Score = this.scoreCallback(child2);
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
				var child1 = this.elements[child1n];
				var child1Score = this.scoreCallback(child1);
				if(score > child1Score) {
					this.elements[n] = this.elements[child1n];
					this.elements[child1n] = element;
					n = child1n;
				}
			}
			if(n == oldN) {
				break;
			}
		}
	};

}