define(['coord','ball', 'path', 'animation'], function(Coord, Ball, Path, Animation){

  /** Player object.
   * @param {Coord} pos    Starting location
   * @param {Image} img    Sprite
   * @param {Image} alpha  Mask
   * @param frameWidth     width of each animation frame
   * @param frameHeight    height of each animation frame
   */
  function Player(pos, img, alpha, frameWidth, frameHeight, opt) {
    //Super class constructor
    Ball.call(this, pos.x, pos.y, Math.round(Math.max(frameWidth, frameHeight) / 2));

    this.frame = 0;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = .6;
    //Drawing scale on interval [0,1]
    this.scale = 1;
    this.minScale = .125;


    this.init(opt);

//    this = new Ball(pos.x, pos.y, Math.round(Math.max(frameWidth, frameHeight) / 2));
//    this.x = this.x;
//    this.y = this.y;
//    this.r = this.r;
//    this.hue = this.hue;

    this.width = frameWidth;
    this.height = frameHeight;
    this.img = new Image();

    //Init the masked composite image.
    console.log('opt',opt);
    console.log('this.x, this.y', this.x, this.y);
    opt.mediator.installTo(this);
    this.publish('g:maskImg', this, alpha, img);

    this.frameX = 0;    //x location of current frame.
    this.frameY = 0;    //y location of current frame.
    this.cols = Math.floor(img.width / frameWidth);
    this.rows = Math.floor(img.height / frameHeight);

    //Animation list
    this.animations = {};
    //default animation
    this.animations.def = new Animation({
      firstFrame : 1,
      length : (this.cols),
      repeat : -1,
      fps : 15
    });
    console.log(this.animations.def);
    //Death animation
    this.animations.crash = new Animation({
      firstFrame : 1,
      length : 1,
      repeat : 6
    });

    this.setAnim(this.animations.def);


    this.fCount = 0;    //number of times the current frame has been displayed.
//    this.loop = 0;

    this.crashing = false;
    this.dead = false;
  }

  //Inherit Ball
  Player.prototype = new Ball();

  //Correct the constructor pointer.
  Player.prototype.constructor = Player;


  Player.prototype.init = function (opt) {

  };

  //  /**** Get/Set ****/
  //  int get x => pos.x;
  //  int get y => pos.y;
  //  int get r => pos.r;


  /** Get this player's current heading.
   *  @returns {Number} Heading in radians.
   */
  Player.prototype.getHeading = function () {
    //console.log('Heading atan2('+ this.vy +'/'+ this.vx +'): ' + Math.atan2(this.vy, this.vx) +');
    return Math.atan2(this.vy, this.vx);
  };

  /** Set this player's current animation.
   * @param {Animation} animation The animation to use
   */
  Player.prototype.setAnim = function (animation) {
    this.curAnimation = animation;
    this.frame = this.curAnimation.firstFrame;
    this.loop = animation.repeat;
  };

  /** Set this player's heading.
   * @param {Number} angle Heading in radians.
   */
  Player.prototype.setHeading = function (angle) {
    //Find size of velocity vector
    var v = this.velocity();

    //Find new x and y velocity components
    this.vx = v * Math.cos(angle);
    this.vy = v * Math.sin(angle);
//    console.log('Set heading v:'+ v +' angle:'+ angle +' vx:'+ this.vx +' vy:'+ this.vy);
  };


  /** Set the drawing scale of this player on interval [0,1].
   * @param {Number} factor
   */
  Player.prototype.setScale = function (factor) {
    this.scale = (factor <= this.minScale) ? this.minScale : factor;
    this.r = Math.round(Math.max(this.width, this.height) / 2 * this.scale);
  };


  /** Get the player's scalar velocity
   * @returns {Number}
   */
  Player.prototype.velocity = function () {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  };


  /** Set the player's scalar velocity
   * @param {Number} v  The new velocity.
   */
  Player.prototype.setVelocity = function (v) {
    var angle = this.getHeading();

    //Find new x and y velocity components
    this.vx = v * Math.cos(angle);
    this.vy = v * Math.sin(angle);

    //console.log('Set velocity v:'+v+' angle:'+angle+' vx:'+vx+' vy:'+vy);
  };

  /** Calculate the top left corner of the current frame.
   *
   */
  Player.prototype.updateFrame = function () {
    this.frameX = (this.frame - 1) * this.width - (Math.floor((this.frame - 1) / this.cols) * this.cols * this.width);
//    console.log('right', (this.frame / this.cols * this.cols * this.width));
//    console.log('this.frame / this.cols', (this.frame / this.cols));
//    console.log('this.cols', this.cols, 'this.height', this.height);
    this.frameY = Math.floor((this.frame - 1) / this.cols) * this.height;
  };



  /** Renders this object on the supplied 2d canvas rendering context
   *  @param {CanvasRenderingContext2D} ctx
   */
  Player.prototype.draw = function (ctx) {
    //Update frame location
    this.updateFrame();
    //increment current frame draw counter
    this.fCount++;
//    console.log('fCount', this.fCount);

    //Save context state.
    ctx.save();
    //Rotate context to draw with proper heading.
  //  console.log('Translating ' + this.x + ', ' + this.y);
    ctx.translate(this.x, this.y);
  //  console.log('Rotating canvas to heading ' + (this.getHeading() * 180 / Math.PI) + 'deg');
//    ctx.rotate(this.getHeading() + Math.PI/2);

    //Draw final image to the supplied context.
    ctx.drawImage(this.img, this.frameX, this.frameY, this.width, this.height, -this.width * this.scale/2, -this.height * this.scale/2,
        this.width * this.scale, this.height * this.scale);
//    console.log('frame', this.frame, 'frameX', this.frameX, 'frameY', this.frameY);

    //Draw circle around player if selected.
    if(this.selected) {
      ctx.strokeStyle = 'yellow';
      ctx.beginPath();
      ctx.arc(0, 0, this.r, 0, 2*Math.PI, false);
      ctx.stroke();
    }

    //Restore context state.
    ctx.restore();

  ////    print("filling text");
  //    //ctx.fillText("(${pos.x.round()}, ${pos.y.round()})", pos.x - (pos.r/2).round(), pos.y);
    //ctx.fillText("(${pos.x.round()}, ${pos.y.round()})", pos.x - (pos.r/2).round(), pos.y);

    //Advance animation frame.
    if(this.frame + 1 > this.curAnimation.firstFrame + this.curAnimation.length - 1) {
      //We've already hit the last frame in the animation. Check repeat
console.log('End of current animation loop');
      this.frame = this.curAnimation.firstFrame;

      if(this.curAnimation.repeat === -1) {
        this.frame = this.curAnimation.firstFrame;
      } else if(this.loop > 0) {
        this.loop--;
      }

      //Crash sequence complete?
      if(this.crashing) {
        console.log('Setting player to DEAD');
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
  Player.prototype.clear = function (ctx) {
    //Save context state.
    ctx.save();
    //Rotate context to draw with proper heading.
    ctx.translate(this.x, this.y);
    ctx.rotate(this.heading + Math.PI/2);

    //Clear the rect currently occupied.
    ctx.clearRect(-(this.r+3), -(this.r+3), (this.r+3)*2, (this.r+3)*2);

    //Restore context state.
    ctx.restore();
  };


  /** Kill this Player.
   */
  Player.prototype.die = function () {
    console.log('Beginning die sequence');
    //Uh, crash image/animation
    this.crashing = true;
    this.setAnim(this.animations.crash);
    console.log('Animation set to', this.curAnimation);
    this.fCount = 0;
    this.updateFrame();
  };


  return Player;
});