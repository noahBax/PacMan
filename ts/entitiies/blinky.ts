import { animationInfo, RenderObject } from "../types.js";
import { Ghost } from "./ghost.js";

class Blinky extends Ghost {
	
	constructor() {
		super();

	}
	
	protected __animationInfo: animationInfo = {
		down: "blinkyDown",
		left: "blinkyLeft",
		right: "blinkyRight",
		up: "blinkyUp"
	};


}

export { Blinky };