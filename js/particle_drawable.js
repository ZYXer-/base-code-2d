function ParticleDrawable() {}


ParticleDrawable.draw = function(particle) {

    // implement particle types here:
    if(particle.type === 1) {
        var opacity = Utils.limit(particle.life / 2.0, 0.0, 1.0);
        c.fillStyle = "rgba(0, 0, 255, " + opacity + ")";
        c.fillRect(particle.pos.x - 20, particle.pos.y - 20, 40, 40);

    } else if(particle.type === 2) {
        var opacity = Utils.limit(particle.life / 0.7, 0.0, 1.0);
        c.fillStyle = "rgba(0, 127, 0, " + opacity + ")";
        c.fillRect(particle.pos.x - 10, particle.pos.y - 10, 20, 20);
    }

};