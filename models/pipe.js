define(['coord','ball', 'path', 'animation'], function(Coord, Ball, Path, Animation){

  /** Plane object.
   * @param {Coord} pos    Starting location
   * @param {Image} img    Sprite
   * @param {Image} alpha  Mask
   * @param frameWidth     width of each animation frame
   * @param frameHeight    height of each animation frame
   */
  function Pipe(pos, img, alpha, frameWidth, frameHeight, opt) {
    //Super class constructor
    Ball.call(this, pos.x, pos.y, Math.round(Math.max(frameWidth, frameHeight) / 2));

    this.frame = 0;
    this.vx = -4;
    this.vy = 0;
    var ax, ay;
    //Drawing scale on interval [0,1]
    this.scale = 1;
    this.minScale = .125;


    this.init(opt);

//    this.pos = new Ball(pos.x, pos.y, Math.round(Math.max(frameWidth, frameHeight) / 2));
//    this.pos.x = this.x;
//    this.pos.y = this.y;
//    this.pos.r = this.r;
//    this.pos.hue = this.hue;

    this.width = frameWidth;
    this.height = frameHeight;
    this.img = new Image();

    //Init the masked composite image.
    //console.log('opt',opt);
    //console.log('this.x, this.y', this.x, this.y);
    opt.mediator.installTo(this);
    this.publish('g:maskImg', this, alpha, img);

    //Animation list
    this.animations = {};
    //default animation
    this.animations.def = new Animation({
      firstFrame : 1,
      length : 1,
      repeat : -1,
      fps : 15
    });
    //Death animation
    this.animations.crash = new Animation({
      firstFrame : 1,
      length : 1,
      repeat : 6
    });

    this.setAnim(this.animations.def);

    this.frameX = 0;    //x location of current frame.
    this.frameY = 0;    //y location of current frame.
    this.cols = Math.floor(img.width / frameWidth);
    this.rows = Math.floor(img.height / frameHeight);

    this.fCount = 0;    //number of times the current frame has been displayed.
//    this.loop = 0;

    this.crashing = false;
    this.dead = false;

    //Gap size / 2
    this.gap = 50;
  }

  //Inherit Ball
  Pipe.prototype = new Ball();

  //Correct the constructor pointer.
  Pipe.prototype.constructor = Pipe;


  Pipe.prototype.init = function (opt) {

  };


  /** Get this plane's current heading.
   *  @returns {Number} Heading in radians.
   */
  Pipe.prototype.getHeading = function () {
    //console.log('Heading atan2('+ this.vy +'/'+ this.vx +'): ' + Math.atan2(this.vy, this.vx) +');
    return Math.atan2(this.vy, this.vx);
  };

  /** Set this plane's current animation.
   * @param {Animation} animation The animation to use
   */
  Pipe.prototype.setAnim = function (animation) {
    this.curAnimation = animation;
    this.frame = this.curAnimation.firstFrame;
    this.loop = animation.repeat;
  };

  /** Set this plane's heading.
   * @param {Number} angle Heading in radians.
   */
  Pipe.prototype.setHeading = function (angle) {
    //Find size of velocity vector
    var v = this.velocity();

    //Find new x and y velocity components
    this.vx = v * Math.cos(angle);
    this.vy = v * Math.sin(angle);
//    console.log('Set heading v:'+ v +' angle:'+ angle +' vx:'+ this.vx +' vy:'+ this.vy);
  };


  /** Set the drawing scale of this plane on interval [0,1].
   * @param {Number} factor
   */
  Pipe.prototype.setScale = function (factor) {
    this.scale = (factor <= this.minScale) ? this.minScale : factor;
    this.r = Math.round(Math.max(this.width, this.height) / 2 * this.scale);
  };


  /** Get the plane's scalar velocity
   * @returns {Number}
   */
  Pipe.prototype.velocity = function () {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  };


  /** Set the plane's scalar velocity
   * @param {Number} v  The new velocity.
   */
  Pipe.prototype.setVelocity = function (v) {
    var angle = this.getHeading();

    //Find new x and y velocity components
    this.vx = v * Math.cos(angle);
    this.vy = v * Math.sin(angle);

    //console.log('Set velocity v:'+v+' angle:'+angle+' vx:'+vx+' vy:'+vy);
  };


  /** Calculate the top left corner of the current frame.
   */
  Pipe.prototype.updateFrame = function () {
    this.frameX = (this.frame - 1) * this.width - (Math.floor((this.frame - 1) / this.cols) * this.cols * this.width);
    this.frameY = Math.floor((this.frame - 1) / this.cols) * this.height;
  };


  /** Renders this object on the supplied 2d canvas rendering context
   *  @param {CanvasRenderingContext2D} ctx
   */
  Pipe.prototype.draw = function (ctx) {
    //Update frame location
    this.updateFrame();
    //increment current frame draw counter
    this.fCount++;
//    console.log('fCount', this.fCount);

    //Save context state.
    ctx.save();
    //Rotate context to draw with proper heading.
  //  console.log('Translating ' + this.pos.x + ', ' + this.pos.y);
    ctx.translate(this.x, this.y);

    //Draw final image to the supplied context.
    //Bottom
    ctx.drawImage(this.img, this.frameX, this.frameY, this.width, 32,
        -this.width * this.scale/2,  this.gap,
        this.width * this.scale, 32);
    for(var y = this.gap+32; y <+ 900; y += this.height-32) {
      ctx.drawImage(this.img, this.frameX, this.frameY+33, this.width, this.height-33,
          -this.width * this.scale/2,  y,
          this.width * this.scale, this.height-32);
    }
    //Top
    ctx.scale(1, -1);
    ctx.drawImage(this.img, this.frameX, this.frameY, this.width, 32,
        -this.width * this.scale/2,  this.gap,
        this.width * this.scale, 32);
    for(var y = this.gap+32; y <+ 900; y += this.height-32) {
      ctx.drawImage(this.img, this.frameX, this.frameY+33, this.width, this.height-33,
          -this.width * this.scale/2,  y,
          this.width * this.scale, this.height-32);
    }

    //Restore context state.
    ctx.restore();

//    console.log('frame', this.frame, 'frameX', this.frameX, 'frameY', this.frameY);

    //Advance animation frame.
    if(this.frame + 1 > this.curAnimation.firstFrame + this.curAnimation.length - 1) {
      //We've already hit the last frame in the animation. Check repeat
//console.log('End of current animation loop');
      this.frame = this.curAnimation.firstFrame;

      if(this.curAnimation.repeat === -1) {
        this.frame = this.curAnimation.firstFrame;
      } else if(this.loop > 0) {
        this.loop--;
      }

      //Crash sequence complete?
      if(this.crashing) {
        //console.log('Setting pipe to DEAD');
        this.dead = true;
        return;
      }

      //reset current frame draw counter
      this.fCount = 0;
    } else {
//      console.log('this.curAnimation.fps', this.curAnimation.fps);
      if(this.fCount >= (60 / this.curAnimation.fps)) {  //check if we've repeated the current frame enough times
        this.frame++;

        //reset current frame draw counter
        this.fCount = 0;
      }
    }
  };

  /** Clears the rect currently occupied on the supplied context.
   * @param {CanvasRenderingContext2D} ctx
   */
  Pipe.prototype.clear = function (ctx) {
    //Save context state.
    ctx.save();

    ctx.translate(this.x, this.y);

    //Clear the rect currently occupied.
      //Bottom
    ctx.clearRect(-this.width * this.scale/2,  this.gap,
          this.width * this.scale, 900-(this.y + this.gap)/*this.height * this.scale*/);
      //Top
    ctx.scale(1, -1);
    ctx.clearRect(-this.width * this.scale/2, this.gap,
          this.width * this.scale, (this.y - this.gap)/*this.height * this.scale*/);

    //Restore context state.
    ctx.restore();
  };

  /** Crashes this plane.
   *
   */
//  Pipe.prototype.crash = function () {
//    //console.log('Beginning crash sequence');
//    //Uh, crash image/animation
//    this.crashing = true;
//    this.setAnim(this.animations.crash);
//    //console.log('Animation set to', this.curAnimation);
//    this.fCount = 0;
//    this.updateFrame();
//  };

  /** Kill this pipe.
   *
   */
  Pipe.prototype.die = function () {
    //console.log('Beginning die sequence');
    //Uh, crash image/animation
    this.crashing = true;
    this.setAnim(this.animations.crash);
    //console.log('Animation set to', this.curAnimation);
    this.fCount = 0;
    this.updateFrame();
  };


  /** Move this plane to the specified [Coord]
   * @param {Coord} dest
   */
//  Pipe.prototype.move = function (dest) {
//    this.pos.move(dest.x, dest.y);
//  };


  return Pipe;
});