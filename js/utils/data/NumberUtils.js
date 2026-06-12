export function isNumber(value) {
    return typeof value === "number" && !Number.isNaN(value);
}


export function rand(min, max) {
    return min + Math.floor((1 + max - min) * Math.random());
}


export function randFloat(min, max) {
    return min + ((max - min) * Math.random());
}


export function trueOrFalse(probabilityOfTrue) {
    return randFloat(0.0, 1.0) < probabilityOfTrue;
}


export function clamp(value, min, max) {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
}


export function min(value, min) {
    if (value > min) {
        return min;
    }
    return value;
}


export function max(value, max) {
    if (value < max) {
        return max;
    }
    return value;
}


export function scale0to1(value, min, max, reverse) {
    reverse = (typeof reverse !== "undefined" ? reverse : false);
    if (min === max) {
        return 0.0;
    }
    value = (value - min) / (max - min);
    value = clamp(value, 0.0, 1.0);

    if (reverse) {
        return (1.0 - value);
    } else {
        return value;
    }
}


export function pad(number, length) {
    const numberString = number.toString();
    const pad = "00000000";
    return pad.substring(0, length - numberString.length) + numberString;
}


export function toFixedDecimal(number, numberOfDecimals) {
    return number.toFixed(numberOfDecimals);
}


export function toPercentage(value, digits) {
    return (100 * value).toFixed(digits) + "%";
}
