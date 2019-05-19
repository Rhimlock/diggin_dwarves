import { gl } from "./gl.js";

let nextNumber = 0;
const cache = {};
class Texture {
  constructor(data, width, height, name) {
    if (name && cache[name]) return cache[name];
    this.id = gl.createTexture();
    this.number = nextNumber++;
    this.resize(data, width, height);
    if (name) cache[name] = this;
  }
  resize(data, width, height) {
    gl.activeTexture(gl.TEXTURE0 + this.number);
    gl.bindTexture(gl.TEXTURE_2D, this.id);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (width || height) {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        width,
        height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        data
      );
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
    }
    this.width = width || data.width;
    this.height = height || data.height;
    this.sizeInv = new Float32Array([1 / this.width, 1 / this.height]);
  }
}
export { Texture };
