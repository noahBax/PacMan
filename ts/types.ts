export type canvasCoordinate = {cy: number, cx: number};
export type boardCoordinate = {by: number, bx: number};

// Vector is measured in pixels / ms
export type vector = {x: number, y: number};

export type RenderObject = {
	placementCoords: canvasCoordinate,
	sheetCoords: canvasCoordinate,
	enlarge?: boolean
};

export type Direction = "up" | "down" | "left" | "right" | "none";

export type animationInfo = {
	up: spriteManagerItems,
	down: spriteManagerItems,
	left: spriteManagerItems,
	right: spriteManagerItems,
	none?: spriteManagerItems
}

export type moveInfo = {
	coord: boardCoordinate,
	direction: Direction,
	baseCoordinate: boardCoordinate
}

export interface GridCell extends HTMLDivElement {
	dataset: {
		boardX: string
		boardY: string
		canvasX: string
		canvasY: string
	}
}

export enum GhostIDs {
    BLINKY,// = "Blinky",
    PINKY,// = "Pinky",
    INKY,// = "Inky",
    CLYDE,// = "Clyde"
}

export enum GhostNames {
    BLINKY = "Blinky",
    PINKY = "Pinky",
    INKY = "Inky",
    CLYDE = "Clyde"
}

export type spriteManagerItems = "100" |
    "200" |
    "300" |
    "400" |
    "500" |
    "600" |
    "700" |
    "800" |
    "1000" |
    "pacdeath" |
    "pacRight" |
    "pacLeft" |
    "pacUp" |
    "pacDown" |
    "pacStatic" |
    "blinkyRight" |
    "blinkyLeft" |
    "blinkyUp" |
    "blinkyDown" |
    "pinkyRight" |
    "pinkyLeft" |
    "pinkyUp" |
    "pinkyDown" |
    "inkyRight" |
    "inkyLeft" |
    "inkyUp" |
    "inkyDown" |
    "clydeRight" |
    "clydeLeft" |
    "clydeUp" |
    "clydeDown" |
    "ghostFrightened" |
    "ghostSkeptical" |
    "eyes" |
    "energizer" |
    "dot" |
    "quad3Corner" |
    "quad2Corner" |
    "quad1Corner" |
    "quad4Corner" |
    "horizontalBar" |
    "verticalBar" |
    "blank"
