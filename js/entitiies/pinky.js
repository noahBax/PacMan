import { Ghost } from "./ghost.js";
class Pinky extends Ghost {
    constructor() {
        super();
        this.__animationInfo = {
            down: "pinkyDown",
            left: "pinkyLeft",
            right: "pinkyRight",
            up: "pinkyUp"
        };
    }
}
export { Pinky };
