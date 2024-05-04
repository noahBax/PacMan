class IdleController {
    constructor() {
        this.direction = "down";
    }
    updateDirection(boardCy) {
        // Oscillate around the y = 17 mark
        if (this.direction == "up" && boardCy < 17) {
            this.direction = "down";
            return true;
        }
        if (this.direction == "down" && boardCy > 17) {
            this.direction = "up";
            return true;
        }
        return false;
    }
}
export default IdleController;