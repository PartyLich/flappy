/**
 *
 */
require.config({
  paths: {  //Configure library/module paths.
    /*'jquery' : 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min',*/
    'jquery' : 'lib/jquery-1.8.2.min',
    'haml': 'lib/haml',

    'mathLib': 'lib/mathLib',
    'Mediator': 'lib/mediator',
    'Graphics': 'lib/graphics',
    'Physics': 'lib/physics',

    'action': 'models/action',
    'animation': 'models/animation',
    'ball': 'models/ball',
    'Coord': 'models/Coord',
    'hue': 'models/hue',
    'path': 'models/path',
//    'plane': 'models/plane',
    'player': 'models/player',
    'pipe': 'models/Pipe',
    'StopWatch': 'models/StopWatch'
  },
  //Shim config FTW: http://requirejs.org/docs/api.html#config-shim
  shim: {
    'haml': { exports: 'Haml' }
  }
});


require(['jquery', 'haml', 'engine'], function($, Haml, Engine) {
  $(function() {
    //RequestAnimationFrame shim
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
        //
        engine = new Engine();

    window.requestAnimationFrame = requestAnimationFrame;

    engine.home();
  });
});
