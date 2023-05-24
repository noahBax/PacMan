"use strict";
class Renderer {
    static init(canvas) {
        Renderer.CANVAS = canvas;
        Renderer.gl = canvas.getContext("webgl");
    }
}
