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
        // console.log(this.foregroundDrawQueue);
        this.foregroundDrawQueue.forEach(item => {
            if (item.enlarge) {
                this.foreground_ctx.drawImage(this.spriteSheet, item.sheetCoords.cx, item.sheetCoords.cy, 16, 16, item.placementCoords.cx - 2, item.placementCoords.cy - 2, 20, 20);
            }
            else {
                this.foreground_ctx.drawImage(this.spriteSheet, item.sheetCoords.cx, item.sheetCoords.cy, 16, 16, item.placementCoords.cx, item.placementCoords.cy, 16, 16);
            }
        });
        this.foregroundDrawQueue = [];
    }
    drawBackground(renderObj) {
        this.backgroundDrawQueue.push(renderObj);
    }
    renderBackground(frameNo) {
        if (this.backgroundDrawQueue.length === 0)
            return;
        // Clear frame first
        this.background_ctx.clearRect(0, 0, this.width, this.height);
        // Next draw what is in the queue
        this.backgroundDrawQueue.forEach(item => {
            this.background_ctx.drawImage(this.spriteSheet, item.sheetCoords.cx, item.sheetCoords.cy, 16, 16, item.placementCoords.cx, item.placementCoords.cy, 16, 16);
        });
        this.backgroundDrawQueue = [];
    }
    paintBackground(renderObj) {
        this.background_ctx.drawImage(this.spriteSheet, renderObj.sheetCoords.cx, renderObj.sheetCoords.cy, 16, 16, renderObj.placementCoords.cx, renderObj.placementCoords.cy, 16, 16);
    }
    clearBackgroundSpot(placementCoords, size) {
        this.background_ctx.clearRect(placementCoords.cx, placementCoords.cy, size.x, size.y);
    }
}
export { Renderer as Renderer };
