import { Renderer } from "./renderer.js";
class Animator {
    constructor(foreground_ctx, background_ctx, spriteSheet, gameBoard) {
        this.entityList = [];
        this.prevFrameTime = 0;
        this.mazeFinishedDrawing = false;
        this.dotsFinishedDrawing = false;
        this.renderer = new Renderer(foreground_ctx, background_ctx, spriteSheet);
        this.gameBoard = gameBoard;
        this.gameBoard.setRenderer(this.renderer);
        window.requestAnimationFrame(this.handleFrame.bind(this));
    }
    registerEntity(entity) {
        this.entityList.push(entity);
    }
    handleFrame(timestamp) {
        // * Do time business logic yadayada
        if (timestamp - this.prevFrameTime < 1000 / 10) {
            window.requestAnimationFrame(this.handleFrame.bind(this));
            return;
        }
        Animator.CURRENT_FRAME_NO++;
        this.prevFrameTime = timestamp;
        // * Draw maze at the beginning
        if (!this.mazeFinishedDrawing)
            this.mazeFinishedDrawing = this.gameBoard.drawMaze(5000); //Animator.CURRENT_FRAME_NO);
        if (!this.dotsFinishedDrawing)
            this.dotsFinishedDrawing = this.gameBoard.drawDots(5000); //Animator.CURRENT_FRAME_NO);
        // * Draw each entity and cause them to update
        this.entityList.forEach(entity => {
            const renderObj = entity.updateFrame(Animator.CURRENT_FRAME_NO);
            this.renderer.drawForeground(renderObj);
        });
        this.renderer.renderForeground(Animator.CURRENT_FRAME_NO);
        window.requestAnimationFrame(this.handleFrame.bind(this));
    }
}
Animator.CURRENT_FRAME_NO = 0;
export { Animator };
