"use strict";

import { gl } from "./gl.js";
import { ShaderProgram } from "./shaderProgram.js";
import { Texture } from "./texture.js";
import { Buffer, getRect } from "./buffer.js";
import { VAO } from "./vao.js";
import { view } from "./view.js";
class Tilemap {
  constructor(width, height, tilesize, img) {
    this.show = true;
    this.tex = new Texture(img, null, null, img.src);
    this.prog = new ShaderProgram(vert, frag, "tilemap");
    this.vao = new VAO();

    const verts = new Uint8Array(getRect(0,tilesize , 0, tilesize ));

    this.buffer_vert = new Buffer(verts);
    
    const pos = new Uint16Array(width * height * 2);
    
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            const i = (x + y * width)*2;
            pos[i] = x * tilesize;
            pos[i+1] = y * tilesize;
        }
    }
    this.buffer_pos = new Buffer(pos, 2, 0);
    
    this.buffer_tile = new Buffer(
      new Uint16Array(width * height * 2),
      2,
      0
    );
    
    const a = this.prog.attribs;
    this.vao.setAttributes(this.buffer_vert, [a.aVert], false);
    this.vao.setAttributes(this.buffer_pos, [a.aPos], true);
    this.vao.setAttributes(this.buffer_tile, [a.aTex], true);
    gl.bindVertexArray(null);
  }


  draw(progress) {
    
    gl.bindVertexArray(this.vao.id);
    gl.useProgram(this.prog.id);
    gl.uniform1i(this.prog.uniforms.uTex.id, this.tex.number);
    gl.uniform2fv(this.prog.uniforms.uTexSizeInv.id, this.tex.sizeInv);
    gl.uniform2f(this.prog.uniforms.uView.id, view.x, view.y);
    gl.uniform2f(
      this.prog.uniforms.uResInv.id,
      2 / gl.drawingBufferWidth,
      2 / gl.drawingBufferHeight
    );
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, this.buffer_tile.data.length/2);
    gl.bindVertexArray(null);
  }
}

const vert = `#version 300 es
  in vec2 aVert;
  in vec2 aPos;
  in vec2 aTex;
  out vec2 vTexCoord;
  uniform vec2 uView;
  uniform vec2 uResInv;
  uniform vec2 uTexSizeInv;
void main() {
   //move to position
  vec2  v = aVert + aPos- uView;
  //flip y
  v.y *= -1.0;
  gl_Position = vec4(v * uResInv + vec2(-1.0, 1.0), 0.0, 1.0);

  //set Texture
  v = aVert + aTex;
  vTexCoord = v * uTexSizeInv;
  
}`;

const frag = `#version 300 es    
  precision mediump float;
  in vec2 vTexCoord;
  out vec4 outColor;
  uniform sampler2D uTex;
void main() {    
    outColor = texture(uTex, vTexCoord);
}
`;

export { Tilemap };
