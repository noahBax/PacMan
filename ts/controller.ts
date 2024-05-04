import { Animator } from "./animator.js";
import { PACMAN } from "./director.js";
import { PacMan } from "./entitiies/pacman.js";
import { Direction } from "./types.js";

class Controller {

	private _animator: Animator;

	buttonPressList: Exclude<Direction, "none">[] = [];

	listUpdatedFlag = false;


	constructor(animator: Animator) {
		this._animator = animator;

		// Start listening to the keyboard
		window.addEventListener('keydown', this.handleKeyDown.bind(this));
		window.addEventListener('keyup', this.handleKeyUp.bind(this));

		PACMAN.setController(this);
	}

	private handleKeyDown(event: KeyboardEvent) {
		if (event.repeat) return;
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
				this._animator.startAnimating();
		}
	}

	private handleKeyUp(event: KeyboardEvent) {
		if (event.repeat) return;
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

	private pushToButtonList(dir: Exclude<Direction, "none">) {
		this.listUpdatedFlag = true;
		if (!this.buttonPressList.includes(dir)) this.buttonPressList.push(dir);
	}

	private popFromButtonList(dir: Exclude<Direction, "none">) {
		this.listUpdatedFlag = true;
		if (this.buttonPressList.includes(dir)) {
			this.buttonPressList.splice(this.buttonPressList.indexOf(dir), 1);
		}
	}

	// private applyLastButton() {
	// 	if (this._buttonPressList.length === 0) {
	// 		// Do nothing
	// 		this._driving.updateCanvasCoords(Animator.CURRENT_FRAME_NO);
	// 		this._driving.setVelocityVector({x: 0, y: 0}, this._driving.direction, Animator.CURRENT_FRAME_NO);
	// 	} else {
	// 		this._driving.direction = this._buttonPressList[this._buttonPressList.length - 1];
	// 		this._driving.updateCanvasCoords(Animator.CURRENT_FRAME_NO);
	// 		this._driving.setVelocityVector(Ghost.getVectorFromDirection(this._driving.direction), this._driving.direction, Animator.CURRENT_FRAME_NO);
	// 	}
	// }
}

export { Controller }