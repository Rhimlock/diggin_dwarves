import { drawables, render, gl } from "./webgl/gl.js";
import { SpriteBatch } from "./webgl/spriteBatch.js";
import { Tilemap } from "./webgl/tilemap.js";
import { Rectangle } from "./webgl/rectangle.js";
import { view } from "./webgl/view.js";
const img = document.getElementById("diam");
const imgMap = document.getElementById("map");

const map = initMap(32, 32, 16);
const batch = initBatch(1);
const rect = initRectangle();
// map.show = false;

var stepstart = 0;
var step = 1000;
loop();
function loop(timestamp) {
  var progress = timestamp - stepstart;
  if (progress > step) {
    progress %= step;
    stepstart = timestamp - progress;
    const spr = batch.sprites[0];
    spr.x += spr.dx;
    
    spr.dx = 0;
    if (spr.ty == 1)  spr.dx = spr.frames > 0 ? 8 : -8;
    batch.buffer_inst.update();
    spr.ty = 0;

  }
  render(progress / step);
  window.requestAnimationFrame(loop);
}

window.onkeypress = ev => {
  console.log(ev.which);
  const spr = batch.sprites[0];
  
  switch (ev.which) {
    case 115: spr.ty = 2; break;
    case 100: spr.ty = 1; spr.frames = 8; break;
    case 119: spr.ty = 3;break;
    case 97: spr.ty = 1; spr.frames = -8; break;

  }
}
window.onmousemove = ev => {
  if (ev.button === 0) {
    const p = view.getCoords(ev.clientX, ev.clientY);
    rect.x2 = p.x;
    rect.y2 = p.y;
  }
}

window.onmousedown = ev => {
  if (ev.button === 0) {
    const p = view.getCoords(ev.clientX, ev.clientY);
    rect.x = p.x;
    rect.y = p.y;
    rect.x2 = p.x;
    rect.y = p.y;
    rect.show = true;
  }
}
window.onmouseup = ev => {
  if (ev.button === 0) {
    rect.show = false;
  }
}

function initMap(width, height, size) {

  const div = document.getElementById("divMap");
  div.style.minWidth = width * size / view.zoom + "px";
  div.style.minHeight = height * size / view.zoom + "px";
  const map = new Tilemap(width, height, size, imgMap);
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      const i = (x + y * width) * 2
      map.buffer_tile.data[i] = x % 10 * size;
      map.buffer_tile.data[i + 1] = y % 4 * size;
    }
  }
  map.buffer_tile.update();
  drawables.push(map);
  return map;
}

function initBatch(n) {
  const b = new SpriteBatch(n, img);
  drawables.push(b);
  const spr = b.addSprite();
  spr.x = 16;
  spr.y = 16;
  spr.dx = 0;
  spr.w = 16;
  spr.h = 16;
  spr.ty = 0;
  spr.tx = 0;
  spr.frames = 8;
  spr.iterations = 1;
  b.buffer_inst.update();
  return b;
}

function initRectangle() {
  const r = new Rectangle();
  drawables.push(r);
  return r;
}