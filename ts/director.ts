import { Animator } from "./animator.js";
import { Controller } from "./controller.js";
import { DevMode } from "./devmode.js";
import { Blinky } from "./entitiies/blinky.js";
import { Clyde } from "./entitiies/clyde.js";
import { Inky } from "./entitiies/inky.js";
import { PacMan } from "./entitiies/pacman.js";
import { Pinky } from "./entitiies/pinky.js";
import { PowerPellet } from "./entitiies/powerPellet.js";
import { GameBoard } from "./gameBoard.js";

class Director {

	private _gameBoard: GameBoard;
	private _animator: Animator;
	private _controller: Controller;
	
	private _levelNumber = 1;
	private _ghostsEatenInEvent = 0;
	private _ghostsEatenInLevel = 0;

	private _pacmanRef: PacMan;
	private _ghostRefs: [Blinky, Pinky, Inky, Clyde];
	// In order: top left, top right, bottom left, bottom right
	private _energizers: [PowerPellet, PowerPellet, PowerPellet, PowerPellet];
	
	// Dictionary items
	private static readonly _FRIGHT_TIMES: number[] = [6,5,4,3,2,5,2,2,1,5,2,1,1,3,1,1,1,1,1,1,1]; 

	
	constructor() {

		const foregroundCanvas = document.getElementById("renderBox") as HTMLCanvasElement;
		const backgroundCanvas = document.getElementById("backdrop") as HTMLCanvasElement;
		const devCanvas = document.getElementById("devBox") as HTMLCanvasElement;

		const spriteSheet = document.getElementById("spriteSheet") as HTMLImageElement;
		this._gameBoard = new GameBoard(this);
		this._animator = new Animator(foregroundCanvas.getContext("2d"), backgroundCanvas.getContext("2d", { alpha: false }), spriteSheet, this._gameBoard);
		console.log(this._animator);

		this._pacmanRef = new PacMan();
		this._animator.registerEntity(this._pacmanRef);
		window.pacman = this._pacmanRef

		this._createGhosts();
		
		window.gameBoard = this._gameBoard;
		window.GameBoard = GameBoard;

		window.animator = this._animator;
		window.Animator = Animator;

		
		const devMode = new DevMode(devCanvas.getContext("2d"), this._pacmanRef, ...this._ghostRefs, this._animator, spriteSheet, this._gameBoard);
		devCanvas.style.display = "none";
		window.developer = devMode;
		devMode.renderGridTiles();
		devCanvas.style.display = "block";

		this._controller = new Controller(this._pacmanRef, this._animator);
		window.controller = this._controller;

		// Pause the game when the page loses focus
		window.addEventListener("blur", () => {
			Animator.ACTIVE = false;
		});

		// this._energizers = energizers;

	}

	private _createGhosts() {
		console.log("Init-ing blinky");
		const blinky = new Blinky(this._pacmanRef, this._gameBoard);
		this._animator.registerEntity(blinky)
		window.blinky = blinky

		console.log("Init-ing inky");
		const inky = new Inky(this._pacmanRef, blinky, this._gameBoard);
		this._animator.registerEntity(inky)
		window.inky = inky;

		console.log("Init-ing pinky");
		const pinky = new Pinky(this._pacmanRef, this._gameBoard);
		this._animator.registerEntity(pinky);
		window.pinky = pinky

		console.log("Init-ing clyde");
		const clyde = new Clyde(this._pacmanRef, this._gameBoard);
		this._animator.registerEntity(clyde);
		window.clyde = clyde

		this._ghostRefs = [blinky, pinky, inky, clyde];
	}

	startGame() {
		this._animator.startAnimating();
	}

	powerPelletEatenEvent(timestamp: number) {
		this._ghostsEatenInEvent = 0;
		
		const time = this._levelNumber > 21 ? Director._FRIGHT_TIMES[20] : Director._FRIGHT_TIMES[this._levelNumber - 1];
		
		this._ghostRefs.forEach( ghost => ghost.scareMe(time * 1000, timestamp));
	}

	ghostEaten() {

		
		this._ghostsEatenInEvent++;
		this._ghostsEatenInLevel++;
		
		GameBoard.PACMAN_SCORE += (2**this._ghostsEatenInLevel)*100;
		
	}
}

export { Director };