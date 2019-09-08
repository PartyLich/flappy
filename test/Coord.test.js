// import assert from 'assert';
import { assert } from 'chai';
import { suite, test } from 'mocha';

import Coord from '../src/models/Coord';


suite('Coord', function () {
  suite('.move()', function () {
    test('should update coordinates', function () {
      var b1 = new Coord(10, 10);

      b1.move(30, 30);
      assert.equal(b1.x, 30, 'Expected x to be 30');
      assert.equal(b1.y, 30, 'Expected y to be 30');
    });
  });

  suite('.dist()', function () {
    test('should calculate the distance between coordinates (coplanar)', function () {
      var c1 = new Coord(),
          c2 = new Coord({x:10, y:10});

      assert.equal(c1.dist(c2), Math.sqrt(200));
    });
  });

  suite('.midpoint()', function () {
    test('Returns the midpoint of this [Coord] and [Coord] b', function () {
      var c1 = new Coord(),
          c2 = new Coord({x:10, y:10}),
          result = c1.midpoint(c2);

      assert.equal(result.x, 5);
      assert.equal(result.y, 5);
    });
  });

  suite('.scale()', function () {
    test('Scales this [Coord] by the factor specified.', function () {
      var c1 = new Coord({x:10, y:10}),
          result = c1.scale(.5);

      assert.equal(result.x, 5);
      assert.equal(result.y, 5);
    });

    test('returns a Coord', function () {
      var c1 = new Coord({x:10, y:10}),
          result = c1.scale(.5);

      assert.instanceOf(result, Coord);
    });
  });

  suite('.minus()', function () {
    test('subtracts the x and y values', function () {
      var c1 = new Coord({x:20, y:15}),
          c2 = new Coord({x:10, y:10}),
          result = c1.minus(c2);

      assert.equal(result.x, 10);
      assert.equal(result.y, 5);
    });

    test('returns a Coord', function () {
      var c1 = new Coord({x:20, y:15}),
          c2 = new Coord({x:10, y:10}),
          result = c1.minus(c2);

      assert.instanceOf(result, Coord);
    });
  });

  suite('.plus()', function () {
    test('adds the x and y values', function () {
      var c1 = new Coord({x:10, y:10}),
          c2 = new Coord({x:10, y:10}),
          result = c1.plus(c2);

      assert.equal(result.x, 20);
      assert.equal(result.y, 20);
    });

    test('returns a Coord', function () {
      var c1 = new Coord({x:10, y:10}),
          c2 = new Coord({x:10, y:10}),
          result = c1.plus(c2);

      assert.instanceOf(result, Coord);
    });
  });
});
