import { DevMode } from "./devmode.js";
import { devMode } from "./index.js";
import { Renderer } from "./renderer.js";
class Animator {
    constructor(foreground_ctx, background_ctx, spriteSheet, gameBoard) {
        this._entityList = [];
        this._prevFrameTime = 0;
        this._mazeFinishedDrawing = false;
        this._dotsFinishedDrawing = false;
        this._pauseTime = 0;
        this._renderer = new Renderer(foreground_ctx, background_ctx, spriteSheet);
        this._gameBoard = gameBoard;
        this._gameBoard.setRenderer(this._renderer);
    }
    registerEntity(entity) {
        this._entityList.push(entity);
    }
    startUpAnimation() {
        if (Animator.ACTIVE)
            window.requestAnimationFrame(this.handleFrame.bind(this));
        // Animator.ACTIVE = true;
    }
    handleFrame(timestamp) {
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
        });
        if (DevMode.IN_DEV_MODE) {
            devMode.updateFrameRate(timestamp);
            // devMode.updateTargets();
            devMode.updatePanelLocs(timestamp);
        }
        this._renderer.renderForeground(timestamp);
        window.requestAnimationFrame(this.handleFrame.bind(this));
    }
}
Animator.CURRENT_FRAME_NO = 0;
Animator.ACTIVE = true;
Animator.IN_SLOW_DOWN = false;
Animator.slowdownSpeed = 18;
export { Animator };
