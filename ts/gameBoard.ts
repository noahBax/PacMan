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

	static readonly PURGATORY: [boardCoordinate, boardCoordinate] = [{ by: 17, bx: -1  }, { by: 17, bx: 28 }];
	
	static actualWidth: number;
	static actualHeight: number;
	
	static readonly width = 28;
	static readonly height = 36;

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
	 * Calculate the grid square coordinate on the gameboard
	 * @param coords The coordinates with respect to the canvas, not the board
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
	 * @param coords Coordinates with respect to the gameboard
	 * @param directionFacing Needed for possibility of purgatory. If outside, won't matter
	 * @returns A list of coordinates which describe legal spaces around the target
	 */
	static getLegalMoves(coords: boardCoordinate, directionFacing: Direction): moveInfo[] {
		console.log("	Legal Moves starting with coord", coords);

		// ToDo: Purgatory stuff! Not here though

		let ret: moveInfo[] = [];
		
		// Check left and right first (because we like the cache like that)
		if (coords.bx > 0 && GameBoard.legalSpaces[coords.by][coords.bx - 1] === 1) {
			ret.push({
				coord: {by: coords.by, bx: coords.bx - 1},
				direction: "left"
			});
		}
		if (coords.bx < (GameBoard.width - 1) && GameBoard.legalSpaces[coords.by][coords.bx + 1] === 1) {
			ret.push({
				coord: {by: coords.by, bx: coords.bx + 1},
				direction: "right"
			});
		}
		if (coords.by > 0 && GameBoard.legalSpaces[coords.by - 1][coords.bx] === 1) {
			ret.push({
				coord: {by: (coords.by - 1), bx: coords.bx},
				direction: "up"
			});
		}
		if (coords.by < (GameBoard.height - 1) && GameBoard.legalSpaces[coords.by + 1][coords.bx] === 1) {
			ret.push({
				coord: {by: coords.by + 1, bx: coords.bx},
				direction: "down"
			});
		}
		/**
		 * Now we will do a check to see if the ghosts are in or adjacent to purgatory
		 * If the ghost is either in purgatory or in a block at the either side of the board in a tunnel, then it has access to purgatory and it's surroundings
		 */
		if (coords.by === 17 && (coords.bx === 27 && directionFacing === "right" || coords.bx == 0 && directionFacing === "left")) {
			return [{
				coord: {...GameBoard.PURGATORY},
				direction: directionFacing
			}]
		} else if (coords.by === GameBoard.PURGATORY.by && coords.bx === GameBoard.PURGATORY.bx) {
			if (directionFacing === "left") {
				return [{
					coord: {
						by: 17,
						bx: 27
					},
					direction: "left"
				}];
			} else if (directionFacing === "right") {
				return [{
					coord: {
						by: 17,
						bx: 0
					},
					direction: "right"
				}];
			}
		}

		if (directionFacing === "left" && coords.by === GameBoard.PURGATORY[0].by && coords.bx === GameBoard.PURGATORY[0].bx) {
			// Bring you over to right purgatory
			
		}

		return ret
	}

	purgatoryCheck(frameNo: number) {
		// Todo: Add pacman to this list
		const list: Ghost[] = [this.blinky, this.inky, this.pinky, this.clyde];
		for (let i = 0; i < list.length; i++) {
			const entity = list[i];
			const coords = entity.knownCurrentBoardLocation;
			if (coords.by === GameBoard.PURGATORY.by && coords.bx === GameBoard.PURGATORY.bx) {
				if (entity.direction === "left") {
					// Put them on the right side, one offset from the edge
					entity.setInitial({ cy: 17, cx: GameBoard.width * 16 }, false, frameNo);
					console.log(entity.PET_NAME, "was in left purgatory");
				} else if (entity.direction === "right") {
					// Left side, -16
					entity.setInitial({ cy: 17, cx: -16 }, false, frameNo);
					console.log(entity.PET_NAME, "was in right purgatory");
				}
			}
		}
	}

	static isInPurgatory(entity: Ghost | PacMan) {
		if (entity instanceof Ghost) {
			return (entity.knownCurrentBoardLocation.by === GameBoard.PURGATORY.by && entity.knownCurrentBoardLocation.bx === GameBoard.PURGATORY.bx);
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