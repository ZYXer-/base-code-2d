function Mouse() {

	this.x = 0;
	this.y = 0;

	this.downAreas = {};
	this.upAreas = {};
	this.draggableAreas = {};

	this.down = false;
	this.downX = 0;
	this.downY = 0;

	this.dragging = false;
	this.lastDragX = 0;
	this.lastDragY = 0;
	this.dragDeltaX = 0;
	this.dragDeltaY = 0;
	this.draggingCallback = null;
	this.dropCallback = null;

	this.init = function() {

		jQuery("body").attr("unselectable", "on").css("user-select", "none").on("selectstart", false);

		jQuery("body").mousemove(function(event) {
			mouse.updatePosition(event);

		}).mousedown(function(event) {
			if(event.which == 1) {

				mouse.down = true;
				mouse.downX = mouse.x;
				mouse.downY = mouse.y;
				mouse.updatePosition(event);

				for(var name in mouse.draggableAreas) {
					var area = mouse.draggableAreas[name];
					if(mouse.isOver(area.x, area.y, area.w, area.h)) {

						mouse.dragging = true;
						mouse.lastDragX = mouse.x;
						mouse.lastDragY = mouse.y;
						mouse.dragDeltaX = 0;
						mouse.dragDeltaY = 0;

						mouse.draggingCallback = area.draggingCallback;
						mouse.dropCallback = area.dropCallback;
						if(area.downCallback != null) {
							area.downCallback();
						}
					}
				}

				for(var name in mouse.downAreas) {
					var area = mouse.downAreas[name];
					if(mouse.isOver(area.x, area.y, area.w, area.h)) {
						area.callback();
					}
				}
			}

		}).mouseup(function(event) {
			if(event.which == 1) {

				mouse.down = false;
				mouse.updatePosition(event);

				if(mouse.dragging) {
					mouse.dragging = false;
					if(mouse.dropCallback != null) {
						mouse.dropCallback();
					}
				}

				for(var name in mouse.upAreas) {
					var area = mouse.upAreas[name];
					if(mouse.isOver(area.x, area.y, area.w, area.h)) {
						area.callback();
					}
				}
			}
		});
	};


	this.updatePosition = function(event) {
		var offset = jQuery("#game").offset();
		this.x = event.pageX - offset.left;
		this.y = event.pageY - offset.top;
	};


	this.update = function() {
		if(this.dragging) {
			this.dragDeltaX = this.x - this.lastDragX;
			this.dragDeltaY = this.y - this.lastDragY;
			this.lastDragX = this.x;
			this.lastDragY = this.y;
			if(this.draggingCallback != null) {
				this.draggingCallback();
			}
		} else {
			this.dragDeltaX = 0;
			this.dragDeltaY = 0;
		}
	};


	this.isOver = function(x, y, w, h) {
		return (this.x >= x && this.x < x + w && this.y >= y && this.y < y + h);
	};


	this.registerDownArea = function(name, x, y, w, h, callback) {
		this.downAreas[name] = { 
			name : name,
			x : x,
			y : y,
			w : w,
			h : h,
			callback : callback
		};
	};


	this.deleteDownArea = function(name) {
		if(this.downAreas.hasOwnProperty(name)) {
			delete this.downAreas[name];
		}
	};


	this.registerUpArea = function(name, x, y, w, h, callback) {
		this.upAreas[name] = { 
			name : name,
			x : x, 
			y : y, 
			w : w, 
			h : h, 
			callback : callback
		};
	};


	this.deleteUpArea = function(name) {
		if(this.upAreas.hasOwnProperty(name)) {
			delete this.upAreas[name];
		}
	};


	this.registerDraggableArea = function(name, x, y, w, h, downCallback, draggingCallback, dropCallback) {
		this.draggableAreas[name] = { 
			name : name, 
			x : x, 
			y : y, 
			w : w, 
			h : h, 
			downCallback : downCallback, 
			draggingCallback : draggingCallback, 
			dropCallback : dropCallback
		};
	};


	this.deleteDraggableArea = function(name) {
		if(this.draggableAreas.hasOwnProperty(name)) {
			delete this.draggableAreas[name];
		}
	};
	
	
	this.startDragging = function(draggingCallback, dropCallback) {
		
		this.dragging = true;
		this.lastDragX = mouse.x;
		this.lastDragY = mouse.y;
		this.dragDeltaX = 0;
		this.dragDeltaY = 0;

		this.draggingCallback = draggingCallback;
		this.dropCallback = dropCallback;
	};

}