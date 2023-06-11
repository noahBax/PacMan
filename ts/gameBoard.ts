import { Blinky } from "./entitiies/blinky.js";
import { Clyde } from "./entitiies/clyde.js";
import { Ghost } from "./entitiies/ghost.js";
import { Inky } from "./entitiies/inky.js";
import { PacMan } from "./entitiies/pacman.js";
import { Pinky } from "./entitiies/pinky.js";
import { Entity } from "./entity.js";
import { Renderer } from "./renderer.js";
import { spriteManager } from "./spriteManager.js";
import { Direction, boardCoordinate, canvasCoordinate, moveInfo } from "./types.js";

class GameBoard {

	static PACMAN_SCORE = 0;

	static readonly PURGATORY: [boardCoordinate, boardCoordinate] = [{ by: 17, bx: -1  }, { by: 17, bx: 28 }];
	
	static actualWidth: number;
	static actualHeight: number;
	
	static readonly height = 36;
	static readonly width = 28;

	private renderer: Renderer;

	private blinky: Blinky
	private inky: Inky
	private pinky: Pinky
	private clyde: Clyde

		// 0 is illegal, 1 is legal
		static readonly legalSpaces = [
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,0, 0,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,0,0,0,0,1,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,1,0,0,0,0,1,0],
			[0,1,0,0,0,0,1,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,1,0,0,0,0,1,0],
			[0,1,0,0,0,0,1,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,1,0,0,0,0,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,0,0,0,0,1,0,0,1,0,0,0,0, 0,0,0,0,1,0,0,1,0,0,0,0,1,0],
			[0,1,0,0,0,0,1,0,0,1,0,0,0,0, 0,0,0,0,1,0,0,1,0,0,0,0,1,0],
			[0,1,1,1,1,1,1,0,0,1,1,1,1,0, 0,1,1,1,1,0,0,1,1,1,1,1,1,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,1,1,1,1,1, 1,1,1,1,1,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,1,0,0,0,0, 0,0,0,0,1,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,1,0,0,0,0, 0,0,0,0,1,0,0,1,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,1,0,0,0,0, 0,0,0,0,1,1,1,1,1,1,1,1,1,1],
			[0,0,0,0,0,0,1,0,0,1,0,0,0,0, 0,0,0,0,1,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,1,0,0,0,0, 0,0,0,0,1,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,1,1,1,1,1, 1,1,1,1,1,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,1,0,0,0,0, 0,0,0,0,1,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,1,0,0,0,0, 0,0,0,0,1,0,0,1,0,0,0,0,0,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,0, 0,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,0,0,0,0,1,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,1,0,0,0,0,1,0],
			[0,1,0,0,0,0,1,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,1,0,0,0,0,1,0],
			[0,1,1,1,0,0,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,0,0,1,1,1,0],
			[0,0,0,1,0,0,1,0,0,1,0,0,0,0, 0,0,0,0,1,0,0,1,0,0,1,0,0,0],
			[0,0,0,1,0,0,1,0,0,1,0,0,0,0, 0,0,0,0,1,0,0,1,0,0,1,0,0,0],
			[0,1,1,1,1,1,1,0,0,1,1,1,1,0, 0,1,1,1,1,0,0,1,1,1,1,1,1,0],
			[0,1,0,0,0,0,0,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,0,0,0,0,0,1,0],
			[0,1,0,0,0,0,0,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,0,0,0,0,0,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		];
	
