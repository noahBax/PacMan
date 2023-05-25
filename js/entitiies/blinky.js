import { Ghost } from "./ghost.js";
class Blinky extends Ghost {
    constructor() {
        super();
        this.__animationInfo = {
            down: "blinkyDown",
            left: "blinkyLeft",
            right: "blinkyRight",
            up: "blinkyUp"
        };
    }
}
export { Blinky };
