import { GameBoard } from "./gameBoard.js";
import { unpackCoords } from "./index.js";
class DevMode {
    constructor(dev_ctx, pacman, blinky, pinky, inky, clyde, animator, spriteSheet, gameBoard) {
        this.frameRateBuffer = [0, 0, 0, 0, 0, 0, 0];
        this.frbIndex = 0;
        this.lastTimeOfFrame = 0;
        this._gridRendered = false;
        this._gridCells = [];
        this._panelLocationIDs = ["blinkyLoc", "inkyLoc", "pinkyLoc", "clydeLoc"];
        this._panelTargetIDs = ["blinkyTarget", "inkyTarget", "pinkyTarget", "clydeTarget"];
        this._ghostColors = ["#ff0000", "#00ffff", "#FCB5FF", "#F8BB55"];
        this._targetTileCollection = [];
        this._tilesRendered = false;
        this.dev_ctx = dev_ctx;
        this._pacman = pacman;
        this._blinky = blinky;
        this._inky = inky;
        this._pinky = pinky;
        this._clyde = clyde;
        this._animator = animator;
        this._gameBoard = gameBoard;
        this._spriteSheet = spriteSheet;
        this._tempCanvas = document.createElement("canvas");
        this._temp_ctx = this._tempCanvas.getContext("2d");
        this._cachedGrid = document.createElement("canvas");
        this._temp_ctx = this._tempCanvas.getContext("2d");
        this._cellCollectionEle = document.createElement("div");
        this._cellCollectionEle.id = "cellBox";
        this.frameRateElement = document.getElementById("frameRate");
        this._scoreEle = document.getElementById("devGameScore");
        for (let i = 0; i < 4; i++) {
            let t = document.createElement("div");
            t.classList.add("targetTileCover");
            t.dataset.boardX = "" + 0;
            t.dataset.boardY = "" + 0;
            t.dataset.canvasX = "" + 0;
            t.dataset.canvasY = "" + 0;
            t.style.backgroundColor = this._ghostColors[i];
            this._targetTileCollection.push(t);
            this._cellCollectionEle.appendChild(t);
        }
        this._ghosts = [this._blinky, this._inky, this._pinky, this._clyde];
    }
    updateScore() {
        this._scoreEle.textContent = "" + GameBoard.PACMAN_SCORE;
    }
    renderGridTiles() {
        document.getElementById("easel").appendChild(this._cellCollectionEle);
        this._tempCanvas.width = 16;
        this._tempCanvas.height = 16;
        this._temp_ctx.setLineDash([2, 2]);
        this._temp_ctx.lineWidth = 1;
        const leftMoveValue = this._cellCollectionEle.getBoundingClientRect().width / GameBoard.width; //GameBoard.width;
        const topMoveValue = this._cellCollectionEle.getBoundingClientRect().height / GameBoard.height; //GameBoard.height;
        const topOffsetDistance = window.scrollY + this._cellCollectionEle.getBoundingClientRect().top;
        const leftOffsetDistance = window.scrollX + this._cellCollectionEle.getBoundingClientRect().left;
        // Take care of the cover tiles first
        for (let i = 0; i < 4; i++) {
            let t = this._targetTileCollection[i];
            t.style.width = leftMoveValue + "px";
            t.style.height = topMoveValue + "px";
        }
        // this._temp_ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
        // this._temp_ctx.moveTo(0,16);
        // this._temp_ctx.lineTo(0,0);
        // this._temp_ctx.lineTo(16,0);
        // this._temp_ctx.stroke();
        for (let i = 0; i < GameBoard.height; i++) {
            this._gridCells.push([]);
            for (let j = 0; j < GameBoard.width; j++) {
                // Create teh GridCell element
                const num = document.createElement("div");
                // Put a copy of the grid cell onto the dev canvas
                this._paintDeveloper({ placementCoords: { cx: j * 16, cy: i * 16 }, sheetCoords: { cx: 0, cy: 0 } }, this._tempCanvas);
                // Add appropriate class
                num.classList.add(DevMode.GRID_CELL_CLASS);
                // Move to correct location
                num.style.width = leftMoveValue + "px";
                num.style.height = topMoveValue + "px";
                num.style.top = topOffsetDistance + i * topMoveValue + "px";
                num.style.left = leftOffsetDistance + j * leftMoveValue + "px";
                num.dataset.boardX = "" + j;
                num.dataset.boardY = "" + i;
                num.dataset.canvasX = leftOffsetDistance + j * leftMoveValue + "px";
                num.dataset.canvasY = topOffsetDistance + i * topMoveValue + "px";
                // Add event listeners
                num.addEventListener("mouseenter", this._displayGridCoord);
                num.addEventListener("mouseleave", this._dismissGridCoord);
                this._cellCollectionEle.appendChild(num);
                this._gridCells[i].push(num);
            }
        }
        this._temp_ctx.clearRect(0, 0, 16, 16);
        this._temp_ctx.setLineDash([]);
        this._tilesRendered = true;
    }
    updateFrameRate(time) {
        this.frameRateBuffer[this.frbIndex] = time - this.lastTimeOfFrame;
        console.log(this.frameRateBuffer);
        this.lastTimeOfFrame = time;
        this.frbIndex = (this.frbIndex + 1) % 7; //this.frameRateBuffer.length
        this.frameRateElement.textContent = Math.round(1000 / (this.frameRateBuffer.reduce((acc, curr) => acc + curr) / 7)) + " fps";
    }
    updateTargets() {
        if (!this._tilesRendered)
            return;
        const entities = [this._blinky, this._inky, this._pinky, this._clyde];
        for (let i = 0; i < 4; i++) {
            let targetTile = this._targetTileCollection[i];
            let target = entities[i].targetCoord;
            // console.log(entities[i].PET_NAME, target, this._gridCells[target.by]);
            let targetCellStats = this._gridCells[target.by][target.bx].dataset;
            // targetTile.style.position = "absolute";
            targetTile.style.left = targetCellStats.canvasX;
            targetTile.style.top = targetCellStats.canvasY;
            // console.log("drawn");
        }
    }
    updatePanelLocs(frameNo) {
        for (let i = 0; i < this._panelLocationIDs.length; i++) {
            let e = this._ghosts[i].getBoardCoordinates(frameNo);
            document.getElementById(this._panelLocationIDs[i]).textContent = `[${e.by}, ${e.bx}]`;
            e = this._ghosts[i].targetCoord;
            document.getElementById(this._panelTargetIDs[i]).textContent = unpackCoords(e);
        }
    }
    /**
     * Paint onto the developer canvas
     * @param renderObj Location of placement of graphics on canvas and coordinate on sheet
     * @param image Use this for custom elements. If you use it ignore the sheet corrdinates on renderObject
     */
    _paintDeveloper(renderObj, image, ctx) {
        if (!!image) {
            this.dev_ctx.drawImage(image, renderObj.placementCoords.cx, renderObj.placementCoords.cy);
            return;
        }
        this.dev_ctx.drawImage(this._spriteSheet, renderObj.sheetCoords.cx, renderObj.sheetCoords.cy, 16, 16, renderObj.placementCoords.cx, renderObj.placementCoords.cy, 16, 16);
    }
    _displayGridCoord(event) {
        const cell = event.target;
        document.getElementById("tileLocation").textContent = `Selected Location: [${cell.dataset.boardY}, ${cell.dataset.boardX}]`;
    }
    _dismissGridCoord(event) {
        var _a;
        if (!((_a = event.relatedTarget) === null || _a === void 0 ? void 0 : _a.classList.contains(DevMode.GRID_CELL_CLASS))) {
            document.getElementById("tileLocation").textContent = `Selected Location: None`;
        }
    }
}
DevMode.GRID_CELL_CLASS = "gridCellClass";
DevMode.TARGET_CELL_CLASS = "targetTile";
DevMode.IN_DEV_MODE = true;
export { DevMode };
