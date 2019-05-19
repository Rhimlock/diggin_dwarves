import { gl } from "./gl.js";

const typeMapping = {
  Int8Array: gl.BYTE,
  Uint8Array: gl.UNSIGNED_BYTE,
  Int16Array: gl.SHORT,
  Uint16Array: gl.UNSIGNED_SHORT,
  Int32Array: gl.INT,
  Uint32Array: gl.UNSIGNED_INT,
  Float32Array: gl.FLOAT
};

class Buffer {
  constructor(data, stride, offset) {
    this.id = gl.createBuffer();
    this.type = typeMapping[data.constructor.name];
    this.stride = stride * data.BYTES_PER_ELEMENT;
    this.offset = offset * data.BYTES_PER_ELEMENT;
    this.data = data;
    this.update();
  }

  update() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
    gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
}

function getRect(x1, x2, y1, y2) {
  return [x1, y1, x1, y2, x2, y2, x2, y2, x2, y1, x1, y1];
}

function mergeRect(r1, r2, stride) {
  let arr = [];
  for (let i = 0; i < r1.length / stride; i++) {
    for (let n = 0; n < stride; n++) {
      arr.push(r1[i * stride + n]);
    }
    for (let n = 0; n < stride; n++) {
      arr.push(r2[i * stride + n]);
    }
  }
  return arr;
}
//quads for clipspace and texture
const vertices = new Int8Array(
  mergeRect(getRect(-1, 1, -1, 1), getRect(0, 1, 0, 1),2)
);

const buffer_vert = new Buffer(vertices);

export { Buffer, buffer_vert, getRect };
