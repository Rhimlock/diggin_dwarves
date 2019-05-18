import { drawables, render } from "./webgl/gl.js";
import { SpriteBatch } from "./webgl/spriteBatch.js";
import {Tilemap } from "./webgl/tilemap.js";
import { Rectangle } from "./webgl/rectangle.js";
const img = document.getElementById("diam");
const imgMap = document.getElementById("map");

const map = initMap(128,128,16);
const batch = initBatch(1);
const rect = initRectangle(10,10,100,100);
//map.show = false;




var timestamp = Date.now();
var tick = 1000;
loop();
function loop() {
  var progress = Date.now() - timestamp;
  if (progress > tick) {
    timestamp = Date.now() + (progress - tick);
    progress = progress - tick;
    const spr = batch.sprites[0];
    //spr.x += 16;
    batch.buffer_inst.update();
  
  }
  render(progress / tick);
  window.requestAnimationFrame(loop);
}

let counter = 0;
window.onclick = ev => {
  let x = (ev.clientX + window.pageXOffset * 0.5) * 0.3;
  let y = (ev.clientY + window.pageYOffset * 0.5 ) * 0.3;
  //map.removeSprite(counter++);
  //map.removeSprite(null,x,y);
  // const spr = s2[0];
  // spr.tx = spr.tx+1;
  // if (spr.tx > 5) spr.tx = 0;
}

function getCoords(x,y) {
  const zoom = 0.3;
  return {
    x: (x + window.pageXOffset ) * zoom,
    y: (y + window.pageYOffset ) * zoom
  }
}
window.onmousemove = ev => {
  const p = getCoords(ev.clientX, ev.clientY);
  // const spr = batch.sprites[0];
  // spr.x = p.x;
  // spr.y = p.y;
  rect.x2 = p.x;
  rect.y2 = p.y;
}

window.onmousedown = ev => {
  const p = getCoords(ev.clientX, ev.clientY);
  rect.x = p.x;
  rect.y = p.y;
  rect.show = true;
}
window.onmouseup = ev => {
  rect.show = false;
}



function initMap(width, height, size) {
  const map = new Tilemap(width, height, size,imgMap);
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      const i = (x+y*width) * 2
      map.buffer_tile.data[i] = x % 10;
      map.buffer_tile.data[i+1] = y % 3;
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
  spr.ty = 1;
  spr.frames =6;
  spr.iterations = 1;
  b.buffer_inst.update();
  return b;
}

function initRectangle(x,y,x2,y2) {
  const r = new Rectangle(x,y,x2,y2);
  drawables.push(r);
  return r;
}