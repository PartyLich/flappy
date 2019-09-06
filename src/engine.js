import $ from 'jquery';
import Coord from './models/Coord';
import Pipe from './models/Pipe';
import Player from './models/Player';
import StopWatch from './models/StopWatch';
import Mediator from './lib/mediator';
import Graphics from './lib/Graphics';
import Physics from './lib/physics';
import {getRandomInt} from './lib/mathLib';

// templates
import tmplStartBtn from './tmpl/startButton';
import tmplScore from './tmpl/score.js';


  /**
   * Main game engine
   * @return {object}
   */
export default function Engine() {
    let frameCount = 0;
    let score = 0;
    let curLevel = 0;
    let loadQueue = 1;
    const stpFrame = new StopWatch();
    const bg = new Image();
    const cvsFront = $('#cvsFront')[0];
    const cvsBg = $('#cvsBg')[0];
    let cX = cvsFront.width;
    let cY = cvsFront.height;
    const objList = [];
    const levels = [];
    const imgSprites = [];
    const eventList = [];

    const mediator = new Mediator();
    const graphics = new Graphics(mediator);
    const physics = new Physics(mediator);

    let user = null;
    let hiScore = 0;

    // templates


    // Get canvas contexts.
    const ctxFront = cvsFront.getContext('2d');
    ctxFront.font = 'normal 12px sans-serif';

    const ctxBg = cvsBg.getContext('2d');


    // Initialize plane sprites
    loadSprites();

    // Initialize level list
    levels.push(
        'json/lvl1.json'
    );

    // Install mediator
    mediator.installTo(this);


    /**
     *
     */
    function run() {
      console.log('Starting run.');
      cvsFront.width = cvsFront.width;
      cvsBg.width = cvsBg.width;
      cX = cvsFront.width;
      cY = cvsFront.height;
      ctxFront.font = 'normal 12px sans-serif';

      //
      frameCount = 0;
      stpFrame.reset();
      stpFrame.start();

      // Reset scoring.
      if (curLevel == 0) score = 0;
      collisions = 0;


      // Place background canvas where it needs to be.
      $(cvsBg).css({
        'left': $(cvsFront).position().left + 'px',
        'top': $(cvsFront).position().top + 'px',
      });

      // Register some event handlers!
      $(cvsFront)
          .mousedown(mDown);

      // Add Player
      const type = getRandomInt(1, imgSprites.length - 1);
      user = new Player(new Coord({x: imgSprites[type].frameWidth/2+5, y: 450}),
          imgSprites[type].img, imgSprites[type].alpha,
          imgSprites[type].frameWidth, imgSprites[type].frameHeight,
          {mediator: mediator}
      );
      console.log(user);
      objList.push(user);

      // Add first pipe
      addPipe();

      // Request first frame.
      console.log('about to gameTick');
      window.requestAnimationFrame(gameTick);
    }


    /** Main game loop
     * @param {Number} time  When this animation frame is scheduled to run.
     */
    function gameTick(time) {
      let index = 0;
      let obj = null;
      // Make sure we're loaded.
      if (stillLoading()) {
        return;
      }

      // update timer
      stpFrame.update();

      // Clear displayed text
      ctxFront.clearRect(0, 0, 250, 20); // top left diag text
      ctxFront.clearRect(0, cY - 35, 150, 20); // score

      // Process current event list item
      if (eventList.length) { eventProcess(); }

      // Process object list
      for (index = 0, obj; obj = objList[index]; index++) {
        if (!obj) { continue; }

        // Erase the foreground canvas.
        mediator.publish('g:clearObject', obj, ctxFront);

        // remove dead planes
        if (obj.dead) {
          objList.splice(index, 1);

          continue;
        }

        // Collision detection
        if (collisionDetection(index, obj)) { continue; }

        // New position and boundary looping
        mediator.publish('p:reposition', obj, cX, cY);
        ctxFront.fillStyle = '#FF0000';
      }

      // Draw all objects.
      for (const obj of objList) {
        mediator.publish('g:drawObject', obj, ctxFront);
      }

      // Framerate
      frameCount++;
      ctxFront.fillText('Framerate: '+ Math.round(frameCount / (stpFrame.elapsedMilliseconds / 1000))
          +'    Time:'+(stpFrame.elapsedMilliseconds / 1000), 5, 10);

      // Display current score.
      ctxFront.fillText('Score: '+ score, 5, cY - 25);

      // Request the next animation frame or end the game.
      if (user.dead) {
        endGame();
      } else {
        window.requestAnimationFrame(gameTick);
      }
    }

    /**
     * Check if resources are still being loaded
     * @return {boolean} true is resources are still loading, false otherwise
     */
    function stillLoading() {
      if (loadQueue < 1) {
        const loadingText = 'LOADING...';
        const txtWidth = ctxFront.measureText(loadingText).width;
        ctxFront.save();
        ctxFront.font = 'bold 30px sans-serif';
        ctxFront.fillText(loadingText, cX / 2 - txtWidth / 2, cY / 2);
        ctxFront.restore();
        console.log('loadQueue', loadQueue);
        return true;
      }

      return false;
    }

    function endGame() {
      console.log('Ending game loop.');
      // stop the game clock.
      stpFrame.stop();

      // Remove canvas event listeners
      $(cvsFront).off('mousedown', mDown)
          .off('mouseup');

      // Scoring update
      hiScore = (score > hiScore) ? score : hiScore;

      // broadcast level end message
      mediator.publish('sys:levelEnd');
      levelEnd(); // inter level transition screen
    }


    /** Display the home splash screen and such.
     */
    function home() {
      let $btnStart = $('#btnStart');
      let $btnScore = $('#btnScore');

      // clear objlist
      objList.length = 0;

      // Create nav buttons if they don't already exist.
      if (!$btnStart.length) {
        $btnStart = $( tmplStartBtn({id: 'btnStart', text: 'START'}) );
        $('body').append($btnStart);
      }
      if (!$btnScore.length) {
        $btnScore = $( tmplStartBtn({id: 'btnScore', text: 'SCORE'}) );
        $('body').append($btnScore);
      }

      // Show buttons
      $btnStart.show();
      $btnScore.show();

      // Hide the high score list.
      if ($('#scoreTable').length) $('#scoreTable').hide();

      // Title
      cvsFront.width = cvsFront.width;
      cvsBg.width = cvsBg.width;
      ctxFront.font = 'bold 50px Courier';
      ctxFront.fillStyle = 'rgb(163, 188, 227)';
      ctxFront.fillText('Flappy Times Ahoy!', 250, 40);

      // Display buttons
      $btnStart.css({
        'position': 'absolute',
        'top': $(cvsFront).height() * .75 + 'px',
        'left': $(cvsFront).width() *.33 + 'px',
        'z-index': '3',
      });
      $btnScore.css({
        'position': 'absolute',
        'top': $btnStart.css('top'),
        'left': $(cvsFront).width() *.33 + 100 + 'px',
        'z-index': '3',
      });

      // Add some event handlers
      $btnStart.one('click', startClick);
      $btnScore.one('click', scoreClick);
    }


    /** Loads the level specified by the [String] uri
     * @param {String} url
     */
    function loadLevel(url) {
      // Open synchronous GET request.
      console.log('loadlevel url: ' + url);
      syncGetJson(url, function (result) {
        // Initialize background image.
        bg.src = '';
        bg.src = result.bg;
        // Set the background image's load event to draw it on the canvas.
        console.log('cX', cX);
        $(bg).one('load', drawBg);
      });
    }


    /** Callback function to draw an image to the background canvas on image
     *  load.
     */
    function drawBg() {
      mediator.publish('g:drawBg', this, ctxBg, cX, cY);
    }


    /** Loads the scores list specified by the [String] url.
     * @param {String} url
     */
    function loadScores(url) {
      let table;
      const render = tmplScore({
        scores: [
          { "name": "Last", "score": score },
          { "name": "Best", "score": hiScore }
        ]
      });

      table = $('#scoreTable');

      // Create the table if it doesnt exist.
      if (!table.length) {
        table = $(render);
        // Add table to doc
        $('body').append(table);
      } else {
        table.html(render);
      }

      // TODO: just give it a canvas sized div and center the darn thing
      table.css({
        'position': 'absolute',
        'top': $(cvsFront).height() * .35 + 'px',
        'left': $(cvsFront).width() *.25 + 'px',
        'z-index': '2',
      });

      table.show();
    }

    /** Submit a score to the server at location specified by {String} url
     * @param {String} url
     */
    function sendScore(url) {
      // Get user info?

      // Send POST request to server.
      $.post(url, {score: score, date: date}, function (data) {
        // Display result dialog.
        $('#dialog-modal').text(data.response);
        $('#dialog-modal').dialog('open');
      }, 'JSON');
    }


    /** Inter-level transition screen. Re-uses home screen nav buttons */
    function levelEnd() {
      let btnHome = $('#btnStart');
      let btnNext = $('#btnScore');

      // Create nav buttons if they don't already exist.
      if (btnHome == null) {
        btnHome = $('<button id="btnHome"></button>');
        $('body').append(btnHome);
      }
      if (btnNext == null) {
        btnNext = $('<button id="btnNext"></button>');
        $('body').append(btnNext);
      }

      // Show buttons
      btnHome.show();
      btnHome.text('HOME');

      // Display buttons
      btnHome.css({
        'position': 'absolute',
        'top': $(cvsFront).height() * .75 + 'px',
        'left': $(cvsFront).width() *.33 + 'px',
        'z-index': '3',
      });
      loadScores();

      // New event handlers
      btnHome.one('click', homeClick);
    }


    /** Canvas4 mouseDown event handler. Gives user vertical velocity */
    function mDown(ev) {
      user.vy = -10;
    }


    /** Start button event
     * @param {Event} ev
     */
    function startClick(ev) {
      console.log('startClick');
      const btnStart = $('#btnStart');
      const btnScore = $('#btnScore');

      // hide buttons.
      btnStart.hide();
      btnScore.hide();

      // Load level
      curLevel = 0;
      loadLevel(levels[curLevel]);

      // Remove event handler so we don't end up with multiples.
      btnScore.off('click', scoreClick);

      // Start the game!
      run();
    }


    /** Score button event */
    function scoreClick(ev) {
      console.log('scoreClick');
      const btnHome = $('#btnStart');
      const btnScore = $('#btnScore');

      // Adjust nav buttons
      btnScore.hide();
      btnHome.text('HOME');

      // Adjust event handlers.
      btnHome.off('click', startClick);
      btnHome.one('click', homeClick);

      // Show the score table
      loadScores('json/scores.json');
    }


    /** Home button event */
    function homeClick(ev) {
      console.log('homeClick');
      const btnHome = $('#btnStart');
      const btnNext = $('#btnScore');

      btnHome.text('START');
      btnNext.text('SCORES');

      // Remove event handler so we don't end up with multiples.
      btnNext.off('click', nextClick);

      //
      home();
    }

    /** Next level button event */
    function nextClick(ev) {
      console.log('nextClick');
      const btnHome = $('#btnStart');
      const btnNext = $('#btnScore');

      if (curLevel < levels.length-1) { // More levels!
        // Remove event handler(s).
        btnHome.off('click', homeClick);

        // hide buttons.
        btnHome.hide();
        btnNext.hide();

        // Load the next level
        loadLevel(levels[++curLevel]);

        // Start the game!
        run();
      } else { // No mas.
        // Load the next level
        loadLevel(levels[curLevel]);

        // Start the game!
        run();
      }
    }


    /** Add a new pipe, optionally specifying type and location
     * @param {int} type
     * @param {Coord} pos
     * @param {Number} heading
     */
    function addPipe(type, pos, heading) {
      const open = getRandomInt(60, cY - 60);
      if (type == null) {
        type = 0;
      }

      pos || (pos = new Coord({x: cX, y: open}));

      if (heading == null) {
        heading = 2 * Math.PI;
      }

      let pipe;

      try {
        pipe = new Pipe(pos, imgSprites[type].img, imgSprites[type].alpha,
            imgSprites[type].frameWidth, imgSprites[type].frameHeight,
            {mediator: mediator});

        console.log(pipe.animations.def);
      } catch (e) {
        console.log(imgSprites);
        console.log(e);
        console.log(e.stack);
        return;
      }

      // Alter plane heading/velocity/etc.
      pipe.setScale(1);

      // Add to object list.
      objList.push(pipe);
    }


    /** Initialize sprites
     */
    function loadSprites() {
      // Open synchronous GET request.
      syncGetJson('json/sprites.json', function (result) {
        // Initialize plane list.
        for (const sprite of result.sprites) {
          console.log('Adding sprite', sprite);
          const imgSprite = {
            img: loadImage(sprite.img),
            alpha: loadImage(sprite.alpha),
            frameWidth: sprite.frameWidth,
            frameHeight: sprite.frameHeight,
          };

          imgSprites.push(imgSprite);
        }
      });
    }


    /** Collision detection
     * @param {Number} index  Objectlist index.
     * @param {Plane} obj   Plane referenced by index.
     * @return {Boolean} True if collision detected.
     */
    function collisionDetection(index, obj) {
      if (obj instanceof Pipe) {
        // console.log("obj is a Pipe!");
        if (handlePipeCollision(obj)) return true;
      }

      // Player Collision detection
      return handlePlayerCollision(index, obj);
    }

    /**
     * [handlePipeCollision description]
     * @param {object} obj
     * @return {boolean}
     */
    function handlePipeCollision(obj) {
      if (obj.x + obj.width/2 <= 5) { // Pipe is off screen.
        // Increment score.
        mediator.publish('score:pipe');
        score++;

        // kill pipe
        obj.die();
        // add new pipe
        addPipe();

        return true;
      }
    }

    /**
    * [handlePlayerCollision description]
    * @param {number} index
    * @param  {object} obj [description]
    * @return {boolean}     [description]
    */
    function handlePlayerCollision(index, obj) {
      if (user.bottom >= cY) {
        // Hit the floor.
        user.die();
      }

      for (let i = index+1; i < objList.length; i++) {
        const obstacle = objList[i];

        if (obstacle.left > (user.right)) {
          // player hasnt reached this pipe
          break;
        }

        if (user.bottom > obstacle.y + obstacle.gap ||
           user.top < obstacle.y - obstacle.gap) {
          // Start crash sequences
          obj.die();
          obstacle.die();

          return true;
        }
      }

      return false;
    }

    /**
     * @param {String} src
     * @return {Image}
     */
    function loadImage(src) {
      const imgTmp = new Image();

      loadQueue--;
      $(imgTmp).one('load', resourceLoad);
      imgTmp.crossOrigin = 'Anonymous';
      imgTmp.src = src;

      return imgTmp;
    }


    /** Increments the resource loaded counter so we know everything is ready.
     */
    function resourceLoad() {
      loadQueue++;
      console.log('Resource loaded:', this, 'complete: ', this.complete);
    }


    /**
     * Synchronous GET request expecting JSON
     * @param  {string}   url      [description]
     * @param  {Function} callback [description]
     */
    function syncGetJson(url, callback) {
      $.ajax(url, {
        async: false,
        dataType: 'json',
        success: callback,
      });
    }


    return {
      home,
    };
  }
