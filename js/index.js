import { Director } from "./director.js";
function main() {
    const director = new Director();
    window.director = director;
    window.Director = Director;
    director.startGame();
}
function unpackCoords(coord) {
    if (coord.hasOwnProperty('cx')) {
        return `[${coord.cy}, ${coord.cx}]`;
    }
    return `[${coord.by}, ${coord.bx}]`;
}
document.addEventListener('DOMContentLoaded', main);
export { unpackCoords };
