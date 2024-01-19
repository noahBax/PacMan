import { DevMode } from "./devmode.js";
import { PacMan } from "./entitiies/pacman.js";
import { Renderer } from "./renderer.js";
class Animator {
    constructor(foreground_ctx, background_ctx, spriteSheet, gameBoard) {
        this._entityList = [];
        this._prevFrameTime = 0;
        this._mazeFinishedDrawing = false;
        this._dotsFinishedDrawing = false;
        this._pauseTime = 0;
        // We need this flag because the files don't load instantly and pause time
        // needs to be updated
        this.animationStartedAlready = false;
        this._renderer = new Renderer(foreground_ctx, background_ctx, spriteSheet);
        this._gameBoard = gameBoard;
        this._gameBoard.setRenderer(this._renderer);
    }
    registerEntity(entity) {
        this._entityList.push(entity);
        if (entity instanceof PacMan)
            this._pacmanRef = entity;
    }
    startAnimating() {
        if (Animator.ACTIVE)
            window.requestAnimationFrame(this.handleFrame.bind(this));
        // Animator.ACTIVE = true;
    }
    handleFrame(timestamp) {
        if (!this.animationStartedAlready) {
            this._pauseTime = timestamp;
            this.animationStartedAlready = true;
        }
        if (!Animator.ACTIVE) {
            this._pauseTime += (timestamp - this._prevFrameTime);
            this._prevFrameTime = timestamp;
            window.requestAnimationFrame(this.handleFrame.bind(this));
            return;
        }
        // console.log(this._pauseTime, timestamp - this._pauseTime);
        Animator.CURRENT_FRAME_NO++;
        this._prevFrameTime = timestamp;
        timestamp -= this._pauseTime;
        // * Draw maze at the beginning
        if (!this._mazeFinishedDrawing)
            this._mazeFinishedDrawing = this._gameBoard.drawMaze(5600); //Animator.CURRENT_FRAME_NO);
        if (!this._dotsFinishedDrawing)
            this._dotsFinishedDrawing = this._gameBoard.drawDots(5600); //Animator.CURRENT_FRAME_NO);
        // * Draw each entity and cause them to update
        this._entityList.forEach(entity => {
            // console.log(entity.PET_NAME);
            const renderObj = entity.updateFrame(timestamp); //Animator.CURRENT_FRAME_NO);
            // console.log(renderObj)
            this._renderer.drawForeground(renderObj);
            console.log(entity);
        });
        this._gameBoard.tryToEatDot(timestamp, this._pacmanRef.recordedBoardPosition);
        // Todo: Use a developer variable
        if (DevMode.IN_DEV_MODE) {
            window.developer.updateFrameRate(timestamp);
            // window.developer.updateTargets();
            window.developer.updatePanelLocs(timestamp);
            window.developer.updateScore();
        }
        this._renderer.renderForeground(timestamp);
        this._renderer.renderBackground(timestamp);
        window.requestAnimationFrame(this.handleFrame.bind(this));
    }
}
Animator.CURRENT_FRAME_NO = 0;
Animator.ACTIVE = true;
Animator.IN_SLOW_DOWN = false;
Animator.slowdownSpeed = 18;
export { Animator };
