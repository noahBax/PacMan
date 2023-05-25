import { GameBoard } from "./gameBoard.js";
class Renderer {
    constructor(foreground_ctx, background_ctx, spriteSheet) {
        this.width = 0;
        this.height = 0;
        this.foregroundDrawQueue = [];
        this.backgroundDrawQueue = [];
        this.foreground_ctx = foreground_ctx;
        this.foreground_ctx.imageSmoothingEnabled = false;
        this.background_ctx = background_ctx;
        this.background_ctx.imageSmoothingEnabled = false;
        this.width = foreground_ctx.canvas.width;
        this.height = foreground_ctx.canvas.height;
        this.spriteSheet = spriteSheet;
        GameBoard.actualHeight = this.height;
        GameBoard.actualWidth = this.width;
    }
    drawForeground(renderObj) {
        this.foregroundDrawQueue.push(renderObj);
    }
    renderForeground(frameNo) {
        // Clear frame first
        this.foreground_ctx.clearRect(0, 0, this.width, this.height);
        // Next draw what is in the queue
        this.foregroundDrawQueue.forEach(item => {
            this.foreground_ctx.drawImage(this.spriteSheet, item.sheetCoords.x, item.sheetCoords.y, 16, 16, item.placementCoords.x, item.placementCoords.y, 16, 16);
        });
        this.foregroundDrawQueue = [];
    }
    drawBackground(renderObj) {
        this.backgroundDrawQueue.push(renderObj);
    }
    renderBackground(frameNo) {
        // Clear frame first
        this.background_ctx.clearRect(0, 0, this.width, this.height);
        // Next draw what is in the queue
        this.backgroundDrawQueue.forEach(item => {
            this.background_ctx.drawImage(this.spriteSheet, item.sheetCoords.x, item.sheetCoords.y, 16, 16, item.placementCoords.x, item.placementCoords.y, 16, 16);
        });
        this.backgroundDrawQueue = [];
    }
    paintBackground(renderObj) {
        this.background_ctx.drawImage(this.spriteSheet, renderObj.sheetCoords.x, renderObj.sheetCoords.y, 16, 16, renderObj.placementCoords.x, renderObj.placementCoords.y, 16, 16);
    }
}
export { Renderer as Renderer };
