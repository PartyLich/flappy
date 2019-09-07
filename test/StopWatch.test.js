require(['StopWatch'], function(StopWatch) {

suite('StopWatch', function () {
  var watch;

  setup(function () {
    watch = new StopWatch();
  });

  suite('new StopWatch()', function () {
    test('creates instance of StopWatch', function () {
      assert.instanceOf(watch, StopWatch);
    });

    test('running initializes to false', function () {
      assert.isFalse(watch.running);
    });
  });

  suite('.start()', function () {
    test('running is set to true', function () {
      watch.start();
      assert.isTrue(watch.running);
    });
  });

  suite('.stop()', function () {
    test('sets running to false', function () {
      watch.start();
      setTimeout(20);
      watch.stop();
      assert.isFalse(watch.running);
    });
  });

  suite('.reset()', function () {
    test('resets startTime and elapsedMilliseconds', function () {
      watch.start();
      setTimeout(50);
      watch.update();
      var ms = watch.elapsedMilliseconds + 0,
          start = watch.startTime + 0;

      watch.reset();
      assert.equal(watch.elapsedMilliseconds, 0);
      assert(ms > watch.elapsedMilliseconds, 'ms '+ms+' > reset elapsedMilliseconds' + watch.elapsedMilliseconds);
      assert(start < watch.startTime, 'original startTime ('+start+') < reset startTime('+watch.StartTime+')');
    });
  });

  suite('.update()', function () {
    test('updates elapseMilliseconds', function () {
      var ms = watch.elapsedMilliseconds;
      watch.start();
      setTimeout(20);

      watch.update();
      assert(watch.elapsedMilliseconds > ms);
    });

    test('does not update if running is false', function () {
      var ms = watch.elapsedMilliseconds;
      watch.stop();
      setTimeout(20);

      watch.update();
      assert.equal(watch.elapsedMilliseconds, ms);
    });

    test('returns running state', function () {
      watch.start();
      assert.isTrue(watch.update());
      watch.stop();
      assert.isFalse(watch.update());
    });
  });
});

});
