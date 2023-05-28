import { Animator } from "./animator.js";
import { DevMode } from "./devmode.js";
import { Blinky } from "./entitiies/blinky.js";
import { Clyde } from "./entitiies/clyde.js";
import { Inky } from "./entitiies/inky.js";
import { PacMan } from "./entitiies/pacman.js";
import { Pinky } from "./entitiies/pinky.js";
import { GameBoard } from "./gameBoard.js";

export type canvasCoordinate = {cx: number, cy: number};
export type boardCoordinate = {bx: number, by: number};

// Vector is measured in pixels / ms
export type vector = {x: number, y: number};

export type RenderObject = {
	placementCoords: canvasCoordinate,
	sheetCoords: canvasCoordinate
};

export type Direction = "up" | "down" | "left" | "right" | "none";

export type animationInfo = {
	up: string,
	down: string,
	left: string,
	right: string,
	static?: string
}

export type moveInfo = {
	coord: boardCoordinate,
	direction: Direction
}

declare global {
    interface Window {
		pacman: PacMan,
		blinky: Blinky,
		inky: Inky,
		pinky: Pinky
		clyde: Clyde,
		GameBoard: any,
		gameBoard: GameBoard
		animator: Animator
		Animator: any
		developer: DevMode
	}
}

export interface GridCell extends HTMLDivElement {
	dataset: {
		boardX?: string
		boardY?: string
		canvasX?: string
		canvasY?: string
	}
}