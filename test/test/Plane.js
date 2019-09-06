require(['plane'], function(Plane) {

  suite('Plane', function () {
    suite('new Plane()', function () {
      test('creates a Plane instance', function () {
        var h = new Plane();
        assert.instanceOf(h, Plane);
      });

//      test('', function () {
//      test('', function () {
//      test('', function () {
//      test('', function () {
//      test('', function () {
//      test('', function () {
//      test('', function () {
//      test('', function () {
//      test('initializes default values', function () {
  //      this.frame = 0;
  //      this.waypoint = 0;
  //      this.vx = this.vy = 0;
  //      var ax, ay;
  //      this.path = null;
  //      //Drawing scale on interval [0,1]
  //      this.scale = 1;
  //      this.minScale = .125;
  //      test('', function () {
  //      this.crashing = false;
  //      test('', function () {
  //      this.dead = false;
  //      this.fCount = 0;
//      });
    });

    /** Plane object.
     * @param {Coord} pos    Starting location
     * @param {Image} img    Sprite
     * @param {Image} alpha  Mask
     * @param frameWidth     width of each animation frame
     * @param frameHeight    height of each animation frame
     */
    function Plane(pos, img, alpha, frameWidth, frameHeight, opt) {

      this.init(opt);


//      this.pos = new Ball(pos.x, pos.y, Math.round(Math.max(img.width, img.height) / 2));
      this.pos = new Ball(pos.x, pos.y, Math.round(Math.max(frameWidth, frameHeight) / 2));
      /*this.width = img.width;
      this.height = img.height;*/
      this.width = frameWidth;
      this.height = frameHeight;
      this.landing = this.selected = false;


      this.img = new Image();

      //Init the masked composite image.
      this.initMask(alpha, img);

      //Animation list
      this.animations = {};
      this.animations.crash = new Animation({
        firstFrame : 1,
        length : 1,
        repeat : 6
      });
      this.animations.flight = new Animation({
        firstFrame : 1,
        length : 1,
        repeat : -1
//        fps : 60
      });

      this.setAnim(this.animations.flight);

      this.frameX = 0;    //x location of current frame.
      this.frameY = 0;    //y location of current frame.
      this.cols = Math.floor(img.width / frameWidth);
      this.rows = Math.floor(img.height / frameHeight);

    }

    suite('.hasPath()', function () {
      test('returns a boolean', function () {
        //
      });
    });


    /** Get this plane's current heading.
     *  @returns {Number} Heading in radians.
     */
//    suite('.getHeading()', function () {
//      test('', function () {
//
//      });
//    });

    /** Set this plane's current animation.
     * @param {Animation} animation The animation to use
     */
//  suite('.setAnim()', function () {
//  test('', function () {
//
//  });
//});
//    Plane.prototype.setAnim = function (animation) {
//      this.curAnimation = animation;
//      this.frame = this.curAnimation.firstFrame;
//      this.loop = animation.repeat;
//    }

    /** Set this plane's heading.
     * @param {Number} angle Heading in radians.
     */
//  suite('.setHeading()', function () {
//  test('', function () {
//
//  });
//});
//    Plane.prototype.setHeading = function (angle) {
//      //Find size of velocity vector
//      var v = this.velocity();
//
//      //Find new x and y velocity components
//      this.vx = v * Math.cos(angle);
//      this.vy = v * Math.sin(angle);
//    };


    suite('.setScale()', function () {
      test('updates the plane\'s scale', function () {
        var oldScale = p.scale;
        p.setScale(oldScale * 1.25);
        assert.equal(p.scale, oldScale);
      });

      test('won\'t set scale smaller than minScale', function () {
        p.setScale(.1);
        assert.equal(p.scale, p.minScale);
      });

      test('updates radius', function () {
        var oldR = p.pos.r;
        p.setScale(p.scale * 1.25);
        assert.equal(p.pos.r, oldR * 1.25);
      });
    });


    /**
     * @param {Path} path
     */
//  suite('.setPath()', function () {
//    test('', function () {
//
//    });
//  });
    Plane.prototype.setPath = function (path) {
      this.path = new Path().fromOther(path);
      this.waypoint = 1;
    };


    /**
     *
     */
//  suite('.nextWaypoint()', function () {
//    test('', function () {
//
//    });
//  });
    Plane.prototype.nextWaypoint = function () {
      if(this.hasPath())
        this.path.shift();
    };

    /** Get the plane's scalar velocity
     * @returns {Number}
     */
//  suite('.velocity()', function () {
//    test('', function () {
//
//    });
//  });
    Plane.prototype.velocity = function () {
      return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    };


    /** Set the plane's scalar velocity
     * @param {Number} v  The new velocity.
     */
//  suite('.setVelocity()', function () {
//    test('', function () {
//
//    });
//  });
    Plane.prototype.setVelocity = function (v) {
      var angle = this.getHeading();

      //Find new x and y velocity components
      this.vx = v * Math.cos(angle);
      this.vy = v * Math.sin(angle);

      //console.log('Set velocity v:'+v+' angle:'+angle+' vx:'+vx+' vy:'+vy);
    };

    /** Calculate the top left corner of the current frame.
     *
     */
//  suite('.updateFrame()', function () {
//    test('', function () {
//
//    });
//  });
    Plane.prototype.updateFrame = function () {
      this.frameX = (this.frame - 1) * this.width - (Math.floor((this.frame - 1) / this.cols) * this.cols * this.width);
//      console.log('right', (this.frame / this.cols * this.cols * this.width));
//      console.log('this.frame / this.cols', (this.frame / this.cols));
//      console.log('this.cols', this.cols, 'this.height', this.height);
      this.frameY = Math.floor((this.frame - 1) / this.cols) * this.height;
    };


    /** Returns this plane's distance from coordinate b.
     * @param {Coord} b
     * @returns {Number}
     */
//  suite('.dist()', function () {
//    var c = new Coord();

//    test('returns a Coord', function () {
//      assert.instanceOf(p.dist(c), Coord);
//    });

//      test('calculates the distance from Coord b to this plane\'s position', function () {
//        var result = p.dist(c);
//        assert.equal(result, Math.sqrt(200));
//      });
//  });


    /** Renders this object on the supplied 2d canvas rendering context
     *  @param {CanvasRenderingContext2D} ctx
     */
//  suite('.draw()', function () {
//  test('', function () {
//
//  });
//});
//    Plane.prototype.draw = function (ctx) {
//    };

    /** Clears the rect currently occupied on the supplied context.
     * @param {CanvasRenderingContext2D} ctx
     */
//  suite('.clear()', function () {
//  test('', function () {
//
//  });
//});
//    Plane.prototype.clear = function (ctx) {
//    };



//  suite('.crash()', function () {
//    test('crashing state is true', function () {
//      p.crash();
//      assert.isTrue(p.crashing);
//    });

//    test('animation is set to crash', function () {
//
//    });

//    test('framecount is 0', function () {
//      p.crash();
//      assert.equal(p.fCount, 0);
//    });
//});

    /** Applies the (inverse) alpha mask and saves the composite [ImageElement] to img.
     * @param {Image} alpha
     * @param {Image} img
     */
    //Plane.prototype.initMask = function (alpha, img) {


    /** Move this plane to the specified [Coord]
     * @param {Coord} dest
     */
    suite('.move()', function () {
      test('changes the planes position to the specified coordinates', function () {
        var c1 = new Coord({x: 25, y: 39});
        p.move(c1);
        assert.equal(p.pos.x, 25);
        assert.equal(p.pos.y, 39);
      });
    });

    /** Land this plane on the specified runway.
     * @param {Path} runway
     */
//    suite('.land()', function () {
//      var runway = new Path();
//      runway.push(new Coord({x: 25, y: 39}));
//      runway.push(new Coord({x: 100, y: 39}));
//      p.land(runway);
//        test('plane\'s path is set to runway', function () {
//          assert.equal(p.path, runway);
//        });

//        test('plane is moved to runway start point', function () {
//          assert.equal(p.pos, runway[0]);
//        });

//        test('landing state is set to true', function () {
//          assert.isTrue(p.landing);
//        });

//        test('heading is set', function () {
//
//        });
//        test('acceleration is set', function () {
//
//        });
//    });
  });

});