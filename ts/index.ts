import { Animator } from "./animator.js";
import { PacMan } from "./entitiies/pacman.js";
import { Controller } from "./controller.js";
import { spriteManager } from "./spriteManager.js";
import { Blinky } from "./entitiies/blinky.js";
import { Inky } from "./entitiies/inky.js";
import { Pinky } from "./entitiies/pinky.js";
import { Clyde } from "./entitiies/clyde.js";
import { GameBoard } from "./gameBoard.js";

let animator: Animator;
let controller: Controller;

function main() {
	const img = document.getElementById("buddy") as HTMLImageElement;
	const foregroundCanvas = document.getElementById("renderBox") as HTMLCanvasElement;
	const backgroundCanvas = document.getElementById("backdrop") as HTMLCanvasElement;

	const spriteSheet = document.getElementById("spriteSheet") as HTMLImageElement;
	const gameBoard = new GameBoard()
	animator = new Animator(foregroundCanvas.getContext("2d"), backgroundCanvas.getContext("2d", { alpha: false }), spriteSheet, gameBoard);
	console.log(animator);

	const pacman = new PacMan();
	pacman.setInitial({x: 10, y: 10}, {x: 0.001, y: 0.001}, 0);
	animator.registerEntity(pacman);

	const blinky = new Blinky();
	blinky.setInitial({x: 10+18, y: 20}, {x: 0, y: 0}, 0);
	animator.registerEntity(blinky)

	const inky = new Inky();
	inky.setInitial({x: 10+18*2, y: 20}, {x: 0, y: 0}, 0);
	animator.registerEntity(inky)

	const pinky = new Pinky();
	pinky.setInitial({x: 10+18*3, y:20}, false, 0);
	animator.registerEntity(pinky);

	const clyde = new Clyde();
	clyde.setInitial({x:10+18*4, y:20}, false, 0);
	animator.registerEntity(clyde);

	console.log(clyde);
	clyde.scareMe(600, 0);

	controller = new Controller(pacman);
}

document.addEventListener('DOMContentLoaded', main);