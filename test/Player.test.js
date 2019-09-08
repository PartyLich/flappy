// import assert from 'assert';
import { assert } from 'chai';
import { suite, test, suiteSetup } from 'mocha';

import Player from '../src/models/Player';

// client stand in
import { JSDOM } from 'jsdom';
const window = (new JSDOM(``, {pretendToBeVisual: true})).window;
global.window = window;
global.Image = window.Image;

// Mocks. Uh oh.
const Mediator = function () {
  return ({
    installTo(obj) {
      obj.publish = () => 'publish';
    },
  });
};

const Image = function () {
  return {};
};


suite('Player', function () {
  suite('new Player()', function () {
    test('creates a Player instance', function () {
      const actual = new Player({x: 0, y: 0}, {crossOrigin: 'Anonymous', src: ''},
          {crossOrigin: 'Anonymous', src: ''}, 100, 100, {mediator: new Mediator()});
      assert.instanceOf(actual, Player);
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
      p = new Player({x: 0, y: 0}, {crossOrigin: 'Anonymous', src: ''},
          {crossOrigin: 'Anonymous', src: ''}, 100, 100, {mediator: new Mediator()});
      done();
    });

    test('updates the player\'s scale', function () {
      const expected = 5;
      p.setScale(expected);

      const actual = p.scale;
      assert.deepEqual(actual, expected, 'updates the player\'s scale');
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

  suite.skip('.velocity()', function () {
    test('', function () {
      const actual = false;
      const expected = true;
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
      p = new Player({x: 0, y: 0}, {crossOrigin: 'Anonymous', src: ''},
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
      p = new Player({x: 0, y: 0}, {crossOrigin: 'Anonymous', src: ''},
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
