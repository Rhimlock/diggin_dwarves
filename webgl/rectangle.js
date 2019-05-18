"use strict";

import { gl } from "./gl.js";
import { ShaderProgram } from "./shaderProgram.js";
import { Buffer } from "./buffer.js";
import { VAO } from "./vao.js";
import { view } from "./view.js";
class Rectangle {
  constructor() {
      this.x = 0;
      this.y = 0;
      this.x2 = 0;
      this.y2 = 0;
      this.r = 1;
      this.g = 1;
      this.b = 1;
    this.buffer = new Buffer(new Int16Array(4 * 2));
    this.prog = new ShaderProgram(vert, frag, "rectangle");
    this.vao = new VAO("");
    const a = this.prog.attribs;
    this.vao.setAttributes(this.buffer, [a.aVert], false);
    gl.bindVertexArray(null);
    this.show = false;
  }
  updateRect() {
    const arr = this.buffer.data;
    arr[0] = this.x;
    arr[1] = this.y;
    arr[2] = this.x2;
    arr[3] = this.y;
    arr[4] = this.x2;
    arr[5] = this.y2;
    arr[6] = this.x;
    arr[7] = this.y2;
    
    this.buffer.update();
  }
  
  setColor(r,g,b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  draw() {
    this.updateRect();
      gl.bindVertexArray(this.vao.id);
      gl.useProgram(this.prog.id);
      gl.uniform2f(this.prog.uniforms.uView.id, view.x, view.y);
      gl.uniform2f(
        this.prog.uniforms.uResInv.id,
        1 / gl.drawingBufferWidth,
        1 / gl.drawingBufferHeight
      );
      gl.uniform3f(this.prog.uniforms.uColor.id,this.r, this.g, this.b);
      gl.drawArrays(gl.LINE_LOOP, 0, 4);
      gl.bindVertexArray(null);

  }
}

const vert = `#version 300 es
  in vec2 aVert;
  out vec2 c;
  uniform vec2 uResInv;
  uniform vec2 uView;
void main() {
  vec2  v = aVert.xy * 2.0 - uView * 2.0;
  v.y *= -1.0;
  gl_Position = vec4(v * uResInv + vec2(-1.0,1.0), 0.0, 1.0);  
  c = aVert;
}`;

const frag = `#version 300 es    
  precision mediump float;
  in vec2 c;
  uniform vec3 uColor;
  out vec4 outColor;
void main() {    
    outColor = vec4(uColor,1.0);
}
`;

export { Rectangle };
