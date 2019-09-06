/** Math related library functions.
 */
define(function (require) {
  /** Returns a random integer between min and max
   * Using Math.round() will give you a non-uniform distribution!
   * From MDN
   * @param {Number} min
   * @param {Number} max
   * @return {Number}
   */
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  /** Returns a random number between min and max
   * @param {Number} min
   * @param {Number} max
   * @return {Number}
   */
  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }


  /**
   *  Returns the control point for a quadratic bezier from p0 to p2 passing
   *  through onCurve.
   *  @param {Coord} p0
   *  @param {Coord} onCurve
   *  @param {Coord} p2
   *  @return {Coord}
   */
  //  Coord ctrlPointQ(Coord p0, Coord onCurve, Coord p2) {
  //    int c1, c2, t, x1, y1;

  //    //Calculate chord lengths.
  //    c1 = p0.dist(onCurve);
  //    c2 = onCurve.dist(p2);

  //    //Approximate t (as proportion of total arc).
  //    t = c1 ~/ (c1 + c2);

  //  //Solve quadratic bezier for control point p1
  //  x1 = (onCurve.x - /*Math.pow((1-t), 2)*/(1-t)*(1-t) * p0.x - t * t * p2.x)
  //      ~/ (2 * t * (1-t))/*).floor()*/;
  //  y1 = (onCurve.y - /*Math.pow((1-t), 2)*/(1-t)*(1-t) * p0.y - t * t * p2.y)
  //      ~/ (2 * t * (1-t))/*).floor()*/;

  //    return new Coord.init(x1, y1);
  //  }


    /**
     *  Returns the control points for a cubic bezier from p0 to p3 passing
     *  through p4 and p5.
     */
  //  List<Coord> ctrlPointC(Coord p0, Coord p4, Coord p5, Coord p3) {
  //    int c1, c2, c3, t1, t2;
  //    Coord xs, ys;

      /** Returns solution [Coord] for system of linear equations
       *  ax + by = c
       *  dx + ey = f
       */
  //    Coord solveLinear(a, b, c, d, e, f) {
  //      num x, y;

  //      x = (d * c - f * a) / (b * d - a * e);
  //      y = (c - b * x) / a;

  //     // return new Coord.init(x, y);
  //      return new Coord.init(y, x);
  //    }

  //    // Calculate chord lengths.
  //    c1 = p0.dist(p4);
  //    c2 = p4.dist(p5);
  //    c3 = p5.dist(p3);

  //    // Approximate t1 and t2 (as proportion of total arc).
  //    t1 = c1 ~/ (c1 + c2 + c3);
  //    t2 = (c1 + c2) ~/ (c1 + c2 + c3);

  //    // Bezier helper functions.
  //    int b0(t) => Math.pow((1 - t), 3);
  //    int b1(t) => 3 * t * Math.pow((1 - t), 2);
  //    int b2(t) => 3 * t * t  * (1 - t);
  //    int b3(t) => Math.pow(t, 3);

      //Solve linear equations for control points
  //    xs = solveLinear(b1(t1), b2(t1), p4.x - (p0.x * b0(t1)) - p3.x * b3(t1), b1(t2), b2(t2), p5.x - (p0.x * b0(t2)) - p3.x * b3(t2));
  //    ys = solveLinear(b1(t1), b2(t1), p4.y - (p0.y * b0(t1)) - p3.y * b3(t1), b1(t2), b2(t2), p5.y - (p0.y * b0(t2)) - p3.y * b3(t2));

  //    return [new Coord.init(xs.x, ys.x), new Coord.init(xs.y, ys.y)];
  //  }
  //}

  return {
    getRandomInt: getRandomInt,
    getRandom: getRandom
  };
});
