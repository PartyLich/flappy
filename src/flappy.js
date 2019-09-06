/**
 *
 */
require.config({
  paths: {  // Configure library/module paths.
    // 'jquery' : 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min',
    'jquery' : 'lib/jquery-1.8.2.min',
    'haml': 'lib/haml',

    'mathLib': 'lib/mathLib',
    'Mediator': 'lib/mediator',
    'Graphics': 'lib/Graphics',
    'Physics': 'lib/physics',

    'animation': 'models/Animation',
    'ball': 'models/Ball',
    'Coord': 'models/Coord',

    'player': 'models/Player',
    'pipe': 'models/Pipe',
    'StopWatch': 'models/StopWatch',
  },
  // Shim config FTW: http://requirejs.org/docs/api.html#config-shim
  shim: {
    'haml': {
      exports: 'Haml',
    },
  },
});


require(['jquery', 'haml', 'engine'], function ($, Haml, Engine) {
  $(function () {
    // RequestAnimationFrame shim
    const requestAnimationFrame = window.requestAnimationFrame
        || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame
        || window.msRequestAnimationFrame;
    const engine = new Engine();

    window.requestAnimationFrame = requestAnimationFrame;

    engine.home();
  });
});
