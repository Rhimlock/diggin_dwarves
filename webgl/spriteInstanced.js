class Sprite {
  constructor(index, batch) {
    this.i = index;
    this.b = batch;

    for (var i = 0; i < Sprite.ELEMENTS_PER_SPRITE; i++) {
      const n = i;
      Object.defineProperty(this, Sprite.ELEMENTS[n], {
        get: () => this.b[this.i + n],
        set: v => {
          this.b[this.i + n] = v;
        }
      });
    }
  }
  
  overwriteWith(spr) {
    for (var i = 0; i < Sprite.ELEMENTS_PER_SPRITE; i++) {
      this.b[this.i + i] = this.b[spr.i + i];
    }
  }

  clear() {
    for (var i = 0; i < Sprite.ELEMENTS_PER_SPRITE; i++) {
      this.b[this.i + i] = 0;
    }
  }
}

Sprite.ELEMENTS = ["x", "y", "w", "h", "dx", "dy", "tx", "ty", "frames", "iterations"];
Sprite.ELEMENTS_PER_SPRITE = Sprite.ELEMENTS.length;

export { Sprite };
