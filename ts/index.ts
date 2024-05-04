import { boardCoordinate, canvasCoordinate } from "./types.js";
import Director from "./director.js";
import PacMan from "./entitiies/pacman.js";
import Blinky from "./entitiies/blinky.js";
import Inky from "./entitiies/inky.js";
import Pinky from "./entitiies/pinky.js";
import Clyde from "./entitiies/clyde.js";
import GameBoard from "./gameBoard.js";
import Animator from "./animator.js";
import DevMode from "./devmode.js";
import Controller from "./controller.js";

// Link to source
// https://pacman.holenet.info/#LvlSpecs

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

declare global {
    interface Window {
		pacman: PacMan,
		blinky: Blinky,
		inky: Inky,
		pinky: Pinky
		clyde: Clyde,
		GameBoard: typeof GameBoard,
		gameBoard: GameBoard
		animator: Animator
		Animator: typeof Animator
		developer: DevMode
		controller: Controller
		director: Director
		Director: typeof Director
	}
}


window.addEventListener("load", main);

export { unpackCoords }