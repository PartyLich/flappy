suite('Array', function () {
  suite('.push()', function () {
    test('should append a value', function () {
      var arr = [];
      arr.push('foo');
      arr.push('bar');
      assert(arr[0] == 'foo');
      assert(arr[1] == 'bar');
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
        var arr = [];
        arr.push('foo', 'bar');
        assert.equal(arr[0], 'foo');
        assert.equal(arr[1], 'bar');
      });
    });
  });

  suite('.unshift()', function () {
    test('should prepend a value', function () {
      var arr = [1,2,3];
      arr.unshift('foo');
      assert.equal(arr[0], 'foo');
      assert.equal(arr[1], 1);
    });

    test('should return the length', function () {
      var arr = [];
      var n = arr.unshift('foo');
      assert.equal(n, 1);
      var n = arr.unshift('bar');
      assert.equal(n, 2);
    });

    suite('with many arguments', function () {
      test('should add the values', function () {
        var arr = [];
        arr.unshift('foo', 'bar');
        assert.equal(arr[0], 'foo');
        assert.equal(arr[1], 'bar');
      });
    });
  });

  suite('.pop()', function () {
    test('should remove and return the last value', function () {
      var arr = [1,2,3];
      assert.equal(arr.pop(), 3);
      assert.equal(arr.pop(), 2);
      assert.lengthOf(arr, 1, 'array has length of 1');
    });
  });

  suite('.shift()', function () {
    test('should remove and return the first value', function () {
      var arr = [1,2,3];
      assert.equal(arr.shift(), 1);
      assert.equal(arr.shift(), 2);
      assert.lengthOf(arr, 1);
    });
  });

  suite('fail', function () {
    test('should fail intentionally', function () {
      assert.equal(false, true, 'This test designed to fail');
    });
  });
});