		// 0 is none, 1 is a dot, 2 is an energizer
		static readonly dotSpacesTemplate = [
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	
			[0,1,1,1,1,1,1,1,1,1,1,1,1,0, 0,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,0,0,0,0,1,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,1,0,0,0,0,1,0],
			[0,2,0,0,0,0,1,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,1,0,0,0,0,2,0],
			[0,1,0,0,0,0,1,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,1,0,0,0,0,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,0,0,0,0,1,0,0,1,0,0,0,0, 0,0,0,0,1,0,0,1,0,0,0,0,1,0],
			[0,1,0,0,0,0,1,0,0,1,0,0,0,0, 0,0,0,0,1,0,0,1,0,0,0,0,1,0],
			[0,1,1,1,1,1,1,0,0,1,1,1,1,0, 0,1,1,1,1,0,0,1,1,1,1,1,1,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,0, 0,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,0,0,0,0,1,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,1,0,0,0,0,1,0],
			[0,1,0,0,0,0,1,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,1,0,0,0,0,1,0],
			[0,2,1,1,0,0,1,1,1,1,1,1,1,0, 0,1,1,1,1,1,1,1,0,0,1,1,2,0],
			[0,0,0,1,0,0,1,0,0,1,0,0,0,0, 0,0,0,0,1,0,0,1,0,0,1,0,0,0],
			[0,0,0,1,0,0,1,0,0,1,0,0,0,0, 0,0,0,0,1,0,0,1,0,0,1,0,0,0],
			[0,1,1,1,1,1,1,0,0,1,1,1,1,0, 0,1,1,1,1,0,0,1,1,1,1,1,1,0],
			[0,1,0,0,0,0,0,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,0,0,0,0,0,1,0],
			[0,1,0,0,0,0,0,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,0,0,0,0,0,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		];
	
		private currentDotSpaces = [
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	
			[0,1,1,1,1,1,1,1,1,1,1,1,1,0, 0,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,0,0,0,0,1,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,1,0,0,0,0,1,0],
			[0,2,0,0,0,0,1,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,1,0,0,0,0,2,0],
			[0,1,0,0,0,0,1,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,1,0,0,0,0,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,0,0,0,0,1,0,0,1,0,0,0,0, 0,0,0,0,1,0,0,1,0,0,0,0,1,0],
			[0,1,0,0,0,0,1,0,0,1,0,0,0,0, 0,0,0,0,1,0,0,1,0,0,0,0,1,0],
			[0,1,1,1,1,1,1,0,0,1,1,1,1,0, 0,1,1,1,1,0,0,1,1,1,1,1,1,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,1,0,0,0,0,0,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,0, 0,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,1,0,0,0,0,1,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,1,0,0,0,0,1,0],
			[0,1,0,0,0,0,1,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,1,0,0,0,0,1,0],
			[0,2,1,1,0,0,1,1,1,1,1,1,1,0, 0,1,1,1,1,1,1,1,0,0,1,1,2,0],
			[0,0,0,1,0,0,1,0,0,1,0,0,0,0, 0,0,0,0,1,0,0,1,0,0,1,0,0,0],
			[0,0,0,1,0,0,1,0,0,1,0,0,0,0, 0,0,0,0,1,0,0,1,0,0,1,0,0,0],
			[0,1,1,1,1,1,1,0,0,1,1,1,1,0, 0,1,1,1,1,0,0,1,1,1,1,1,1,0],
			[0,1,0,0,0,0,0,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,0,0,0,0,0,1,0],
			[0,1,0,0,0,0,0,0,0,0,0,0,1,0, 0,1,0,0,0,0,0,0,0,0,0,0,1,0],
			[0,1,1,1,1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		];
	
		/**
		 * 0 is nothing
		 * 1 is quad1
		 * 2 is quad2
		 * 3 is quad3
		 * 4 is quad4 
		 * 5 is vertical bar
		 * 6 is horizontal bar
		 */
		static readonly board = [
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[2,6,6,6,6,6,6,6,6,6,6,6,6,3, 2,6,6,6,6,6,6,6,6,6,6,6,6,3],
			[5,0,0,0,0,0,0,0,0,0,0,0,0,5, 5,0,0,0,0,0,0,0,0,0,0,0,0,5],
			[5,0,2,6,6,3,0,2,6,6,6,3,0,5, 5,0,2,6,6,6,3,0,2,6,6,3,0,5],
			[5,0,5,0,0,5,0,5,0,0,0,5,0,5, 5,0,5,0,0,0,5,0,5,0,0,5,0,5],
			[5,0,1,6,6,4,0,1,6,6,6,4,0,1, 4,0,1,6,6,6,4,0,1,6,6,4,0,5],
			[5,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,5],
			[5,0,2,6,6,3,0,2,3,0,2,6,6,6, 6,6,6,3,0,2,3,0,2,6,6,3,0,5],
			[5,0,1,6,6,4,0,5,5,0,1,6,6,3, 2,6,6,4,0,5,5,0,1,6,6,4,0,5],
			[5,0,0,0,0,0,0,5,5,0,0,0,0,5, 5,0,0,0,0,5,5,0,0,0,0,0,0,5],
			[1,6,6,6,6,3,0,5,1,6,6,3,0,5, 5,0,2,6,6,4,5,0,2,6,6,6,6,4],
			[0,0,0,0,0,5,0,5,2,6,6,4,0,1, 4,0,1,6,6,3,5,0,5,0,0,0,0,0],
			[0,0,0,0,0,5,0,5,5,0,0,0,0,0, 0,0,0,0,0,5,5,0,5,0,0,0,0,0],
			[0,0,0,0,0,5,0,5,5,0,2,6,6,0, 0,6,6,3,0,5,5,0,5,0,0,0,0,0],
			[6,6,6,6,6,4,0,1,4,0,5,0,0,0, 0,0,0,5,0,1,4,0,1,6,6,6,6,6],
			[0,0,0,0,0,0,0,0,0,0,5,0,0,0, 0,0,0,5,0,0,0,0,0,0,0,0,0,0],
			[6,6,6,6,6,3,0,2,3,0,5,0,0,0, 0,0,0,5,0,2,3,0,2,6,6,6,6,6],
			[0,0,0,0,0,5,0,5,5,0,1,6,6,6, 6,6,6,4,0,5,5,0,5,0,0,0,0,0],
			[0,0,0,0,0,5,0,5,5,0,0,0,0,0, 0,0,0,0,0,5,5,0,5,0,0,0,0,0],
			[0,0,0,0,0,5,0,5,5,0,2,6,6,6, 6,6,6,3,0,5,5,0,5,0,0,0,0,0],
			[2,6,6,6,6,4,0,1,4,0,1,6,6,3, 2,6,6,4,0,1,4,0,1,6,6,6,6,3],
			[5,0,0,0,0,0,0,0,0,0,0,0,0,5, 5,0,0,0,0,0,0,0,0,0,0,0,0,5],
			[5,0,2,6,6,3,0,2,6,6,6,3,0,5, 5,0,2,6,6,6,3,0,2,6,6,3,0,5],
			[5,0,1,6,3,5,0,1,6,6,6,4,0,1, 4,0,1,6,6,6,4,0,5,2,6,4,0,5],
			[5,0,0,0,5,5,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,5,5,0,0,0,5],
			[1,6,3,0,5,5,0,2,3,0,2,6,6,6, 6,6,6,3,0,2,3,0,5,5,0,2,6,4],
			[2,6,4,0,1,4,0,5,5,0,1,6,6,3, 2,6,6,4,0,5,5,0,1,4,0,1,6,3],
			[5,0,0,0,0,0,0,5,5,0,0,0,0,5, 5,0,0,0,0,5,5,0,0,0,0,0,0,5],
			[5,0,2,6,6,6,6,4,1,6,6,3,0,5, 5,0,2,6,6,4,1,6,6,6,6,3,0,5],
			[5,0,1,6,6,6,6,6,6,6,6,4,0,1, 4,0,1,6,6,6,6,6,6,6,6,4,0,5],
			[5,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,5],
			[1,6,6,6,6,6,6,6,6,6,6,6,6,6, 6,6,6,6,6,6,6,6,6,6,6,6,6,4],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		]

	setRenderer(renderer: Renderer) {
		this.renderer = renderer;
	}

	setGhosts(blinky: Blinky, inky: Inky, pinky: Pinky, clyde: Clyde) {
		this.blinky = blinky;
		this.inky = inky;
		this.pinky = pinky;
		this.clyde = clyde;
	}

	/**
	 * Calculate the grid square coordinate on the gameboard.
	 * This does NOT adjust for the center
	 * @param coords The coordinates with respect to the canvas
	 * @returns The coordinate with respect to the gameboard
	 */
	static getPositionOnBoardGrid(coords: canvasCoordinate): boardCoordinate {

		return {
			by: Math.floor((coords.cy) / GameBoard.actualHeight * GameBoard.height),
			bx: Math.floor((coords.cx) / GameBoard.actualWidth * GameBoard.width),
		}
	}
	/**
	 * Get legal spaces that are around the coordinate in question
	 * @param baseCoordinate Cell coordinates that you want valid around
	 * @param directionFacing Needed for possibility of purgatory. If outside, won't matter
	 * @returns A list of coordinates which describe legal spaces around the target
	 */
	static getLegalMoves(baseCoordinate: boardCoordinate, directionFacing: Direction, isGhost=false): moveInfo[] {
		
		// console.log("	Legal Moves starting with coord", baseCoordinate);

		/**
		 * Check to see if the ghosts are in or adjacent to purgatory
		 * If a ghost is in left purgatory currently, it needs to have access to right purgatory. It also must be heading left
		 * And if in right it needs to have access to left. Heading right
		 * If the ghost is adjacent to right pergatory and facing right, then it needs to have access to it
		 * Same goes for left
		 */
		if (directionFacing === "left" && baseCoordinate.bx === GameBoard.PURGATORY[0].bx) {
			// Bring you over to right purgatory
			return [{
				baseCoordinate: baseCoordinate,
				coord: {...GameBoard.PURGATORY[1]},
				direction: "left"
			}];
		} else if (directionFacing == "right" && baseCoordinate.bx === GameBoard.PURGATORY[1].bx) {
			// Bring you to left
			return [{
				baseCoordinate: baseCoordinate,
				coord: {...GameBoard.PURGATORY[0]},
				direction: "right"
			}];
		} else if (directionFacing == "right" && baseCoordinate.bx === 27) {
			return [{
				baseCoordinate: baseCoordinate,
				coord: {...GameBoard.PURGATORY[1]},
				direction: "right"
			}];
		} else if (directionFacing === "left" && baseCoordinate.bx === 0) {
			return [{
				baseCoordinate: baseCoordinate,
				coord: {...GameBoard.PURGATORY[0]},
				direction: "left"
			}];
		} else if (isGhost && baseCoordinate.by === 14 && baseCoordinate.bx === 12) {
			return [
				{
					baseCoordinate: baseCoordinate,
					coord: { by: 14, bx: 11 },
					direction: "left"
				},
				{
					baseCoordinate: baseCoordinate,
					coord: { by: 14, bx: 13 },
					direction: "right"
				}
			]
		} else if (isGhost && baseCoordinate.by === 14 && baseCoordinate.bx === 15) {
			return [
				{
					baseCoordinate: baseCoordinate,
					coord: { by: 14, bx: 14 },
					direction: "left"
				},
				{
					baseCoordinate: baseCoordinate,
					coord: { by: 14, bx: 16 },
					direction: "right"
				}
			]
		} else if (isGhost && baseCoordinate.by === 26 && baseCoordinate.bx === 12) {
			return [
				{
					baseCoordinate: baseCoordinate,
					coord: { by: 26, bx: 11 },
					direction: "left"
				},
				{
					baseCoordinate: baseCoordinate,
					coord: { by: 26, bx: 13 },
					direction: "right"
				}
			]
		} else if (isGhost && baseCoordinate.by === 26 && baseCoordinate.bx === 15) {
			return [
				{
					baseCoordinate: baseCoordinate,
					coord: { by: 26, bx: 14 },
					direction: "left"
				},
				{
					baseCoordinate: baseCoordinate,
					coord: { by: 26, bx: 16 },
					direction: "right"
				}
			]
		}
		
		let ret: moveInfo[] = [];
		
		// Check left and right first (because we like the cache like that)
		if (baseCoordinate.bx > 0 && GameBoard.legalSpaces[baseCoordinate.by][baseCoordinate.bx - 1] === 1) {
			ret.push({
				baseCoordinate: baseCoordinate,
				coord: {by: baseCoordinate.by, bx: baseCoordinate.bx - 1},
				direction: "left"
			});
		}
		if (baseCoordinate.bx < (27) && GameBoard.legalSpaces[baseCoordinate.by][baseCoordinate.bx + 1] === 1) {
			ret.push({
				baseCoordinate: baseCoordinate,
				coord: {by: baseCoordinate.by, bx: baseCoordinate.bx + 1},
				direction: "right"
			});
		}
		if (baseCoordinate.by > 0 && GameBoard.legalSpaces[baseCoordinate.by - 1][baseCoordinate.bx] === 1) {
			ret.push({
				baseCoordinate: baseCoordinate,
				coord: {by: (baseCoordinate.by - 1), bx: baseCoordinate.bx},
				direction: "up"
			});
		}
		if (baseCoordinate.by < (GameBoard.height - 1) && GameBoard.legalSpaces[baseCoordinate.by + 1][baseCoordinate.bx] === 1) {
			ret.push({
				baseCoordinate: baseCoordinate,
				coord: {by: baseCoordinate.by + 1, bx: baseCoordinate.bx},
				direction: "down"
			});
		}


		return ret
	}

	static correctForPurgatory(entity: Entity, coord: canvasCoordinate, frameNo: number): boolean {

		// For the record, I can't figure out why latent information does not need to be updated
		// for the right direction and it does for the left
		// I ain't touching it because it seems to work
		
		if (entity instanceof Ghost || entity instanceof PacMan) {
			if (coord.cx > GameBoard.actualWidth && entity.direction === "right") {
				// console.group("	%cCorrecting for pergatory", 'color: #32CD32;')
				entity.setCanvasCoords(frameNo, {
					cy: this.PURGATORY[0].by*16,
					cx: this.PURGATORY[0].bx*16
				}, false, true);
				return true;
			} else if (coord.cx < -16 && entity.direction === "left") {
				entity.setCanvasCoords(frameNo, {
					cy: this.PURGATORY[1].by*16,
					cx: this.PURGATORY[1].bx*16
				}, false, true);
				return true;
			}
		}

		return false;
	}

	tryToEatDot(boardCoord: boardCoordinate) {
		if (this.currentDotSpaces[boardCoord.by][boardCoord.bx] === 1) {
			GameBoard.PACMAN_SCORE += 10;
			this.currentDotSpaces[boardCoord.by][boardCoord.bx] = 0;
			this.renderer.paintBackground({
				placementCoords: { cy: boardCoord.by * 16, cx: boardCoord.bx * 16},
				sheetCoords: spriteManager.blank[0]
			});
			this.renderer.clearBackgroundSpot(
				{ cy: boardCoord.by * 16, cx: boardCoord.bx * 16},
				{ y: 16, x: 16 }
			);
		}
	}

	drawMaze(frameNo: number): boolean {
		for (let i = 0; i < GameBoard.height; i++) {
			for (let j = 0; j < GameBoard.width; j++) {
				frameNo -= 1/25;
				if (frameNo <= 0) return;
				switch (GameBoard.board[i][j]) {
					case 1:
						this.renderer.paintBackground({
							placementCoords: {
								cx: j * 16,
								cy: i * 16
							},
							sheetCoords: spriteManager["quad1Corner"][0]
						});
						break;
					case 2:
						this.renderer.paintBackground({
							placementCoords: {
								cx: j * 16,
								cy: i * 16
							},
							sheetCoords: spriteManager["quad2Corner"][0]
						});
						break;
					case 3:
						this.renderer.paintBackground({
							placementCoords: {
								cx: j * 16,
								cy: i * 16
							},
							sheetCoords: spriteManager["quad3Corner"][0]
						});
						break;
					case 4:
						this.renderer.paintBackground({
							placementCoords: {
								cx: j * 16,
								cy: i * 16
							},
							sheetCoords: spriteManager["quad4Corner"][0]
						});
						break;
					case 5:
						this.renderer.paintBackground({
							placementCoords: {
								cx: j * 16,
								cy: i * 16
							},
							sheetCoords: spriteManager["verticalBar"][0]
						});
						break;
					case 6:
						this.renderer.paintBackground({
							placementCoords: {
								cx: j * 16,
								cy: i * 16
							},
							sheetCoords: spriteManager["horizontalBar"][0]
						});
						break;
				}
			};
		}
		if (frameNo >= 0) {
			return true;
		}
		return false;
	}

	drawDots(frameNo: number): boolean {
		// return;
		for (let i = 0; i < GameBoard.height; i++) {
			for (let j = 0; j < GameBoard.width; j++) {
				frameNo -= 1/25;
				if (frameNo <= 1008/25) return
				let num = GameBoard.dotSpacesTemplate[i][j];
				if (num == 1) {
					this.renderer.paintBackground({
						placementCoords: {
							cx: j * 16,
							cy: i * 16
						},
						sheetCoords: spriteManager["dot"][0]
					});
				} else if (num == 2) {
					this.renderer.paintBackground({
						placementCoords: {
							cx: j * 16,
							cy: i * 16
						},
						sheetCoords: spriteManager["energizer"][0]
					});
				}
			}
		}
		if (frameNo >= 1008/25) {
			return true;
		}
		return false
	}
}

export { GameBoard }