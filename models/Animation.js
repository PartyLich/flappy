define(function () {
  class Animation {
    constructor({
      firstFrame = 0,
      length = 0,
      repeat = 0,
      fps = 60,
    } = {}) {
      this.firstFrame = firstFrame;
      this.length = length;
      this.repeat = repeat;
      this.fps = fps;
    }
  }

  return Animation;
});
