class Color {


    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    
    toHex() {
        let hex = ((this.r * 65536) + (this.g * 256) + this.b).toString(16);
        return "#" + ("000000".substring(0, 6 - hex.length)) + hex;
    }


    toRGB() {
        return "rgb(" + this.r.toString(10) + "," + this.g.toString(10) + "," + this.b.toString(10) + ")";
    }


    toRGBA(opacity) {
        return "rgb(" + this.r.toString(10) + "," + this.g.toString(10) + "," + this.b.toString(10) + "," + opacity.toString(10) + ")";
    }


    clone() {
        return new Color(this.r, this.g, this.b);
    }


    static fromRGB(r, g, b) {
        return new Color(r, g, b);
    }


    static fromArray(a) {
        return new Color(a[0], a[1], a[2]);
    }


    static fromHex(hex) {
        const r = parseInt(hex.substring(1,3), 16);
        const g = parseInt(hex.substring(3,5), 16);
        const b = parseInt(hex.substring(5,7), 16);
        return new Color(r, g, b);
    }


    static fromHSL(h, s, l) { // h, s and l are all values from 0.0 to 1.0
        if(s === 0) {
            return { r : Math.round(l * 255), g : Math.round(l * 255), b : Math.round(l * 255) };
        }

        let q;
        if(l < 0.5) {
            q = l * (1 + s);
        } else {
            q = l + s - (l * s);
        }
        let p = (2 * l) - q;

        return new Color(
            Math.round(Color.hueToRGB(p, q, h + (1 / 3)) * 255),
            Math.round(Color.hueToRGB(p, q, h) * 255),
            Math.round(Color.hueToRGB(p, q, h - (1 / 3)) * 255)
        );
    }


    static hueToRGB(p, q, t) {
        if(t < 0) {
            t += 1;
        }
        if(t > 1) {
            t -= 1;
        }

        if(t < 1 / 6) {
            return p + (6 * (q - p) * t);
        } else if(t < 1 / 2) {
            return q;
        } else if(t < 2/3) {
            return p + (6 * (q - p) * ((2 / 3) - t));
        } else {
            return p;
        }
    }

}


export default Color;