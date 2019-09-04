define(['Coord'], function(Coord){

  //class Ball extends Coord {
  function Ball(x, y, r) {
    //Super class constructor
    Coord.call(this, {x:x, y:y});

    this.r = (r || 0);
  }

  //Inherit Coord
  Ball.prototype = new Coord();

  //Correct the constructor pointer.
  Ball.prototype.constructor = Ball;

  /**
   *  Renders this object on the supplied canvas rendering context
   *  @param {CanvasRenderingContext2D} ctx
   */
  Ball.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
    ctx.fill();
  };

  return Ball;
});
