function Mouse() {
  
  this.x = 0;
  this.y = 0;
  
  this.downAreas = {};
  this.upAreas = {};
  
  this.down = false;
  
  this.init = function() {
    
    jQuery("body").attr("unselectable", "on").css("user-select", "none").on("selectstart", false);
    
    jQuery("#game").mousemove(function(event) {
      mouse.updatePosition(event);
      
    }).mousedown(function(event) {
      mouse.down = true;
      mouse.updatePosition(event);
      if(event.which == 1) {
        for(var name in mouse.downAreas) {
          var area = mouse.downAreas[name];
          if(mouse.isOver(area.x, area.y, area.w, area.h)) {
            area.callback();
          }
        }
      }
      
    }).mouseup(function(event) {
      mouse.down = false;
      mouse.updatePosition(event);
      if(event.which == 1) {
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
  
  
  this.isOver = function(x, y, w, h) {
    return (this.x >= x && this.x < x + w && this.y >= y && this.y < y + h);
  };
  
  
  this.registerDownArea = function(name, x, y, w, h, callback) {
    this.downAreas[name] = { name : name, x : x, y : y, w : w, h : h, callback : callback};
  };
  
  
  this.deleteDownArea = function(name) {
    if(this.downAreas.hasOwnProperty(name)) {
      delete this.downAreas[name];
    }
  };
  
  
  this.registerUpArea = function(name, x, y, w, h, callback) {
    this.upAreas[name] = { name : name, x : x, y : y, w : w, h : h, callback : callback};
  };
  
  
  this.deleteUpArea = function(name) {
    if(this.upAreas.hasOwnProperty(name)) {
      delete this.upAreas[name];
    }
  };
  
}