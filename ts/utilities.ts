import { DRIVING_SPEED } from "./constants.js";
import { Direction, vector } from "./types.js";

export const vectorFromDirection: {[key in Direction]: vector} = {
	"up": {x: 0, y: -DRIVING_SPEED},
	"down": {x: 0, y: DRIVING_SPEED},
	"left": {x: -DRIVING_SPEED, y: 0},
	"right": {x: DRIVING_SPEED, y: 0},
	"none": { x: 0, y: 0}
}

export const penVectorFromDirection: {[key in Direction]: vector} = {
	"up": {x: 0, y: -DRIVING_SPEED / 3},
	"down": {x: 0, y: DRIVING_SPEED / 3},
	"left": {x: -DRIVING_SPEED / 3, y: 0},
	"right": {x: DRIVING_SPEED / 3, y: 0},
	"none": { x: 0, y: 0}
}