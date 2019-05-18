"use strict";

import { gl } from "./gl.js";
import { ShaderProgram } from "./shaderProgram.js";
import { Texture } from "./texture.js";
import { Buffer, getRect } from "./buffer.js";
import { VAO } from "./vao.js";

class Sprite {
  constructor(x, y, size, img) {
    this.buffer = new Buffer(new Int16Array(24), 0, 12);
    this.tex = new Texture(img, null, null, "sprite");
    this.prog = new ShaderProgram(vert, frag, "sprite", this.tex);
    this.vao = new VAO("sprite");
    const a = this.prog.attribs;
    this.vao.setAttributes(this.buffer, [a.aVert, a.aTex], false);
    gl.bindVertexArray(null);
    this.setPos(x, y, size);
  }

  setPos(x, y, size) {
    const s = size / 2;
    const vert = getRect(-s + x, s + x, -s + y, s + y);
    const tex = getRect(0, size, 0, size); // [0, 0, 0, size, size, size, size, size, size, 0, 0, 0];
    this.buffer.data = new Int16Array(vert.concat(tex));
    this.buffer.update();
  }

  draw(progress) {
    gl.bindVertexArray(this.vao.id);
    gl.useProgram(this.prog.id);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);
  }
}

const vert = `#version 300 es
  in vec2 aVert;
  in vec2 aTex;
  out vec2 vTexCoord;
  uniform vec2 uTexSizeInv;
  uniform vec2 uResInv;
void main() {
  vTexCoord = aTex * uTexSizeInv;
  gl_Position = vec4(aVert * uResInv , 0.0, 1.0);
}`;

const frag = `#version 300 es    
  precision mediump float;
  in vec2 vTexCoord;
  out vec4 outColor;
  uniform sampler2D uTex;
void main() {    
    outColor = texture(uTex, vTexCoord );   
}
`;

export { Sprite };
