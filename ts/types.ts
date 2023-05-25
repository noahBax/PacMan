export type coordinate = {x: number, y: number};

// Vector is measured in pixels / ms
export type vector = {x: number, y: number};

export type RenderObject = {
	placementCoords: coordinate,
	sheetCoords: coordinate
};

export type Direction = "up" | "down" | "left" | "right" | "none";

export type animationInfo = {
	up: string,
	down: string,
	left: string,
	right: string,
	static?: string
}

export type animationStatic = {
	
}