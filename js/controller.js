import { Animator } from "./animator.js";
import { PacMan } from "./entitiies/pacman.js";
class Controller {
    constructor(driving) {
        this.lastKey = "right";
        this.driving = driving;
        // Start listening to the keyboard
        window.addEventListener('keydown', this.handleKeyUp.bind(this));
        window.addEventListener('keyup', this.handleKeyDown.bind(this));
    }
    handleKeyUp(event) {
        if (event.repeat)
            return;
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                this.lastKey = "up";
                this.driving.direction = "up";
                this.driving.setInitial(false, { x: 0, y: -PacMan.SPEED }, Animator.CURRENT_FRAME_NO);
                break;
            case 'a':
            case 'ArrowLeft':
                this.lastKey = "left";
                this.driving.direction = "left";
                this.driving.setInitial(false, { x: -PacMan.SPEED, y: 0 }, Animator.CURRENT_FRAME_NO);
                break;
            case 's':
            case 'ArrowDown':
                this.lastKey = "down";
                this.driving.direction = "down";
                this.driving.setInitial(false, { x: 0, y: PacMan.SPEED }, Animator.CURRENT_FRAME_NO);
                break;
            case 'd':
            case 'ArrowRight':
                this.lastKey = "right";
                this.driving.direction = "right";
                this.driving.setInitial(false, { x: PacMan.SPEED, y: 0 }, Animator.CURRENT_FRAME_NO);
                break;
        }
    }
    handleKeyDown(event) {
        if (event.repeat)
            return;
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                if (this.lastKey === "up") {
                    // this.pacman.direction = "none";
                    this.driving.setInitial(false, { x: 0, y: 0 }, Animator.CURRENT_FRAME_NO);
                }
                break;
            case 'a':
            case 'ArrowLeft':
                if (this.lastKey === "left") {
                    // this.pacman.direction = "none";
                    this.driving.setInitial(false, { x: 0, y: 0 }, Animator.CURRENT_FRAME_NO);
                }
                break;
            case 's':
            case 'ArrowDown':
                if (this.lastKey === "down") {
                    // this.pacman.direction = "none";
                    this.driving.setInitial(false, { x: 0, y: 0 }, Animator.CURRENT_FRAME_NO);
                }
                break;
            case 'd':
            case 'ArrowRight':
                if (this.lastKey === "right") {
                    // this.pacman.direction = "none";
                    this.driving.setInitial(false, { x: 0, y: 0 }, Animator.CURRENT_FRAME_NO);
                }
                break;
        }
    }
}
export { Controller };
