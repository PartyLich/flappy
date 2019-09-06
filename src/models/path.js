define(['Coord', 'hue'], function(Coord, Hue){

  /**
   * Path class. A spiffy {Coord} list with drawing functions and such.
   * @param {Number} length
   * @returns {Path}
   */
  function Path(length) {
    //Super
    Array.call(this, length);

    this.topLeft = new Coord({x:9000, y:9000});
    this.bottomRight = new Coord({x:0, y:0});
    this.hue = new Hue();
  }

  //Inherit Array
  Path.prototype = new Array();
  //Correct the constructor pointer.
  Path.prototype.constructor = Path;


  /** Adds value at the end of the list, extending the length by one.
   * @param {Coord} element
   */
  Path.prototype.add = function (element) {
    //Type checking. I don't really care if it's a Coord, as long as it has x and y.
  //  if(element instanceof Coord) {
    if(element.hasOwnProperty('x') && element.hasOwnProperty('y')){
      //      _list.add(element);
      Array.prototype.push.call(this, element);

      //update loose boundary rect
      this.updateBounds(element.x, element.y);
    }
  };


  //  /**
  //   * Check whether the collection contains an element equal to [element].
  //   */
  //  bool contains(Coord element) => _list.contains(element);

  //  bool every(bool f(element)) => _list.every(f);

  //  bool some(bool f(element)) => _list.some(f);


  /** Returns true if this Path is empty.
   * @returns {Boolean}
   */
  Path.prototype.isEmpty = function () {
    return (this.length === 0);
  };

  //  /** Appends all elements of the collection to the end of list. Extends the
  //   *  length of the list by the length of collection. Throws an UnsupportedOperationException
  //   *  if the list is not extendable.
  //   */
  //  void addAll(Collection collection) => _list.addAll(collection);

  /** Adds one or more elements to the end of an array and returns the new length of the array and
   *  updates loose boundary rect.
   */
  Path.prototype.push = function (value) {
    this.add(value);
    return this.length;
  };


  /** Update loose boundary rect
   *  @param {Number} x
   *  @param {Number} y
   */
  Path.prototype.updateBounds = function (x, y) {

    if(x < this.topLeft.x) {
      this.topLeft.x = x;
    } else if(x > this.bottomRight.x) {
      this.bottomRight.x = x;
    }
    if(y < this.topLeft.y) {
      this.topLeft.y = y;
    } else if(y > this.bottomRight.y) {
      this.bottomRight.y = y;
    }
  };


  /** Removes all elements in the list. The length of the list becomes zero.
   */
  Path.prototype.clear = function () {
    this.length = 0;
  };


  /** Returns the last element of the list, or throws an out of bounds exception if the list is empty.
   * @returns {Coord}
   */
  Path.prototype.last = function () {
    return new Coord({x: this[this.length - 1].x, y: this[this.length - 1].y});
  };


  /** Returns a new {Path} identical to other.
   * @param {Path} other
   * @returns {Path}
   */
  Path.prototype.fromOther = function (other) {
    var i, newpath;

    newpath = new Path(other.length);
    newpath.hue = new Hue(other.hue.r, other.hue.g, other.hue.b, other.hue.a);

    for(i = 0; i < other.length; i++) {
      newpath.push(other[i]);
    }

    return newpath;
  };


  /**
   * Removes the element at position[index] from the list.
   *
   * This reduces the length of the list by one and moves all later elements
   * down by one position.
   * Returns the removed element.
   * Throws an [ArgumentError] if [index] is not an [int].
   * Throws an [IndexOutOfRangeException] if the [index] does not point inside
   * the list.
   * Throws an [UnsupportedError], and doesn't remove the element,
   * if the length of the list cannot be changed.
   */
  //  Coord removeAt(int index) => _list.removeAt(index);


  //  /** Sorts the list according to the order specified by the comparator. The order specified by the comparator
  //   * must be reflexive, anti-symmetric, and transitive.
  //   */
  //  void sort([Comparator compare = Comparable.compare]) => _list.sort(compare);


  /** Renders this object on the supplied canvas rendering context.
   * @param {CanvasRenderingContext2D} ctx
   */
  Path.prototype.draw = function (ctx) {
    var i;

    if(!this.length) return;

    ctx.save();

    ctx.strokeStyle = this.hue.toString();
    ctx.beginPath();

    //Move to first point.
    ctx.moveTo(this[0].x, this[0].y);

    //Draw lines connecting each point.
    for(i = 1; i < this.length; i++) {
      ctx.lineTo(this[i].x, this[i].y);
    }

    ctx.stroke();
    ctx.restore();
  };


  /** Clear the loose boundary rect occupied by this Path.
   * @param {CanvasRenderingContext2D} ctx
   */
  Path.prototype.undraw = function (ctx) {
    if(this.length > 0) {
        ctx.clearRect(this.topLeft.x-1, this.topLeft.y-1,
          this.bottomRight.x+1 - this.topLeft.x, this.bottomRight.y+1 - this.topLeft.y);
  //      print('662: ctx4.clearRect(${topLeft.x}, ${topLeft.y}, ${bottomRight.x - topLeft.x}, ${bottomRight.y - topLeft.y}');
    }
  };


  /** Renders this object on the supplied canvas rendering context using Bezier curves.
   * @param {CanvasRenderingContext2D} ctx
   */
  //Path.prototype.drawBez = function (ctx) {
      //Set up the drawing context.
  //    ctx.setStrokeColorRgb(hue.r, hue.g, hue.b, hue.a);
  //
      //Figure out how many cubic + quadratic curves to use
      //Draw cubics.
      //Draw Quadratics.
  //}

  return Path;
});