export function isString(string) {
    return typeof string === "string" || string instanceof String;
}


export function isEmptyString(string) {
    return isString(string) && string.trim() === "";
}


export function isNonemptyString(string) {
    return isString(string) && string.trim() !== "";
}


export function titleCase(string) {
    return string.split(" ").map(word => {
        return word.charAt(0).toUpperCase() + word.substr(1);
    }).join(" ");
}


export function clip(string, maxLength) {
    if (!isString(string)) {
        return "";
    }
    if (string.length > maxLength) {
        return string.substring(0, maxLength - 1) + "…";
    }
    return string;
}
