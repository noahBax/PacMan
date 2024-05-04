import Animator from "./animator.js";
import Controller from "./controller.js";
import DevMode from "./devmode.js";
import Blinky from "./entitiies/blinky.js";
import Clyde from "./entitiies/clyde.js";
import Inky from "./entitiies/inky.js";
import PacMan from "./entitiies/pacman.js";
import Pinky from "./entitiies/pinky.js";
import GameBoard from "./gameBoard.js";
export var PACMAN;
export var GAME_BOARD;
window.GameBoard = GameBoard;
window.Animator = Animator;
class Director {
    constructor() {
        this._levelNumber = 1;
        this._ghostsEatenInEvent = 0;
        this._ghostsEatenInLevel = 0;
        const foregroundCanvas = document.getElementById("renderBox");
        const backgroundCanvas = document.getElementById("backdrop");
        const devCanvas = document.getElementById("devBox");
        const spriteSheet = document.getElementById("spriteSheet");
        GAME_BOARD = new GameBoard(this);
        this._animator = new Animator(foregroundCanvas.getContext("2d"), backgroundCanvas.getContext("2d", { alpha: false }), spriteSheet, GAME_BOARD);
        console.log(this._animator);
        PACMAN = new PacMan();
        this._animator.registerEntity(PACMAN);
        window.pacman = PACMAN;
        this._createGhosts();
        window.gameBoard = GAME_BOARD;
        window.animator = this._animator;
        const devMode = new DevMode(devCanvas.getContext("2d"), ...this._ghostRefs, this._animator, spriteSheet, GAME_BOARD);
        devCanvas.style.display = "none";
        window.developer = devMode;
        devMode.renderGridTiles();
        devCanvas.style.display = "block";
        this._controller = new Controller(this._animator);
        window.controller = this._controller;
        // Pause the game when the page loses focus
        window.addEventListener("blur", () => {
            Animator.ACTIVE = false;
        });
        // this._energizers = energizers;
    }
    _createGhosts() {
        console.log("Init-ing blinky");
        const blinky = new Blinky();
        this._animator.registerEntity(blinky);
        window.blinky = blinky;
        console.log("Init-ing inky");
        const inky = new Inky(blinky);
        this._animator.registerEntity(inky);
        window.inky = inky;
        console.log("Init-ing pinky");
        const pinky = new Pinky();
        this._animator.registerEntity(pinky);
        window.pinky = pinky;
        console.log("Init-ing clyde");
        const clyde = new Clyde();
        this._animator.registerEntity(clyde);
        window.clyde = clyde;
        this._ghostRefs = [blinky, pinky, inky, clyde];
    }
    startGame() {
        this._animator.startAnimating();
    }
    powerPelletEatenEvent(timestamp) {
        this._ghostsEatenInEvent = 0;
        const time = this._levelNumber > 21 ? Director._FRIGHT_TIMES[20] : Director._FRIGHT_TIMES[this._levelNumber - 1];
        this._ghostRefs.forEach(ghost => ghost.scareMe(time * 1000, timestamp));
    }
    ghostEaten() {
        this._ghostsEatenInEvent++;
        this._ghostsEatenInLevel++;
        GameBoard.PACMAN_SCORE += (2 ** this._ghostsEatenInLevel) * 100;
    }
}
// Dictionary items
Director._FRIGHT_TIMES = [6, 5, 4, 3, 2, 5, 2, 2, 1, 5, 2, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1];
export default Director;
