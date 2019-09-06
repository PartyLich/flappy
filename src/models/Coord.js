  /** Coordinate object. Represents a point in 2-space.
   */
  class Coord {
    constructor({x = 0, y = 0} = {}) {
      this.x = x;
      this.y = y;
    }

    /** Move this Coord to a new (x, y) location.
     * @param {Number} x
     * @param {Number} y
     * @return {Coord}
     */
    move(x, y) {
      this.x = x;
      this.y = y;

      return this;
    }

    /** Add [Coord] other to this and return the result.
     * @param {Coord} other
     * @return {Coord}
     */
    plus(other) {
      const x = this.x + other.x;
      const y = this.y + other.y;
      return new Coord({x, y});
    }

    /** Subtracts [Coord] other from this and return the result.
     * @param {Coord} other
     * @return {Coord}
     */
    minus(other) {
      const x = this.x - other.x;
      const y = this.y - other.y;
      return new Coord({x, y});
    }

    /** Scales this [Coord] by the factor specified.
     * @param {Number} scale
     * @return {Coord}
     */
    scale(scale) {
      const x = this.x * scale;
      const y = this.y * scale;
      return new Coord({x, y});
    }

    /** Returns distance from this [Coord] to [Coord] b.
     * @param {Coord}
     * @return {Coord}
     */
    dist(b) {
      return Math.sqrt(
          (this.x - b.x) * (this.x - b.x) + (this.y - b.y) * (this.y - b.y)
      );
    }

    /** Returns the midpoint of this [Coord] and [Coord] b.
     * @param {Coord}
     */
    midpoint(b) {
      const x = (this.x + b.x) / 2;
      const y = (this.y + b.y) / 2;
      return new Coord({x, y});
    }
  }

export default Coord;
