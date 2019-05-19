import { gl } from "./gl.js";
const cache = {};

class ShaderProgram {
  constructor(vert, frag, name) {
    if (name && cache[name]) return cache[name];
    this.id = gl.createProgram();
    linkProgram(this.id, vert, frag);
    this.attribs = lookupLocations(this.id, gl.ACTIVE_ATTRIBUTES, "Attrib");
    this.uniforms = lookupLocations(this.id, gl.ACTIVE_UNIFORMS, "Uniform");
    if (name) cache[name] = this;
  }
}

function linkProgram(id, vert, frag) {
  gl.attachShader(id, compileShader(vert, gl.VERTEX_SHADER));
  gl.attachShader(id, compileShader(frag, gl.FRAGMENT_SHADER));
  gl.linkProgram(id);
  gl.useProgram(id);
  var err = gl.getProgramInfoLog(id);
  if (err) throw `linkingError: ${err}`;
}

function compileShader(src, type) {
  const id = gl.createShader(type);
  gl.shaderSource(id, src);
  gl.compileShader(id);
  const err = gl.getShaderInfoLog(id);
  if (err) throw `compileError: ${type} - ${err}`;
  return id;
}

function lookupLocations(id, pname, fname) {
  const locations = {};
  Array.from(Array(gl.getProgramParameter(id, pname)).keys()).forEach(x => {
    const info = gl[`getActive${fname}`](id, x);
    locations[info.name] = {
      id: gl[`get${fname}Location`](id, info.name),
      size: lookupSize(info.type)
    };
  });
  return locations;
}

function lookupSize(type) {
  let size = -1;
  switch (type) {
    case gl.FLOAT:
    case gl.UNSIGNED_INT:
    case gl.INT:
    case gl.SAMPLER_2D:
      size = 1;
      break;
    case gl.FLOAT_VEC2:
      size = 2;
      break;
    case gl.FLOAT_VEC3:
      size = 3;
      break;
    case gl.FLOAT_VEC4:
      size = 4;
      break;
  }
  if (size < 0) {
    throw {
      name: "ShaderError",
      message: "unable to lookup length of type: " + type
    };
  }
  return size;
}
export { ShaderProgram };
