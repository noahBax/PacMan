import { Animator } from "./animator.js";
class Controller {
    constructor(driving, animator) {
        this.buttonPressList = [];
        this.listUpdatedFlag = false;
        this._driving = driving;
        this._animator = animator;
        // Start listening to the keyboard
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        this._driving.setController(this);
    }
    handleKeyDown(event) {
        if (event.repeat)
            return;
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                this.pushToButtonList("up");
                // this.applyLastButton();
                break;
            case 'a':
            case 'ArrowLeft':
                this.pushToButtonList("left");
                // this.applyLastButton();
                break;
            case 's':
            case 'ArrowDown':
                this.pushToButtonList("down");
                // this.applyLastButton();
                break;
            case 'd':
            case 'ArrowRight':
                this.pushToButtonList("right");
                // this.applyLastButton();
                break;
            case "Escape":
                Animator.ACTIVE = !Animator.ACTIVE;
                this._animator.startUpAnimation();
        }
    }
    handleKeyUp(event) {
        if (event.repeat)
            return;
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                this.popFromButtonList("up");
                // this.applyLastButton();
                break;
            case 'a':
            case 'ArrowLeft':
                this.popFromButtonList("left");
                // this.applyLastButton();
                break;
            case 's':
            case 'ArrowDown':
                this.popFromButtonList("down");
                // this.applyLastButton();
                break;
            case 'd':
            case 'ArrowRight':
                this.popFromButtonList("right");
                // this.applyLastButton();
                break;
        }
    }
    pushToButtonList(dir) {
        this.listUpdatedFlag = true;
        if (!this.buttonPressList.includes(dir))
            this.buttonPressList.push(dir);
    }
    popFromButtonList(dir) {
        this.listUpdatedFlag = true;
        if (this.buttonPressList.includes(dir)) {
            this.buttonPressList.splice(this.buttonPressList.indexOf(dir), 1);
        }
    }
}
Controller.DRIVING_SPEED = 0.08;
export { Controller };
