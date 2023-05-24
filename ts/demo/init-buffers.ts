function initPositionBuffer(gl: WebGLRenderingContext) {

	// Create a buffer for the square's positions
	const positionBuffer = gl.createBuffer();

	// Select the positionBuffer as the one to apply buffer operations to from here out
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Create an array of positions for the square
	const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

	// Pass the list of positions into WebGL to build the shape
	// Do this by creating a Float32Array from the array before then put it in the current buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	return positionBuffer;
}

function initBuffers(gl: WebGLRenderingContext) {
	const positionBuffer = initPositionBuffer(gl);

	return {
		position: positionBuffer
	};
}

export { initBuffers };