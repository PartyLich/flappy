  /** Physics Engine
  * @class
  */
  class Physics {
    /** Physics Engine constructor
     * @param {Mediator} mediator
     */
    constructor(mediator) {
      const sub = mediator.subscribe;

      sub('p:reposition', this.reposition);
    }

    /** Reposition an object according to its current velocity.
     * @param {Object} obj An object with a position and velocity
     * @param {number} obj.x  x component of position
     * @param {number} obj.y  y component of position
     * @param {number} obj.vx  vx component of velocity
     * @param {number} obj.vy  vy component of velocity
     * @return {object} Updated object
     */
    reposition([obj]) {
      // New position.
      const x = obj.x + (obj.vx);
      let y = obj.y + (obj.vy);

      // boundary looping
      if (y < obj.r) {
        y = obj.r;
      }

      obj.move(
          Math.round(x),
          Math.round(y)
      );

      accelerate(obj);

      return obj;
    }
  }

  /**
   * Accelerate an object. Mutates.
   * @param  {object} obj object to accelerate
   */
  function accelerate(obj) {
    if (obj.ax == undefined || obj.ay == undefined) return;
    const terminal = 20;
    const newX = obj.vx + obj.ax;
    const xdir = (newX < 0) ? -1 : 1;
    const newY = obj.vy + obj.ay;
    const ydir = (newY < 0) ? -1 : 1;

    obj.vx = (Math.abs(newX) < terminal) ? newX : terminal * xdir;
    obj.vy = (Math.abs(newY) < terminal) ? newY : terminal * ydir;
  }

export default Physics;
