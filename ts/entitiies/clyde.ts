import { animationInfo, RenderObject } from "../types.js";
import { Ghost } from "./ghost.js";

class Clyde extends Ghost {
	
	constructor() {
		super();

	}
	
	protected __animationInfo: animationInfo = {
		down: "clydeDown",
		left: "clydeLeft",
		right: "clydeRight",
		up: "clydeUp"
	};


}

export { Clyde };