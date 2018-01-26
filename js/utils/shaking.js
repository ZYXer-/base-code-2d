function Shaking() {

    this.offset = new Vec2(0.0, 0.0);

    this.timer = 0;
    this.timerStart = 0;

    this.amplitude = 0;

}


Shaking.prototype.shake = function(amplitude, length, delay) {
    this.timer = length;
    this.timerStart = length - delay;
    this.amplitude = amplitude;
};


Shaking.prototype.apply = function() {
    if(!Game.paused) {
        if(this.timer > 0 && this.timer <= this.timerStart) {

            var maxShake = Math.ceil(this.amplitude * (1 - Math.sin(1.2 * (this.timerStart - this.timer) / this.timerStart)));
            var minShake = Math.floor(maxShake * 0.7);
            this.offset.x = Utils.rand(minShake, maxShake);
            this.offset.y = Utils.rand(minShake, maxShake);

            if(this.timer % 2 === 0) {
                this.offset.x = -this.offset.x;
            }
            if(this.timer % 4 < 1) {
                this.offset.y = -this.offset.y;
            }

        } else {
            this.offset.x = 0;
            this.offset.y = 0;
        }

        if(this.timer > 0) {
            this.timer--;
        }
    }
    c.save();
    c.translate(this.offset.x, this.offset.y);
};


Shaking.prototype.remove = function() {
    c.restore();
};