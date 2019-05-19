const gl = document.getElementById("cnv").getContext("webgl2", {
  antialias: false,
  depth: false,
  alpha: false,
  preserveDrawingBuffer: false
});
if (!gl) throw "your browser fails at webgl2";
gl.canvas.width = gl.canvas.clientWidth;
gl.canvas.height = gl.canvas.clientHeight;
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
gl.clearColor(0.5, 0.5, 0.5, 0.9);
gl.enable(gl.DEPTH_TEST);
gl.clear(gl.COLOR_BUFFER_BIT);


const drawables = [];

function render(progress) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  for (let i = 0; i < drawables.length; ++i) {
    const d = drawables[i];
    if (d.show) {
      d.draw(progress);
    }
  }
}

export { gl, render, drawables };
