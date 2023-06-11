import { Animator } from "./animator.js";
import { PacMan } from "./entitiies/pacman.js";
import { Controller } from "./controller.js";
import { spriteManager } from "./spriteManager.js";
import { Blinky } from "./entitiies/blinky.js";
import { Inky } from "./entitiies/inky.js";
import { Pinky } from "./entitiies/pinky.js";
import { Clyde } from "./entitiies/clyde.js";
import { GameBoard } from "./gameBoard.js";
import { DevMode } from "./devmode.js";
import { boardCoordinate, canvasCoordinate } from "./types.js";

let animator: Animator;
let controller: Controller;

let devMode: DevMode;

function main() {
	const img = document.getElementById("buddy") as HTMLImageElement;
	const foregroundCanvas = document.getElementById("renderBox") as HTMLCanvasElement;
	const backgroundCanvas = document.getElementById("backdrop") as HTMLCanvasElement;
	const devCanvas = document.getElementById("devBox") as HTMLCanvasElement;

	const spriteSheet = document.getElementById("spriteSheet") as HTMLImageElement;
	const gameBoard = new GameBoard()
	animator = new Animator(foregroundCanvas.getContext("2d"), backgroundCanvas.getContext("2d", { alpha: false }), spriteSheet, gameBoard);
	console.log(animator);

	const pacman = new PacMan();
	animator.registerEntity(pacman);
	window.pacman = pacman

	const blinky = new Blinky(pacman, gameBoard);
	animator.registerEntity(blinky)
	window.blinky = blinky
	console.log("Init-ing blinky");
	// blinky.initializeGhost();

	const inky = new Inky(pacman, blinky, gameBoard);
	animator.registerEntity(inky)
	window.inky = inky;
	console.log("Init-ing inky");
	// inky.initializeGhost();

	const pinky = new Pinky(pacman, gameBoard);
	animator.registerEntity(pinky);
	window.pinky = pinky
	console.log("Init-ing pinky");
	// pinky.initializeGhost();

	const clyde = new Clyde(pacman, gameBoard);
	animator.registerEntity(clyde);
	window.clyde = clyde
	console.log("Init-ing clyde");
	// clyde.initializeGhost();

	gameBoard.setGhosts(blinky, inky, pinky, clyde);

	window.gameBoard = gameBoard;
	window.GameBoard = GameBoard;

	window.animator = animator;
	window.Animator = Animator;

	
	devCanvas.style.display = "none";
	devMode = new DevMode(devCanvas.getContext("2d"), pacman, blinky, inky, pinky, clyde, animator, spriteSheet, gameBoard);
	window.developer = devMode;
	devMode.renderGridTiles();
	clyde.scareMe(600, 0);
	devCanvas.style.display = "block";
	
	controller = new Controller(pacman, animator);
	window.controller = controller;
	animator.startUpAnimation();

	// Pause the game when the page loses focus
	window.addEventListener("blur", () => {
		Animator.ACTIVE = false;
	});
}

function unpackCoords(coord: canvasCoordinate | boardCoordinate) {
	if (coord.hasOwnProperty('cx')) {
		return `[${(coord as canvasCoordinate).cy}, ${(coord as canvasCoordinate).cx}]`;
	}
	return `[${(coord as boardCoordinate).by}, ${(coord as boardCoordinate).bx}]`;
}

document.addEventListener('DOMContentLoaded', main);

export { devMode, unpackCoords }