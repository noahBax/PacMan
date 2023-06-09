import { Animator } from "./animator.js";
import { PacMan } from "./entitiies/pacman.js";
import { Controller } from "./controller.js";
import { Blinky } from "./entitiies/blinky.js";
import { Inky } from "./entitiies/inky.js";
import { Pinky } from "./entitiies/pinky.js";
import { Clyde } from "./entitiies/clyde.js";
import { GameBoard } from "./gameBoard.js";
import { DevMode } from "./devmode.js";
let animator;
let controller;
let devMode;
function main() {
    const img = document.getElementById("buddy");
    const foregroundCanvas = document.getElementById("renderBox");
    const backgroundCanvas = document.getElementById("backdrop");
    const devCanvas = document.getElementById("devBox");
    const spriteSheet = document.getElementById("spriteSheet");
    const gameBoard = new GameBoard();
    animator = new Animator(foregroundCanvas.getContext("2d"), backgroundCanvas.getContext("2d", { alpha: false }), spriteSheet, gameBoard);
    console.log(animator);
    const pacman = new PacMan();
    animator.registerEntity(pacman);
    window.pacman = pacman;
    const blinky = new Blinky(pacman, gameBoard);
    animator.registerEntity(blinky);
    window.blinky = blinky;
    console.log("Init-ing blinky");
    // blinky.initializeGhost();
    const inky = new Inky(pacman, gameBoard);
    animator.registerEntity(inky);
    window.inky = inky;
    console.log("Init-ing inky");
    // inky.initializeGhost();
    const pinky = new Pinky(pacman, gameBoard);
    animator.registerEntity(pinky);
    window.pinky = pinky;
    console.log("Init-ing pinky");
    // pinky.initializeGhost();
    const clyde = new Clyde(pacman, gameBoard);
    animator.registerEntity(clyde);
    window.clyde = clyde;
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
    // And finally
}
function unpackCoords(coord) {
    if (coord.hasOwnProperty('cx')) {
        return `[${coord.cy}, ${coord.cx}]`;
    }
    return `[${coord.by}, ${coord.bx}]`;
}
document.addEventListener('DOMContentLoaded', main);
export { devMode, unpackCoords };
