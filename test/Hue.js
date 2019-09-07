require(['hue'], function(Hue) {

  suite('Hue', function () {
    suite('new Hue()', function () {
      test('creates a Hue instance', function () {
        var h = new Hue();
        assert.instanceOf(h, Hue);
      });

      test('initializes color values to 0, alpha to 1 by default', function () {
        var h = new Hue();
        assert.equal(h.r, 0);
        assert.equal(h.g, 0);
        assert.equal(h.b, 0);
        assert.equal(h.a, 1);
      });

      test('initializes specified color values to 0, defaults others', function () {
        var h = new Hue(null, 128),
            h2 = new Hue(null, null, 128, .5);
        assert.equal(h.r, 0);
        assert.equal(h.g, 128);
        assert.equal(h.b, 0);
        assert.equal(h.a, 1);

        assert.equal(h2.r, 0);
        assert.equal(h2.g, 0);
        assert.equal(h2.b, 128);
        assert.equal(h2.a, .5);
      });
    });

    suite('.toString()', function () {
      test('returns a String', function () {
        var h = new Hue();

        assert.typeOf(h.toString(), 'string');
      });
    });
  });

});