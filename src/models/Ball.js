define(['Coord'], function (Coord) {
  /**
   * Ball class. A point in 2space with radius.
   * @extends Coord
   */
  class Ball extends Coord {
    /**
     * Ball class constructor
     * @param {object} [opt={}]
     * @param {Number} opt.[x=0] x location
     * @param {Number} opt.[y=0] y location
     * @param {number} opt.[r=0] radius
     */
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

    /**
     * Return left of rectangular bounding box
     * @return {number} edge of rectangular bounding box
     */
    get left() {
      return this.x - this.radius;
    }

    /**
     * Return right of rectangular bounding box
     * @return {number} edge of rectangular bounding box
     */
    get right() {
      return this.x + this.radius;
    }

    /**
     * Return top of rectangular bounding box
     * @return {number} edge of rectangular bounding box
     */
    get top() {
      return this.y - this.radius;
    }

    /**
     * Return bottom of rectangular bounding box
     * @return {number} edge of rectangular bounding box
     */
    get bottom() {
      return this.y + this.radius;
    }
  }

  return Ball;
});
