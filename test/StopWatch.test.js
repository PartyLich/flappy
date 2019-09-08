// import assert from 'assert';
import { assert, } from 'chai';
import { suite, test, setup, } from 'mocha';

import StopWatch from '../src/models/StopWatch';


suite('StopWatch', function () {
  let watch;

  setup(function () {
    watch = new StopWatch();
  });

  suite('new StopWatch()', function () {
    test('creates instance of StopWatch', function () {
      assert.instanceOf(watch, StopWatch);
    });

    test('running initializes to false', function () {
      const expected = false;
      const actual = watch.running;
      assert.deepEqual(actual, expected);
    });
  });

  suite('.start()', function () {
    test('running is set to true', function () {
      watch.start();
      const expected = true;
      const actual = watch.running;
      assert.deepEqual(actual, expected);
    });
  });

  suite('.stop()', function () {
    test('sets running to false', function (done) {
      const expected = false;

      watch.start();
      setTimeout(() => {
        watch.stop();
        const actual = watch.running;
        assert.deepEqual(actual, expected);
        done();
      }, 20);
    });
  });

  suite('.reset()', function () {
    test('resets startTime and elapsedMilliseconds', function (done) {
      watch.start();
      setTimeout(() => {
        const start = watch.startTime;

        watch.reset();
        assert.deepEqual(watch.elapsedMilliseconds, 0);
        assert.isBelow(start, watch.startTime);
        done();
      }, 30);
      watch.update();
    });
  });

  suite('.update()', function () {
    test('updates elapsedMilliseconds', function (done) {
      const expected = true;
      const ms = watch.elapsedMilliseconds;
      watch.start();
      setTimeout(() => {
        watch.update();
        assert.deepEqual(watch.elapsedMilliseconds > ms, expected);
        done();
      }, 20);
    });

    test('does not update if running is false', function (done) {
      const expected = watch.elapsedMilliseconds;
      watch.stop();
      setTimeout(() => {
        watch.update();
        assert.equal(watch.elapsedMilliseconds, expected);
        done();
      }, 20);
    });

    test('returns running state', function () {
      watch.start();
      let expected = watch.running;
      let actual = watch.update();
      assert.deepEqual(actual, expected, 'matches running state after start');

      watch.stop();
      expected = watch.running;
      actual = watch.update();
      assert.deepEqual(actual, expected);
    });
  });
});
