import { gl } from "./gl.js";

class VAO {
  constructor(name) {
    this.id = gl.createVertexArray();
    gl.bindVertexArray(this.id);
  }

  setAttributes(buffer, attribs, instanced) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.id);
    let offset = 0;
    for (let i = 0; i < attribs.length; ++i) {
      
      const a = attribs[i];
      gl.enableVertexAttribArray(a.id);
      gl.vertexAttribPointer(
        a.id,
        a.size,
        buffer.type,
        false,  //normalized 0 to 1 or -1 to 1
        buffer.stride,
        offset
      );
      
      if (instanced){
        offset = offset + a.size * buffer.data.BYTES_PER_ELEMENT;
        gl.vertexAttribDivisor(a.id, 1);
      } else {
        offset = buffer.offset;
      }
    }
  }
}

export { VAO };
