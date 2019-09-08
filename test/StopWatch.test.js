// import assert from 'assert';
import { assert, } from 'chai';
import { suite, test, setup, } from 'mocha';

import StopWatch from '../src/models/StopWatch';


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
      setTimeout(() => {
        watch.stop();
        assert.isFalse(watch.running);
      }, 20);
    });
  });

  suite('.reset()', function () {
    test('resets startTime and elapsedMilliseconds', function (done) {
      watch.start();
      setTimeout(() => {
        var ms = watch.elapsedMilliseconds + 0,
        start = watch.startTime + 0;

        watch.reset();
        assert.deepEqual(watch.elapsedMilliseconds, 0);
        assert.isBelow(start, watch.startTime);
        done();
      }, 30);
      watch.update();
    });
  });

  suite('.update()', function () {
    test('updates elapseMilliseconds', function (done) {
      const ms = watch.elapsedMilliseconds;
      watch.start();
      setTimeout(() => {
        watch.update();
        assert.deepEqual(watch.elapsedMilliseconds > ms, true);
        done();
      }, 20);
    });

    test('does not update if running is false', function (done) {
      var ms = watch.elapsedMilliseconds;
      watch.stop();
      setTimeout(() => {
        watch.update();
        assert.equal(watch.elapsedMilliseconds, ms);
        done();
      }, 20);
    });

    test('returns running state', function () {
      watch.start();
      assert.isTrue(watch.update());
      watch.stop();
      assert.isFalse(watch.update());
    });
  });
});
