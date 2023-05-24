import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";
// Creates a shader of teh given type, uploads the source and compiles it
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (shader == null) {
        alert(`Had trouble loading shader ${shader}`);
        return null;
    }
    // Send the source to the shader object
    gl.shaderSource(shader, source);
    // Compile the sshader program
    gl.compileShader(shader);
    // Check if it is successful
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(`An error occurred compiling shader ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }
    ;
    return shader;
}
// Initialize a shader program so WebGL knows how to draw our data
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (vertexShader == null || fragmentShader == null) {
        alert("Had trouble initializing shaders");
        return null;
    }
    // Create the shader program
    const shaderProgram = gl.createProgram();
    if (shaderProgram == null) {
        alert(`Had trouble loading shader program ${shaderProgram}`);
        return null;
    }
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    // Check if it succeeded
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(`Unable to initialize shader: ${gl.getProgramInfoLog(shaderProgram)}`);
        return null;
    }
    return shaderProgram;
}
function main() {
    // Vertex shader program
    const vsSource = `
		attribute vec4 aVertexPosition;
		uniform mat4 uModelViewMatrix;
		uniform mat4 uProjectionMatrix;
		void main() {
			gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
		}
	`;
    // Fragment shader program
    const fsSource = `
		void main() {
			gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
		}
	`;
    const canvas = document.querySelector("#renderBox");
    // Initialize context
    const gl = canvas.getContext("webgl");
    // Test to see if available
    if (gl === null) {
        alert("Unable to continue");
        return;
    }
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Initialize a shader program
    // Where all the lighting for the vertices and so forth is established
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    if (shaderProgram == null) {
        alert(`Had trouble initializing shader program`);
        return;
    }
    // Collect all the info needed to use the shader program
    // Look up wich attribute ou shader program is using for aVertexPosition and look up uniform locations
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        }
    };
    // Finally call the routine that builds all the objects we'll be drawing
    const buffers = initBuffers(gl);
    // Draw the scene
    drawScene(gl, programInfo, buffers);
}
main();
