define(['Coord'], function (Coord) {
  class Ball extends Coord {
    constructor({x = 0, y = 0, r = 0} = {}) {
      super({x: x, y: y});

      this.r = r;
    }

    /**
     *  Renders this object on the supplied canvas rendering context
     *  @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
      ctx.fill();
    }
  }

  return Ball;
});
