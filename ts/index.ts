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

let animator: Animator;
let controller: Controller;

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

	const blinky = new Blinky(pacman);
	// blinky.setInitial({x: 10+18, y: 20}, {x: 0, y: 0}, 0);
	animator.registerEntity(blinky)
	window.blinky = blinky

	const inky = new Inky(pacman);
	animator.registerEntity(inky)
	window.inky = inky;

	const pinky = new Pinky(pacman);
	animator.registerEntity(pinky);
	window.pinky = pinky

	const clyde = new Clyde(pacman);
	animator.registerEntity(clyde);
	window.clyde = clyde

	window.gameBoard = gameBoard;
	window.GameBoard = GameBoard;

	window.animator = animator;
	window.Animator = Animator;

	const devmode = new DevMode(devCanvas.getContext("2d"), pacman, blinky, inky, pinky, clyde, animator, spriteSheet, gameBoard);
	window.developer = devmode;
	devmode.renderGridNumbers();
	clyde.scareMe(600, 0);

	controller = new Controller(pacman);

	// And finally
	animator.startRendering();
}

document.addEventListener('DOMContentLoaded', main);