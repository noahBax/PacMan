import { Animator } from "./animator.js";
import { Ghost } from "./entitiies/ghost.js";
class Controller {
    constructor(driving, animator) {
        this.buttonPressList = [];
        this.driving = driving;
        this.animator = animator;
        // Start listening to the keyboard
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }
    handleKeyDown(event) {
        if (event.repeat)
            return;
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                this.pushToButtonList("up");
                this.applyLastButton();
                break;
            case 'a':
            case 'ArrowLeft':
                this.pushToButtonList("left");
                this.applyLastButton();
                break;
            case 's':
            case 'ArrowDown':
                this.pushToButtonList("down");
                this.applyLastButton();
                break;
            case 'd':
            case 'ArrowRight':
                this.pushToButtonList("right");
                this.applyLastButton();
                break;
            case "Escape":
                Animator.ACTIVE = !Animator.ACTIVE;
                this.animator.startUpAnimation();
        }
    }
    handleKeyUp(event) {
        if (event.repeat)
            return;
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                this.popFromButtonList("up");
                this.applyLastButton();
                break;
            case 'a':
            case 'ArrowLeft':
                this.popFromButtonList("left");
                this.applyLastButton();
                break;
            case 's':
            case 'ArrowDown':
                this.popFromButtonList("down");
                this.applyLastButton();
                break;
            case 'd':
            case 'ArrowRight':
                this.popFromButtonList("right");
                this.applyLastButton();
                break;
        }
    }
    pushToButtonList(dir) {
        if (!this.buttonPressList.includes(dir))
            this.buttonPressList.push(dir);
    }
    popFromButtonList(dir) {
        if (this.buttonPressList.includes(dir)) {
            console.log("removing", dir, this.buttonPressList.indexOf(dir));
            this.buttonPressList.splice(this.buttonPressList.indexOf(dir), 1);
        }
    }
    applyLastButton() {
        if (this.buttonPressList.length === 0) {
            // Do nothing
            this.driving.setInitial(false, { x: 0, y: 0 }, Animator.CURRENT_FRAME_NO);
        }
        else {
            this.driving.direction = this.buttonPressList[this.buttonPressList.length - 1];
            this.driving.setInitial(false, Ghost.getVectorFromDirection(this.driving.direction), Animator.CURRENT_FRAME_NO);
        }
    }
}
export { Controller };
