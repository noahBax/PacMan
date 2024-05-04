import { canvasCoordinate, spriteManagerItems } from "./types.js"

/**
 * Each sprite on spritesheet is 16x16
 * There is a 3px offset on the left
 */
const spriteManager: {[key in spriteManagerItems]: canvasCoordinate[]} = {
    "100": [ {"cx": 3, "cy": 144 } ],
    "200": [ {"cx": 3, "cy": 128 } ],
    "300": [ {"cx": 19, "cy": 144 } ],
    "400": [ {"cx": 19, "cy": 128 } ],
    "500": [ {"cx": 35, "cy": 144 } ],
    "600": [ {"cx": 35, "cy": 128 } ],
    "700": [ {"cx": 51, "cy": 144 } ],
    "800": [ {"cx": 51, "cy": 128 } ],
    "1000": [ {"cx": 67, "cy": 144 } ],
    "pacdeath": [ {"cx": 3, "cy": 0 }, {"cx": 19, "cy": 0 }, {"cx": 35, "cy": 0 }, {"cx": 51, "cy": 0 }, {"cx": 67, "cy": 0 }, {"cx": 83, "cy": 0 }, {"cx": 99, "cy": 0 }, {"cx": 115, "cy": 0 }, {"cx": 131, "cy": 0 }, {"cx": 147, "cy": 0 }, {"cx": 163, "cy": 0 }, {"cx": 179, "cy": 0 }, {"cx": 195, "cy": 0 }, {"cx": 211, "cy": 0 } ],
    "pacRight": [ {"cx": 3, "cy": 0 }, {"cx": 19, "cy": 0 }, {"cx": 35, "cy": 0 }, {"cx": 19, "cy": 0 } ],
    "pacLeft": [ {"cx": 3, "cy": 16 }, {"cx": 19, "cy": 16 }, {"cx": 35, "cy": 0 }, {"cx": 19, "cy": 16 } ],
    "pacUp": [ {"cx": 3, "cy": 32 }, {"cx": 19, "cy": 32 }, {"cx": 35, "cy": 0 }, {"cx": 19, "cy": 32 } ],
    "pacDown": [ {"cx": 3, "cy": 48 }, {"cx": 19, "cy": 48 }, {"cx": 35, "cy": 0 }, {"cx": 19, "cy": 48 } ],
    "pacStatic": [ {"cx": 35, "cy": 0 } ],
    "blinkyRight": [ {"cx": 3, "cy": 64 }, {"cx": 19, "cy": 64 } ],
    "blinkyLeft": [ {"cx": 35, "cy": 64 }, {"cx": 51, "cy": 64 } ],
    "blinkyUp": [ {"cx": 67, "cy": 64 }, {"cx": 83, "cy": 64 } ],
    "blinkyDown": [ {"cx": 99, "cy": 64 }, {"cx": 115, "cy": 64 } ],
    "pinkyRight": [ {"cx": 3, "cy": 80 }, {"cx": 19, "cy": 80 } ],
    "pinkyLeft": [ {"cx": 35, "cy": 80 }, {"cx": 51, "cy": 80 } ],
    "pinkyUp": [ {"cx": 67, "cy": 80 }, {"cx": 83, "cy": 80 } ],
    "pinkyDown": [ {"cx": 99, "cy": 80 }, {"cx": 115, "cy": 80 } ],
    "inkyRight": [ {"cx": 3, "cy": 96 }, {"cx": 19, "cy": 96 } ],
    "inkyLeft": [ {"cx": 35, "cy": 96 }, {"cx": 51, "cy": 96 } ],
    "inkyUp": [ {"cx": 67, "cy": 96 }, {"cx": 83, "cy": 96 } ],
    "inkyDown": [ {"cx": 99, "cy": 96 }, {"cx": 115, "cy": 96 } ],
    "clydeRight": [ {"cx": 3, "cy": 112 }, {"cx": 19, "cy": 112 } ],
    "clydeLeft": [ {"cx": 35, "cy": 112 }, {"cx": 51, "cy": 112 } ],
    "clydeUp": [ {"cx": 67, "cy": 112 }, {"cx": 83, "cy": 112 } ],
    "clydeDown": [ {"cx": 99, "cy": 112 }, {"cx": 115, "cy": 112 } ],
    "ghostFrightened": [ {"cx": 131, "cy": 64 }, {"cx": 147, "cy": 64 } ],
    "ghostSkeptical": [ {"cx": 163, "cy": 64 }, {"cx": 179, "cy": 64 }, {"cx": 131, "cy": 64 }, {"cx": 147, "cy": 64 } ],
    "eyes": [ {"cx": 163, "cy": 80 }, {"cx": 179, "cy": 80 }, {"cx": 131, "cy": 80 }, {"cx": 147, "cy": 80 } ],
	"energizer": [ {"cx": 163, "cy": 16} ],
	"dot": [ {"cx": 147, "cy": 16} ],
	"quad3Corner": [ {"cx": 179, "cy": 16} ],
	"quad2Corner": [ {"cx": 195, "cy": 16} ],
	"quad1Corner": [ {"cx": 211, "cy": 16} ],
	"quad4Corner": [ {"cx": 211, "cy": 32} ],
	"horizontalBar": [ {"cx": 195, "cy": 32 }],
	"verticalBar": [ {"cx": 179, "cy": 32}],
	"blank": [ {"cx": 211,"cy": 144} ]	// This is just a space in the bottom right

};

export default spriteManager;