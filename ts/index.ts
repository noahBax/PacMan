import { boardCoordinate, canvasCoordinate } from "./types.js";
import { Director } from "./director.js";


function main() {
	const director = new Director();
	window.director = director;
	window.Director = Director;

	director.startGame();
}

function unpackCoords(coord: canvasCoordinate | boardCoordinate) {
	if (coord.hasOwnProperty('cx')) {
		return `[${(coord as canvasCoordinate).cy}, ${(coord as canvasCoordinate).cx}]`;
	}
	return `[${(coord as boardCoordinate).by}, ${(coord as boardCoordinate).bx}]`;
}

document.addEventListener('DOMContentLoaded', main);

export { unpackCoords }