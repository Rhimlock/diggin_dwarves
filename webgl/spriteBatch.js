"use strict";

import { gl } from "./gl.js";
import { ShaderProgram } from "./shaderProgram.js";
import { Texture } from "./texture.js";
import { Buffer, buffer_vert } from "./buffer.js";
import { VAO } from "./vao.js";
import { Sprite } from "./spriteInstanced.js";
import { view } from "./view.js";
class SpriteBatch {
  constructor(count, img) {
    this.show = true;
    this.buffer = buffer_vert;
    this.buffer_inst = new Buffer(
      new Int16Array(count * Sprite.ELEMENTS_PER_SPRITE),
      Sprite.ELEMENTS_PER_SPRITE,
      0
    );
    this.sprites = [];
    this.tex = new Texture(img, null, null, img.src);
    this.prog = new ShaderProgram(vert, frag, "sprite");
    this.vao = new VAO("sprite");
    const a = this.prog.attribs;
    this.vao.setAttributes(this.buffer, [a.aVert], false);
    this.vao.setAttributes(
      this.buffer_inst,
      [a.aPos, a.aDir, a.aTex, a.aAnim],
      true
    );
    gl.bindVertexArray(null);
  }

  addSprite() {
    const spr = new Sprite(
      this.sprites.length * Sprite.ELEMENTS_PER_SPRITE,
      this.buffer_inst.data
    );
    this.sprites.push(spr);
    return spr;
  }

  removeSprite(idx, x, y) {
    let spr = this.sprites[idx];
    if (!idx) {
      spr = this.getSprite(x, y);
      idx = spr.i / Sprite.ELEMENTS_PER_SPRITE;
    }
    const last = this.sprites[this.sprites.length - 1];
    spr.overwriteWith(last);
    this.sprites[idx] = last;
    this.sprites.length = this.sprites.length - 1;
  }

  getSprite(x, y) {
    for (var i = 0; i < this.sprites.length; i++) {
      const spr = this.sprites[i];
      if (
        spr.x <= x &&
        x <= spr.x + spr.w &&
        spr.y <= y &&
        y <= spr.y + spr.h
      ) {
        return spr;
      }
    }
    return null;
  }

  getSprites(x, y, w, h) {
    const results = [];
    for (var i = 0; i < this.sprites.length; i++) {
      const spr = this.sprites[i];
      if (
        spr.x <= x + w &&
        x <= spr.x + spr.w &&
        spr.y <= y + h &&
        y <= spr.y + spr.h
      ) {
        results.push(spr);
      }
    }
    return results;
  }

  draw(progress) {

    gl.bindVertexArray(this.vao.id);
    gl.useProgram(this.prog.id);
    gl.uniform1i(this.prog.uniforms.uTex.id, this.tex.number);
    gl.uniform2fv(this.prog.uniforms.uTexSizeInv.id, this.tex.sizeInv);
    gl.uniform1f(this.prog.uniforms.uProgress.id, progress);
    gl.uniform2f(this.prog.uniforms.uView.id, view.x, view.y);
    gl.uniform2f(
      this.prog.uniforms.uResInv.id,
      1 / gl.drawingBufferWidth,
      1 / gl.drawingBufferHeight
    );
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, this.sprites.length);
    gl.bindVertexArray(null);
  }
}

const vert = `#version 300 es
  in vec4 aVert;
  in vec4 aPos;
  in vec2 aDir;
  in vec2 aTex;
  in vec2 aAnim;
  out vec2 vTexCoord;
  uniform vec2 uTexSizeInv;
  uniform vec2 uResInv;
  uniform vec2 uView;
  uniform float uProgress;
void main() {
  vec2  v = aVert.xy * aPos.zw + aPos.zw  + (aPos.xy + aDir * round(16.0 * uProgress) *0.0625) * 2.0 - uView;
  v.y *= -1.0;
  gl_Position = vec4(v * uResInv + vec2(-1.0,1.0), 0.0, 1.0);

  v = (aVert.zw + aTex) * aPos.zw + vec2(aPos.z * floor(aAnim.x * mod(uProgress * aAnim.y, 1.0)),0.0);
  v = (aVert.zw + aTex) * aPos.zw + vec2(aPos.z * aAnim.x, 0.0);
  v.x = aAnim.x ;

  vTexCoord = v * uTexSizeInv;
  
}`;

const frag = `#version 300 es    
  precision mediump float;
  in vec2 vTexCoord;
  out vec4 outColor;
  uniform sampler2D uTex;
void main() {    
    outColor = texture(uTex, vTexCoord);  
    if(outColor.a < 0.1) discard;
}
`;

export { SpriteBatch };
