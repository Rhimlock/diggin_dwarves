import { gl } from "./gl.js";

class View {
  constructor(x, y, zoom) {
    this.zoom = zoom;
    this.setPos(x, y);
    this.setSize(gl.canvas.clientWidth, gl.canvas.clientHeight);
  }

  setSize(width, height) {
    gl.canvas.width = width * this.zoom;
    gl.canvas.height = height * this.zoom;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  }
  setPos(x, y) {
    this.x = x * this.zoom;
    this.y = y * this.zoom;
    // window.scrollTo(fixCoord(x), fixCoord(y));
    this.x = fixCoord(this.x);
    this.y = fixCoord(this.y);
  }

  getCoords(clientX,clientY) {
    return {
      x: (clientX + window.pageXOffset ) * this.zoom,
      y: (clientY + window.pageYOffset ) * this.zoom
    }
  }
}
const fixCoord = (n) => Math.round(n/2) * 2;
const view = new View(0, 0, 0.3);

window.onresize = ev => {
  view.setSize(gl.canvas.clientWidth, gl.canvas.clientHeight);
};

window.onscroll = ev => {
  view.setPos(window.pageXOffset, window.pageYOffset);
};


export { view };
