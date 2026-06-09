export function uniqueId(length) {
    let id = Math.random().toString(16).substr(2, 1);
    if (length > 1) {
        id += uniqueId(length - 1);
    }
    return id;
}


export function createMatrix(width, height, defaultValue) {
    const matrix = [];
    for (let x = 0; x < width; x++) {
        matrix[x] = [];
        for (let y = 0; y < height; y++) {
            if (typeof defaultValue === "object") {
                matrix[x][y] = shallowCopy(defaultValue);
            } else {
                matrix[x][y] = defaultValue;
            }
        }
    }
    return matrix;
}


export function shallowCopy(object) {
    return jQuery.extend({}, object);
}


export function deepCopy(object) {
    return jQuery.extend(true, {}, object);
}


export function objectToMap(obj) {
    const map = new Map();
    for (const key in obj) {
        map.set(key, obj[key]);
    }
    return map;
}


export function removeFromArray(array, value) {
    return array.filter(item => item !== value);
}


export function isInArray(array, value) {
    return array.indexOf(value) > -1;
}


export function arrayShuffle(array) {
    let i = array.length;
    let temp;
    let randI;
    while (0 !== i) {
        randI = Math.floor(Math.random() * i);
        i -= 1;
        temp = array[i];
        array[i] = array[randI];
        array[randI] = temp;
    }
    return array;
}


export function mergeArrays(array1, array2) {
    return array1.concat(array2);
}
