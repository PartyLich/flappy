import Coord from './Coord';
import Ball from './Ball';
import Animation from './Animation';


/**
 * Player object
 * @extends Ball
 */
class Player extends Ball {
  /** Player constructor
   * @param {Coord} pos    Starting location
   * @param {Image} img    Sprite
   * @param {Image} alpha  Mask
   * @param {number} frameWidth     width of each animation frame
   * @param {number} frameHeight    height of each animation frame
   * @param {object}  opt  options
   * @param {Mediator} opt.mediator
   */
  constructor({x, y}, img, alpha, frameWidth, frameHeight, {mediator}) {
    // Super class constructor
    const radius = Math.round(Math.max(frameWidth, frameHeight) / 2);
    super({
      x,
      y,
      r: radius,
    });

    this.frame = 0;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0.6;
    // Drawing scale on interval [0,1]
    this.scale = 1;
    this.minScale = 0.125;

    this.width = frameWidth;
    this.height = frameHeight;
    this.img = new Image();

    // Init the masked composite image.
    console.log('this.x, this.y', this.x, this.y);
    mediator.installTo(this);
    this.publish('g:maskImg', this, alpha, img);

    this.frameX = 0; // x location of current frame.
    this.frameY = 0; // y location of current frame.
    this.cols = Math.floor(img.width / frameWidth);
    this.rows = Math.floor(img.height / frameHeight);

    // Animation list
    this.animations = {};
    // default animation
    this.animations.def = new Animation({
      firstFrame: 1,
      length: this.cols,
      repeat: -1,
      fps: 15,
    });
    console.log(this.animations.def);
    // Death animation
    this.animations.crash = new Animation({
      firstFrame: 1,
      length: 1,
      repeat: 6,
    });

    this.setAnim(this.animations.def);

    this.fCount = 0; // number of times the current frame has been displayed.

    this.crashing = false;
    this.dead = false;
  }




  /** Get this player's current heading.
   *  @return {Number} Heading in radians.
   */
  getHeading() {
    return Math.atan2(this.vy, this.vx);
  }

  /** Set this player's current animation.
   * @param {Animation} animation The animation to use
   */
  setAnim(animation) {
    this.curAnimation = animation;
    this.frame = this.curAnimation.firstFrame;
    this.loop = animation.repeat;
  }

  /** Set this player's heading.
   * @param {Number} angle Heading in radians.
   */
  setHeading(angle) {
    // Find size of velocity vector
    const v = this.velocity();

    // Find new x and y velocity components
    this.vx = v * Math.cos(angle);
    this.vy = v * Math.sin(angle);
  }

  /** Set the drawing scale of this player on interval [0,1].
   * @param {Number} factor
   */
  setScale(factor) {
    this.scale = (factor <= this.minScale) ? this.minScale : factor;
    this.r = Math.round((Math.max(this.width, this.height) / 2) * this.scale);
  }

  /** Get the player's scalar velocity
   * @return {Number}
   */
  velocity() {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  }

  /** Set the player's scalar velocity
   * @param {Number} v  The new velocity.
   */
  setVelocity(v) {
    const angle = this.getHeading();

    // Find new x and y velocity components
    this.vx = v * Math.cos(angle);
    this.vy = v * Math.sin(angle);

    // console.log('Set velocity v:'+v+' angle:'+angle+' vx:'+vx+' vy:'+vy);
  }

  /** Calculate the top left corner of the current frame.
   */
  updateFrame() {
    this.frameX =
      (this.frame - 1) * this.width -
      Math.floor((this.frame - 1) / this.cols) * this.cols * this.width;
    //    console.log('right', (this.frame / this.cols * this.cols * this.width));
    //    console.log('this.frame / this.cols', (this.frame / this.cols));
    //    console.log('this.cols', this.cols, 'this.height', this.height);
    this.frameY = Math.floor((this.frame - 1) / this.cols) * this.height;
  }

  /** Renders this object on the supplied 2d canvas rendering context
   *  @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    // Update frame location
    this.updateFrame();
    // increment current frame draw counter
    this.fCount++;
    //    console.log('fCount', this.fCount);

    // Save context state.
    ctx.save();
    // Rotate context to draw with proper heading.
    //  console.log('Translating ' + this.x + ', ' + this.y);
    ctx.translate(this.x, this.y);
    //  console.log('Rotating canvas to heading ' + (this.getHeading() * 180 / Math.PI) + 'deg');
    //    ctx.rotate(this.getHeading() + Math.PI/2);

    // Draw final image to the supplied context.
    ctx.drawImage(
        this.img,
        this.frameX,
        this.frameY,
        this.width,
        this.height,
        (-this.width * this.scale) / 2,
        (-this.height * this.scale) / 2,
        this.width * this.scale,
        this.height * this.scale
    );
    //    console.log('frame', this.frame, 'frameX', this.frameX, 'frameY', this.frameY);

    // Draw circle around player if selected.
    if (this.selected) {
      ctx.strokeStyle = 'yellow';
      ctx.beginPath();
      ctx.arc(0, 0, this.r, 0, 2 * Math.PI, false);
      ctx.stroke();
    }

    // Restore context state.
    ctx.restore();


    // Advance animation frame.
    if (
      this.frame + 1 >
      this.curAnimation.firstFrame + this.curAnimation.length - 1
    ) {
      // We've already hit the last frame in the animation. Check repeat
      console.log('End of current animation loop');
      this.frame = this.curAnimation.firstFrame;

      if (this.curAnimation.repeat === -1) {
        this.frame = this.curAnimation.firstFrame;
      } else if (this.loop > 0) {
        this.loop--;
      }

      // Crash sequence complete?
      if (this.crashing) {
        console.log('Setting player to DEAD');
        this.dead = true;
        return;
      }

      // reset current frame draw counter
      this.fCount = 0;
    } else {
      //      console.log('this.curAnimation.fps', this.curAnimation.fps);
      if (this.fCount >= 60 / this.curAnimation.fps) {
        // check if we've repeated the current frame enough times
        this.frame++;

        // reset current frame draw counter
        this.fCount = 0;
      }
    }
  }

  /** Clears the rect currently occupied on the supplied context.
   * @param {CanvasRenderingContext2D} ctx
   */
  clear(ctx) {
    // Save context state.
    ctx.save();
    // Rotate context to draw with proper heading.
    ctx.translate(this.x, this.y);
    ctx.rotate(this.heading + Math.PI / 2);

    // Clear the rect currently occupied.
    ctx.clearRect(
        -(this.r + 3),
        -(this.r + 3),
        (this.r + 3) * 2,
        (this.r + 3) * 2
    );

    // Restore context state.
    ctx.restore();
  }

  /** Kill this Player.
   */
  die() {
    console.log('Beginning die sequence');
    // Uh, crash image/animation
    this.crashing = true;
    this.setAnim(this.animations.crash);
    console.log('Animation set to', this.curAnimation);
    this.fCount = 0;
    this.updateFrame();
  }

  /**
   * Return left of rectangular bounding box
   * @return {number} edge of rectangular bounding box
   */
  get left() {
    return this.x - this.width / 2;
  }

  /**
   * Return right of rectangular bounding box
   * @return {number} edge of rectangular bounding box
   */
  get right() {
    return this.x + this.width / 2;
  }

  /**
   * Return top of rectangular bounding box
   * @return {number} edge of rectangular bounding box
   */
  get top() {
    return this.y - this.height /2;
  }

  /**
   * Return bottom of rectangular bounding box
   * @return {number} edge of rectangular bounding box
   */
  get bottom() {
    return this.y + this.height / 2;
  }
}

export default Player;
