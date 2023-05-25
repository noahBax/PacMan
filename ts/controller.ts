import { Animator } from "./animator.js";
import { PacMan } from "./entitiies/pacman.js";
import { Entity } from "./entity.js";
import { Direction } from "./types.js";

class Controller {
	private driving: Entity;
	private lastKey: Direction = "none";

	constructor(driving: Entity) {
		this.driving = driving;

		// Start listening to the keyboard
		window.addEventListener('keydown', this.handleKeyUp.bind(this));
		window.addEventListener('keyup', this.handleKeyDown.bind(this));
	}

	private handleKeyUp(event: KeyboardEvent) {
		if (event.repeat) return;
		switch (event.key) {
			case 'w':
			case 'ArrowUp':
				this.lastKey = "up";
				console.log("Up Up")
				this.driving.__direction = "up";
				this.driving.setInitial(false, {x: 0, y: -PacMan.VELOCITY}, Animator.CURRENT_FRAME_NO);
				break;
			case 'a':
			case 'ArrowLeft':
				this.lastKey = "left";
				console.log("Up Left")
				this.driving.__direction = "left";
				this.driving.setInitial(false, {x: -PacMan.VELOCITY, y: 0}, Animator.CURRENT_FRAME_NO);
				break;
			case 's':
			case 'ArrowDown':
				this.lastKey = "down";
				console.log("Up Down")
				this.driving.__direction = "down";
				this.driving.setInitial(false, {x: 0, y: PacMan.VELOCITY}, Animator.CURRENT_FRAME_NO);
				break;
			case 'd':
			case 'ArrowRight':
				this.lastKey = "right";
				console.log("Up Right")
				this.driving.__direction = "right";
				this.driving.setInitial(false, {x: PacMan.VELOCITY, y: 0}, Animator.CURRENT_FRAME_NO);
				break;
		}
	}

	private handleKeyDown(event: KeyboardEvent) {
		if (event.repeat) return;
		switch (event.key) {
			case 'w':
			case 'ArrowUp':
				console.log("Down Up")
				if (this.lastKey === "up") {
					// this.pacman.direction = "none";
					this.driving.setInitial(false, {x: 0, y: 0}, Animator.CURRENT_FRAME_NO);
				}
				break;
			case 'a':
			case 'ArrowLeft':
				console.log("Down Left")
				if (this.lastKey === "left") {
					// this.pacman.direction = "none";
					this.driving.setInitial(false, {x: 0, y: 0}, Animator.CURRENT_FRAME_NO);
				}
				break;
			case 's':
			case 'ArrowDown':
				console.log("Down Down")
				if (this.lastKey === "down") {
					// this.pacman.direction = "none";
					this.driving.setInitial(false, {x: 0, y: 0}, Animator.CURRENT_FRAME_NO);
				}
				break;
			case 'd':
			case 'ArrowRight':
				console.log("Down Right")
				if (this.lastKey === "right") {
					// this.pacman.direction = "none";
					this.driving.setInitial(false, {x: 0, y: 0}, Animator.CURRENT_FRAME_NO);
				}
				break;
		}
	}
}

export { Controller }