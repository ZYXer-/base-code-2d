function Humanoid(spriteName) {

    this.spriteSheet = Img.get(spriteName);

    this.sprites = {
        side : null,
        front : null,
        back : null
    };

    for(var type in this.sprites) {
        this.sprites[type] = {

            torso : { x : 0, y : 0, w : 1, h : 1 },
            head : { x : 0, y : 0, w : 1, h : 1 },

            upperLeg : { x : 0, y : 0, w : 1, h : 1 },
            lowerLeg : { x : 0, y : 0, w : 1, h : 1 },
            foot : { x : 0, y : 0, w : 1, h : 1 },

            upperArm : { x : 0, y : 0, w : 1, h : 1 },
            lowerArm : { x : 0, y : 0, w : 1, h : 1 }
        };
    }

    this.joints = {
        side : null,
        face : null
    };

    for(var jointType in this.joints) {
        this.joints[jointType] = {

            baseToTorsoCenter : new Vec2(0, 0),
            torsoCenter : new Vec2(0, 0),
            torsoToHeadJoint : new Vec2(0, 0),
            headToTorsoJoint : new Vec2(0, 0),

            torsoToLeftArmJoint : new Vec2(0, 0),
            torsoToRightArmJoint : new Vec2(0, 0),
            torsoToLeftLegJoint : new Vec2(0, 0),
            torsoToRightLegJoint : new Vec2(0, 0),

            upperLegToTorsoJoint : new Vec2(0, 0),
            upperLegToLowerLegJoint : new Vec2(0, 0),
            lowerLegToUpperLegJoint : new Vec2(0, 0),
            lowerLegToFootJoint : new Vec2(0, 0),
            footToLowerLegJoint : new Vec2(0, 0),
            footBase : new Vec2(0, 0),

            upperArmToTorsoJoint : new Vec2(0, 0),
            upperArmToLowerArmJoint : new Vec2(0, 0),
            lowerArmToUpperArmJoint : new Vec2(0, 0),
            handPoint : new Vec2(0, 0)
        };
    }

    this.walkAnimation = 0.0;
}


Humanoid.prototype.setSprite = function(direction, bodyPart, x, y, w, h) {
    this.sprites[direction][bodyPart] = { x : x, y : y, w : w, h : h };
};


Humanoid.prototype.setPoint = function(direction, point, vec2D) {
    this.joints[direction][point] = vec2D;
};


Humanoid.prototype.update = function(velocity, stepSize) {
    this.walkAnimation += (velocity * Timer.delta) / stepSize;
};


Humanoid.prototype.draw = function(direction, x, y) {

    c.save();
    c.translate(0, 0); // TODO




    c.restore();
};