import { Animator } from "./animator.js";
import { PacMan } from "./entitiies/pacman.js";
import { Entity } from "./entity.js";
import { Direction } from "./types.js";
import { Ghost } from "./entitiies/ghost.js";

class Controller {
	private driving: Entity;

	private animator: Animator;

	private buttonPressList: Direction[] = [];


	constructor(driving: Entity, animator: Animator) {
		this.driving = driving;
		this.animator = animator;

		// Start listening to the keyboard
		window.addEventListener('keydown', this.handleKeyDown.bind(this));
		window.addEventListener('keyup', this.handleKeyUp.bind(this));
	}

	private handleKeyDown(event: KeyboardEvent) {
		if (event.repeat) return;
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

	private handleKeyUp(event: KeyboardEvent) {
		if (event.repeat) return;
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

	private pushToButtonList(dir: Direction) {
		if (!this.buttonPressList.includes(dir)) this.buttonPressList.push(dir);
	}

	private popFromButtonList(dir: Direction) {
		if (this.buttonPressList.includes(dir)) {
			this.buttonPressList.splice(this.buttonPressList.indexOf(dir), 1);
		}
	}

	private applyLastButton() {
		if (this.buttonPressList.length === 0) {
			// Do nothing
			this.driving.setInitial(false, {x: 0, y: 0}, Animator.CURRENT_FRAME_NO);
		} else {
			this.driving.direction = this.buttonPressList[this.buttonPressList.length - 1];
			this.driving.setInitial(false, Ghost.getVectorFromDirection(this.driving.direction), Animator.CURRENT_FRAME_NO);
		}
	}
}

export { Controller }