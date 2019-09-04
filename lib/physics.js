define(function (require) {
  var Coord = require('Coord');


  /** Physics Engine
   */
  function Physics(mediator) {
    var sub = mediator.subscribe;

    sub('p:reposition', this.reposition);
  }

  var p = Physics.prototype;


  /** Reposition an object according to its current velocity.
   * @param {Object} obj An object with a position and velocity
   */
  p.reposition = function reposition(args) {
    var obj = args[0],
    // New position.
        x = obj.x + (obj.vx),
        y = obj.y + (obj.vy);


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
  };

  function accelerate(obj) {
    if (obj.ax == undefined || obj.ay == undefined) { return; }
    var terminal = 20,
        newX = obj.vx + obj.ax,
        xdir = (newX < 0) ? -1 : 1,
        newY = obj.vy + obj.ay,
        ydir = (newY < 0) ? -1 : 1;

    obj.vx = (Math.abs(newX) < terminal) ? newX : terminal * xdir;
    obj.vy = (Math.abs(newY) < terminal) ? newY : terminal * ydir;
  }


  return Physics;
});
