import { Ghost } from "./ghost.js";
class Clyde extends Ghost {
    constructor() {
        super();
        this.__animationInfo = {
            down: "clydeDown",
            left: "clydeLeft",
            right: "clydeRight",
            up: "clydeUp"
        };
    }
}
export { Clyde };
