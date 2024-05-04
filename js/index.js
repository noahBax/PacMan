import Director from "./director.js";
import LOG_FLAG from "./logTools.js";
// Link to source
// https://pacman.holenet.info/#LvlSpecs
function main(event) {
    console.log(LOG_FLAG.INDEX, `Game initialized at ${event.timeStamp}`);
    const director = new Director(event.timeStamp);
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
window.addEventListener("load", main);
export { unpackCoords };
