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
var step = 2000;
loop();
function loop(timestamp) {
  var progress = timestamp - stepstart;
  if (progress > step) {
    progress %= step;
    stepstart = timestamp - progress;
    const spr = batch.sprites[0];
    spr.x += 16;
    batch.buffer_inst.update();

  }
  render(progress / step);
  window.requestAnimationFrame(loop);
}

let counter = 0;
window.onclick = ev => {
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
  spr.x = 0;
  spr.y = 16;
  spr.dx = 16;
  spr.w = 16;
  spr.h = 16;
  spr.ty = 1;
  spr.tx = 0;
  spr.frames = 8;
  spr.iterations = 2;
  b.buffer_inst.update();
  return b;
}

function initRectangle() {
  const r = new Rectangle();
  drawables.push(r);
  return r;
}