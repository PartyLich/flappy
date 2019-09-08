// import assert from 'assert';
import { assert } from 'chai';
import { suite, test, suiteSetup } from 'mocha';

import Pipe from '../src/models/Pipe';

// client stuff
import { JSDOM } from 'jsdom';
const window = (new JSDOM(``, {pretendToBeVisual: true})).window;
global.window = window;
global.Image = window.Image;

// Mocks. Uh oh.
const Mediator = function () {
  const publishedMsgs = [];

  return ({
    installTo(obj) {
      obj.publish = (channel) => publishedMsgs.push(channel);
    },
    publishedMsgs,
  });
};

const Image = function () {
  return {};
};


suite('Pipe', function () {
  suite('new Pipe()', function () {
    let mediator;

    suiteSetup(function (done) {
      mediator = new Mediator();
      done();
    });

    test('creates a Pipe instance', function () {
      const actual = new Pipe({x: 0, y: 0}, {crossOrigin: 'Anonymous', src: ''},
          {crossOrigin: 'Anonymous', src: ''}, 100, 100, {mediator});
      assert.instanceOf(actual, Pipe);
    });

    test('publishes to the g:maskImg channel', function () {
      new Pipe({x: 0, y: 0}, {crossOrigin: 'Anonymous', src: ''},
          {crossOrigin: 'Anonymous', src: ''}, 100, 100, {mediator});
      const actual = mediator.publishedMsgs[0];
      const expected = 'g:maskImg';
      assert.deepEqual(actual, expected);
    });
  });

  suite.skip('.setAnim()', function () {
    test('', function () {
      const actual = false;
      const expected = true;
      assert.deepEqual(actual, expected);
    });
  });

  suite('.setScale()', function () {
    let p;

    suiteSetup(function (done) {
      p = new Pipe({x: 0, y: 0}, {crossOrigin: 'Anonymous', src: ''},
          {crossOrigin: 'Anonymous', src: ''}, 100, 100, {mediator: new Mediator()});
      done();
    });

    test('updates the pipe\'s scale', function () {
      const expected = 5;
      p.setScale(expected);

      const actual = p.scale;
      assert.deepEqual(actual, expected, 'updates the pipe\'s scale');
    });

    test('won\'t set scale smaller than minScale', function () {
      const {minScale} = p;
      const expected = minScale;
      p.setScale(minScale - .05);
      const actual = p.scale;
      assert.deepEqual(actual, expected);
    });

    test('updates radius', function () {
      const expected = 25;
      p.setScale(.5);
      const actual = p.r;
      assert.deepEqual(actual, expected);
    });
  });

  suite.skip('.updateFrame()', function () {
    test('', function () {
      const actual = false;
      const expected = true;
      assert.deepEqual(actual, expected);
    });
  });

  suite.skip('.draw()', function () {
    test('', function () {
      const actual = false;
      const expected = true;
      assert.deepEqual(actual, expected);
    });
  });

  suite.skip('.clear()', function () {
    test('', function () {
      const actual = false;
      const expected = true;
      assert.deepEqual(actual, expected);
    });
  });

  suite.skip('.die()', function () {
    let p;

    suiteSetup(function (done) {
      p = new Pipe({x: 0, y: 0}, {crossOrigin: 'Anonymous', src: ''},
          {crossOrigin: 'Anonymous', src: ''}, 100, 100, {mediator: new Mediator()});
      done();
    });

    test('sets crashing to true', function () {
      const actual = false;
      const expected = true;
      assert.deepEqual(actual, expected);
    });

    test('sets fcount to 0', function () {
      const actual = false;
      const expected = true;
      assert.deepEqual(actual, expected);
    });

    test('sets animation', function () {
      const actual = false;
      const expected = true;
      assert.deepEqual(actual, expected);
    });

    test('calls updateFrame', function () {
      const actual = false;
      const expected = true;
      assert.deepEqual(actual, expected);
    });
  });

  suite('bounding rectangle getters', function () {
    let p;

    suiteSetup(function (done) {
      p = new Pipe({x: 0, y: 0}, {crossOrigin: 'Anonymous', src: ''},
          {crossOrigin: 'Anonymous', src: ''}, 100, 100, {mediator: new Mediator()});
      done();
    });

    suite('.left', function () {
      test('returns x position - width / 2', function () {
        const actual = p.left;
        const expected = -50;
        assert.deepEqual(actual, expected);
      });
    });

    suite('.right', function () {
      test('returns x position + width/2', function () {
        const actual = p.right;
        const expected = 50;
        assert.deepEqual(actual, expected);
      });
    });

    suite('.top', function () {
      test('returns y - height/2', function () {
        const actual = p.top;
        const expected = -50;
        assert.deepEqual(actual, expected);
      });
    });

    suite('.bottom', function () {
      test('returns y + height/2', function () {
        const actual = p.bottom;
        const expected = 50;
        assert.deepEqual(actual, expected);
      });
    });
  });
});
