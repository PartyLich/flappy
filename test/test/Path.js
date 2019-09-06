require(['path', 'coord'], function (Path, Coord) {

  suite('Path', function () {
    suiteSetup(function done() {
//      var Path = require('path');
//      require(['path'], function (Path) {
//        done();
//      });
    });

    suite('new Path()', function () {
      test('should create an object', function () {
        var path = new Path();
        assert.isObject(path, 'path is an object.');
      });

      test('should be an instance of Path', function () {
        var path = new Path();
        assert.instanceOf(path, Path, 'path is an instance of Path.');
      });
    });

    suite('.push()', function () {
      test('should append a value', function () {
        var path = new Path(),
            c1 = new Coord(),
            c2 = new Coord({x:10, y:10});

        path.push(c1);
        path.push(c2);
        assert(path[0] == c1);
        assert(path[1] == c2);
      });

      test('should return the length', function () {
        var arr = [];
        var n = arr.push('foo');
        assert.equal(n, 1);
        var n = arr.push('bar');
        assert.equal(n, 2);
      });

      suite('with many arguments', function () {
        test('should add the values', function () {
          var path = new Path(),
              c1 = new Coord(),
              c2 = new Coord({x:10, y:10});

          path.push(c1, c2);
          assert.equal(path[0], c1);
          assert.equal(path[1], c2);
        });
      });
    });
  });

});