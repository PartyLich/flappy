define(['Coord','ball', 'path', 'animation'], function(Coord, Ball, Path, Animation){
  class Pipe extends Ball {
    /** Pipe object.
     * @param {Coord}  pos    Starting location
     * @param {number}  pos.x  starting x value
     * @param {number}  pos.y  starting y value
     * @param {Image}  img    Sprite
     * @param {Image}  alpha  Mask
     * @param {number}  frameWidth     width of each animation frame
     * @param {number}  frameHeight    height of each animation frame
     * @param {object}  opt  options object
     * @param {Mediator} opt.mediator  mediator to utilize
     */
    constructor({x, y}, img, alpha, frameWidth, frameHeight, opt) {
      const radius = Math.round(Math.max(frameWidth, frameHeight) / 2);
      super({
        x,
        y,
        r: radius,
      });

      this.frame = 0;
      this.vx = -4;
      this.vy = 0;
      // Drawing scale on interval [0,1]
      this.scale = 1;
      this.minScale = 0.125;

      this.width = frameWidth;
      this.height = frameHeight;
      this.img = new Image();

      // Init the masked composite image.
      opt.mediator.installTo(this);
      this.publish('g:maskImg', this, alpha, img);

      // Animation list
      this.animations = {};
      // default animation
      this.animations.def = new Animation({
        firstFrame: 1,
        length: 1,
        repeat: -1,
        fps: 15,
      });
      // Death animation
      this.animations.crash = new Animation({
        firstFrame: 1,
        length: 1,
        repeat: 6,
      });

      this.setAnim(this.animations.def);

      this.frameX = 0; // x location of current frame.
      this.frameY = 0; // y location of current frame.
      this.cols = Math.floor(img.width / frameWidth);
      this.rows = Math.floor(img.height / frameHeight);

      this.fCount = 0; // number of times the current frame has been displayed.

      this.crashing = false;
      this.dead = false;

      // Gap size / 2
      this.gap = 75;
    }


    /** Get this plane's current heading.
     *  @return {Number} Heading in radians.
     */
    getHeading() {
      // console.log('Heading atan2('+ this.vy +'/'+ this.vx +'): ' + Math.atan2(this.vy, this.vx) +');
      return Math.atan2(this.vy, this.vx);
    }

    /** Set this plane's current animation.
     * @param {Animation} animation The animation to use
     */
    setAnim(animation) {
      this.curAnimation = animation;
      this.frame = this.curAnimation.firstFrame;
      this.loop = animation.repeat;
    }

    /** Set this plane's heading.
     * @param {Number} angle Heading in radians.
     */
    setHeading(angle) {
      // Find size of velocity vector
      const v = this.velocity();

      // Find new x and y velocity components
      this.vx = v * Math.cos(angle);
      this.vy = v * Math.sin(angle);
      //    console.log('Set heading v:'+ v +' angle:'+ angle +' vx:'+ this.vx +' vy:'+ this.vy);
    }

    /** Set the drawing scale of this plane on interval [0,1].
     * @param {Number} factor
     */
    setScale(factor) {
      this.scale = factor <= this.minScale ? this.minScale : factor;
      this.r = Math.round((Math.max(this.width, this.height) / 2) * this.scale);
    }

    /** Get the plane's scalar velocity
     * @return {Number}
     */
    velocity() {
      return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    }

    /** Set the plane's scalar velocity
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
      //  console.log('Translating ' + this.pos.x + ', ' + this.pos.y);
      ctx.translate(this.x, this.y);

      // Draw final image to the supplied context.
      // Bottom
      ctx.drawImage(
          this.img,
          this.frameX,
          this.frameY,
          this.width,
          32,
          (-this.width * this.scale) / 2,
          this.gap,
          this.width * this.scale,
          32
      );
      for (var y = this.gap + 32; y < 900; y += this.height - 32) {
        ctx.drawImage(
            this.img,
            this.frameX,
            this.frameY + 33,
            this.width,
            this.height - 33,
            (-this.width * this.scale) / 2,
            y,
            this.width * this.scale,
            this.height - 32
        );
      }
      // Top
      ctx.scale(1, -1);
      ctx.drawImage(
          this.img,
          this.frameX,
          this.frameY,
          this.width,
          32,
          (-this.width * this.scale) / 2,
          this.gap,
          this.width * this.scale,
          32
      );
      for (var y = this.gap + 32; y < +900; y += this.height - 32) {
        ctx.drawImage(
            this.img,
            this.frameX,
            this.frameY + 33,
            this.width,
            this.height - 33,
            (-this.width * this.scale) / 2,
            y,
            this.width * this.scale,
            this.height - 32
        );
      }

      // Restore context state.
      ctx.restore();
      //    console.log('frame', this.frame, 'frameX', this.frameX, 'frameY', this.frameY);

      // Advance animation frame.
      if (
        this.frame + 1 >
        this.curAnimation.firstFrame + this.curAnimation.length - 1
      ) {
        // We've already hit the last frame in the animation. Check repeat
        // console.log('End of current animation loop');
        this.frame = this.curAnimation.firstFrame;

        if (this.curAnimation.repeat === -1) {
          this.frame = this.curAnimation.firstFrame;
        } else if (this.loop > 0) {
          this.loop--;
        }

        // Crash sequence complete?
        if (this.crashing) {
          // console.log('Setting pipe to DEAD');
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

      ctx.translate(this.x, this.y);

      // Clear the rect currently occupied.
      // Bottom
      ctx.clearRect(
          (-this.width * this.scale) / 2,
          this.gap,
          this.width * this.scale,
          900 - (this.y + this.gap) /* this.height * this.scale*/
      );
      // Top
      ctx.scale(1, -1);
      ctx.clearRect(
          (-this.width * this.scale) / 2,
          this.gap,
          this.width * this.scale,
          this.y - this.gap /* this.height * this.scale*/
      );

      // Restore context state.
      ctx.restore();
    }

    /** Kill this pipe.
     */
    die() {
      // console.log('Beginning die sequence');
      // Uh, crash image/animation
      this.crashing = true;
      this.setAnim(this.animations.crash);
      // console.log('Animation set to', this.curAnimation);
      this.fCount = 0;
      this.updateFrame();
    }
  }

  return Pipe;
});
