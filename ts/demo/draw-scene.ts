import * as mat4 from "../../packages/toji-gl-matrix-bc1bbf4/dist/esm/mat4.js";

// Tell WebGL how to pull out the positions from the position buffer into the vertex position attribute
function setPositionAttribute(gl: WebGLRenderingContext, buffers, programInfo: ProgramInfo) {
	const numComponents = 2;	// Pull out 2 values per iteration
	const type = gl.FLOAT; // The data in the buffer is 32bit floats
	const normalize = false;	// Don't normalize it
	const stride = 0;			// How many bytes to get from one set of values to the next
								// 0 means `use type and numComponents above`
	const offset = 0;			// How many bytes inside the buffer to start from
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
	gl.vertexAttribPointer(
		programInfo.attribLocations.vertexPosition,
		numComponents,
		type,
		normalize,
		stride,
		offset
	);

	gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

type ProgramInfo = { program: WebGLProgram; attribLocations: { vertexPosition: number; }; uniformLocations: { projectionMatrix: WebGLUniformLocation | null; modelViewMatrix: WebGLUniformLocation | null; }; };

function drawScene(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: any) {

	// Clear to black, fully opaque
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// Clear everything
	gl.clearDepth(1.0);

	// Enable depth testing
	gl.enable(gl.DEPTH_TEST);
	
	// Near things obscure far things
	gl.depthFunc(gl.LEQUAL);

	// Clear the canvas before we start drawing on it
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Create a perspective matrix
	// This is a special matrix used to simulate the distortion of perspective in a camera
	// Our field of view is 45 degrees, with a w/h ratio that matches the size of the canvas
	// We only want to see objects between 0.1 units and 100 units away from the camera

	const fieldOfView = (45 * Math.PI) / 180; // Radians
	const aspect = (gl.canvas as HTMLCanvasElement).clientWidth / (gl.canvas as HTMLCanvasElement).clientHeight;
	const zNear  = 0.1;
	const zFar = 100.0;
	const projectionMatrix = mat4.create();

	mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

	// Set drawing position to the "identitiy" point which is the center of the scene
	const modelViewMatrix = mat4.create();

	// Move the drawing position a bit to where we want to start drawing the square
	mat4.translate(
		modelViewMatrix, 	// Destination matrix
		modelViewMatrix, 	// Matrix to translate
		[-0.0, 0.0, -6.0]	// Amount to translate
	);

	// Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute
	setPositionAttribute(gl, buffers, programInfo);

	// Set the shader uniforms
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.projectionMatrix,
		false,
		projectionMatrix
	);
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.modelViewMatrix,
		false,
		modelViewMatrix
	);

	{
		const offset = 0;
		const vertexCount = 4;
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	}
}

export { drawScene }