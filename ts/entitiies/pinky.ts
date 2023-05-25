import { animationInfo, RenderObject } from "../types.js";
import { Ghost } from "./ghost.js";

class Pinky extends Ghost {
	
	constructor() {
		super();

	}
	
	protected __animationInfo: animationInfo = {
		down: "pinkyDown",
		left: "pinkyLeft",
		right: "pinkyRight",
		up: "pinkyUp"
	};


}

export { Pinky };