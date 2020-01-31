import Vec2 from "./Vec2.js";
import Vec3 from "./Vec3.js";
import * as Utils from "./Utils.js";
import * as Timer from "../core/Timer.js";


class Acceleratable {


    constructor(dimensionMode, pos, propulsionA, frictionA, maxV, angleMode) {

        this.dimensionMode = dimensionMode;

        this.pos = pos;

        this.v = 0.0;
        if(this.dimensionMode === Acceleratable.DIM_MODE_2D) {
            this.v = new Vec2(0.0, 0.0);
        } else if(this.dimensionMode === Acceleratable.DIM_MODE_3D) {
            this.v = new Vec3(0.0, 0.0, 0.0);
        }


        this.propulsionA = propulsionA;
        this.frictionA = frictionA;

        this.maxV = maxV;

        this.angleMode = angleMode;

        this.angle = 0;

    }


    setPos(pos) {
        this.pos = pos;
    }


    setV(v) {
        this.v = v;
    }


    setPropulsionA(propulsionA) {
        this.propulsionA = propulsionA;
    }


    setFrictionA(frictionA) {
        this.frictionA = frictionA;
    }


    setMaxV(maxV) {
        this.maxV = maxV;
    }


    update(propulsionDir) {

        let negSign;
        let sign;

        if(this.dimensionMode === Acceleratable.DIM_MODE_1D) {

            if(propulsionDir === 0.0) {
                if(this.v !== 0.0) {
                    negSign = this.getSign(-this.v);
                    this.v += negSign * this.frictionA * Timer.delta;
                    if(negSign * this.v > 0.0) {
                        this.v = 0.0;
                    }
                }
            } else {
                this.v += this.propulsionA * propulsionDir * Timer.delta;
                sign = this.getSign(propulsionDir);
                this.v = sign * Utils.min(sign * this.v, sign * this.maxV * propulsionDir);
            }

            this.pos += this.v * Timer.delta;

            if(this.v > 0.0) {
                this.angle = 1;
            } else if(this.v < 0.0) {
                this.angle = -1;
            } else {
                this.angle = 0;
            }

        } else {
            propulsionDir = propulsionDir.normalize();

            if(propulsionDir.x === 0.0) {
                if(this.v.x !== 0.0) {
                    negSign = this.getSign(-this.v.x);
                    this.v.x += negSign * this.frictionA.x * Timer.delta;
                    if(negSign * this.v.x > 0.0) {
                        this.v.x = 0.0;
                    }
                }
            } else {
                this.v.x += this.propulsionA.x * propulsionDir.x * Timer.delta;
                sign = this.getSign(propulsionDir.x);
                this.v.x = sign * Utils.min(sign * this.v.x, sign * this.maxV.x * propulsionDir.x);
            }

            if(propulsionDir.y === 0.0) {
                if(this.v.y !== 0.0) {
                    negSign = this.getSign(-this.v.y);
                    this.v.y += negSign * this.frictionA.y * Timer.delta;
                    if(negSign * this.v.y > 0.0) {
                        this.v.y = 0.0;
                    }
                }
            } else {
                this.v.y += this.propulsionA.y * propulsionDir.y * Timer.delta;
                sign = this.getSign(propulsionDir.y);
                this.v.y = sign * Utils.min(sign * this.v.y, sign * this.maxV.y * propulsionDir.y);
            }

            if(this.dimensionMode === Acceleratable.DIM_MODE_3D) {
                if(propulsionDir.z === 0.0) {
                    if(this.v.z !== 0.0) {
                        negSign = this.getSign(-this.v.z);
                        this.v.z += negSign * this.frictionA.z * Timer.delta;
                        if(negSign * this.v.z > 0.0) {
                            this.v.z = 0.0;
                        }
                    }
                } else {
                    this.v.z += this.propulsionA.z * propulsionDir.z * Timer.delta;
                    sign = this.getSign(propulsionDir.z);
                    this.v.z = sign * Utils.min(sign * this.v.z, sign * this.maxV.z * propulsionDir.z);
                }
            }

            this.pos = this.pos.add(this.v.multiply(Timer.delta));

            if(this.v.norm() > 0) {

                if(this.angleMode === Acceleratable.ANGLE_MODE_4WAY) {
                    if(Math.abs(this.v.x) > Math.abs(this.v.y)) {
                        this.angle = (this.v.x > 0 ? 3 : 1);
                    } else {
                        this.angle = (this.v.y > 0 ? 0 : 2);
                    }

                } else if(this.angleMode === Acceleratable.ANGLE_MODE_8WAY) {
                    if(this.v.x === 0 && this.v.y > 0) {
                        this.angle = 0;
                    } else if(this.v.x < 0 && this.v.y > 0) {
                        this.angle = 1;
                    } else if(this.v.x < 0 && this.v.y === 0) {
                        this.angle = 2;
                    } else if(this.v.x < 0 && this.v.y < 0) {
                        this.angle = 3;
                    } else if(this.v.x === 0 && this.v.y < 0) {
                        this.angle = 4;
                    } else if(this.v.x > 0 && this.v.y < 0) {
                        this.angle = 5;
                    } else if(this.v.x > 0 && this.v.y === 0) {
                        this.angle = 6;
                    } else if(this.v.x > 0 && this.v.y > 0) {
                        this.angle = 7;
                    }

                } else {
                    this.angle = this.v.angle();
                }
            }
        }
    }


    getSign(val) {
        if(val > 0) {
            return 1;
        } else if(val < 0) {
            return -1;
        }
        return 0;
    }


}


Acceleratable.DIM_MODE_1D = 1;
Acceleratable.DIM_MODE_2D = 2;
Acceleratable.DIM_MODE_3D = 3;

Acceleratable.ANGLE_MODE_4WAY = 0;
Acceleratable.ANGLE_MODE_8WAY = 1;
Acceleratable.ANGLE_MODE_ANGLE = 2;


export default Acceleratable;