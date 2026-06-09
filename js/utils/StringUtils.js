export function titleCase(string) {
    return string.split(" ").map(word => {
        return word.charAt(0).toUpperCase() + word.substr(1);
    }).join(" ");
}
