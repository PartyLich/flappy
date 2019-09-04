define(function () {
  /**
   * Animation class
   * @class
   */
  class Animation {
    /**
     * Animation constructor
     * @param {object} opt
     * @param {Number} opt.[firstFrame=0] first frame index
     * @param {Number} opt.[length=0]     number of frames
     * @param {Number} opt.[repeat=0]
     * @param {[type]} opt.[fps=60] framerate
     */
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
