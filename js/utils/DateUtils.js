import { isNonemptyString } from "./StringUtils.js";


const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


export function getTimestamp() {
    return (new Date()).toISOString();
}


export function isOlderThan(dateString, seconds) {
    if (!isNonemptyString(dateString)) {
        return true;
    }
    const date = Date.parse(dateString);
    return !date || isNaN(date) || date < (Date.now() - 1000 * seconds);
}


export function getNiceDateString(date) {
    if (typeof date === "undefined") {
        date = new Date();
    }
    const timeZoneOffset = date.getTimezoneOffset() / 60;

    const weekDay = weekDays[date.getDay()];
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const timeZone = "GMT" + (timeZoneOffset < 0 ? "" : "+") + timeZoneOffset;

    return `${weekDay}, ${year}-${month}-${day} at ${hours}:${minutes}:${seconds} (${timeZone})`;
}


export function getShortDateString(date) {
    if (typeof date === "undefined") {
        date = new Date();
    }

    const month = months[date.getMonth()];
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${month}-${day} ${hours}:${minutes}:${seconds}`;
}
