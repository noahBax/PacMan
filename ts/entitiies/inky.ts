import { animationInfo, RenderObject } from "../types.js";
import { Ghost } from "./ghost.js";

class Inky extends Ghost {
	
	constructor() {
		super();

	}
	
	protected __animationInfo: animationInfo = {
		down: "inkyDown",
		left: "inkyLeft",
		right: "inkyRight",
		up: "inkyUp"
	};


}

export { Inky };