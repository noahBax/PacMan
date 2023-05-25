import { Ghost } from "./ghost.js";
class Inky extends Ghost {
    constructor() {
        super();
        this.__animationInfo = {
            down: "inkyDown",
            left: "inkyLeft",
            right: "inkyRight",
            up: "inkyUp"
        };
    }
}
export { Inky };
