define(['require', 'Coord', 'ball', 'hue', 'path', 'pipe', 'action', 'player', 'StopWatch',
  'Mediator', 'Graphics', 'Physics', 'mathLib',
  'text!tmpl/table.jshaml', 'text!tmpl/startButton.jshaml', 'text!tmpl/score.jshaml'],
function (require, Coord, Ball, Hue, Path, Pipe, Action, Player, StopWatch, Mediator, Graphics, Physics) {
  var getRandom = require('mathLib').getRandom,
      getRandomInt = require('mathLib').getRandomInt;

  /**
   *
   */
  function Engine() {
    var ctxFront, ctxBg,
        frameCount = 0, score = 0, collisions = 0,
        selected = null, curLevel = 0,
        loadQueue = 1,
        drag = false,
  //  Stopwatch stpFrame
        stpFrame = new StopWatch(),
        bg = new Image(),
  //  CanvasElement cvs4, cvsBg;
        cvsFront = $('#cvsFront')[0], cvsBg = $('#cvsBg')[0],
        cX = cvsFront.width,
        cY = cvsFront.height,
        objList = [], levels = [],
    //  imgSprites = new List<ImageElement>()
        imgSprites = [],
    //  eventList = new List<Action>()
        eventList = [],

        mediator = new Mediator(),
        graphics = new Graphics(mediator),
        physics = new Physics(mediator),

        user = null,
        hiScore = 0,

    //templates
        tmplTable = Haml( require('text!tmpl/table.jshaml'),
                      {customEscape: "Haml.html_escape"}),
        tmplStartBtn = Haml( require('text!tmpl/startButton.jshaml'),
                         {customEscape: "Haml.html_escape"}),
        tmplScore = Haml( require('text!tmpl/score.jshaml'),
                          {customEscape: "Haml.html_escape"});


    //Get canvas contexts.
    ctxFront = cvsFront.getContext("2d");
    ctxFront.font = 'normal 12px sans-serif';

    ctxBg = cvsBg.getContext("2d");


    //Initialize plane sprites
    loadSprites();

    //Initialize level list
    levels.push(
      'json/lvl1.json'
//      'json/lvl2.json',
//      'json/lvl3.json',
//      'json/lvl4.json',
//      'json/lvl5.json',
//      'json/lvl6.json',
//      'json/lvl7.json'
    );

    //Install mediator
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

      //Reset scoring.
      if(curLevel == 0) score = 0;
      collisions = 0;


      //Place background canvas where it needs to be.
      $(cvsBg).css({
          'left': $(cvsFront).position().left + 'px',
          'top': $(cvsFront).position().top + 'px'
      });

      //Register some event handlers!
      $(cvsFront).mousedown(mDown)
                 .mouseup(mUp4Path);

/*******/
      //Add Player
      var type = getRandomInt(1, imgSprites.length - 1);
      user = new Player(new Coord({x:imgSprites[type].frameWidth/2+5, y:450}),
          imgSprites[type].img, imgSprites[type].alpha,
          imgSprites[type].frameWidth, imgSprites[type].frameHeight,
          {mediator: mediator}
      );
//      user = new Player(new Coord({x:30, y:450}),
//          imgSprites[1].img, imgSprites[1].alpha,
//          imgSprites[1].frameWidth, imgSprites[1].frameHeight,
//          {mediator: mediator}
//      );
      console.log(user);
      objList.push(user);

      //Add first pipe
      addPipe();

 /*****/

      //Request first frame.
      console.log('about to gameTick');
      window.requestAnimationFrame(gameTick);
    }


    /**
     *
     */
    function write(message) {
      $('#status')[0].innerHTML += message + '<br />';
    }


    /** Main game loop
     * @param {Number} time  When this animation frame is scheduled to run.
     */
    function gameTick(time) {
      var index = 0,
          obj = null;
      //Make sure we're loaded.
      if(stillLoading()) {
        return;
      }

      //update timer
      stpFrame.update();

      //Clear displayed text
      ctxFront.clearRect(0, 0, 250, 20);              //top left diag text
      ctxFront.clearRect(0, cY - 35, 150, 20);          //score

      //Process current event list item
      if(eventList.length) {  eventProcess(); }

      //Process object list
      for(index = 0, obj; obj = objList[index]; index++) {
        if(!obj) { continue; }

        //Erase the foreground canvas.
        mediator.publish('g:clearObject', obj, ctxFront);

        //remove dead planes
        if(obj.dead) {
          objList.splice(index, 1);

          continue;
        }

        //Collision detection
        if(collisionDetection(index, obj)) { continue; }

        //New position and boundary looping
        mediator.publish('p:reposition', obj, cX, cY);
        ctxFront.fillStyle = '#FF0000';
      }

      //Draw all objects.
      for(index = 0, obj; obj = objList[index]; index++) {
        mediator.publish('g:drawObject', obj, ctxFront);
      }

      //Framerate
      frameCount++;
      ctxFront.fillText('Framerate: '+ Math.round(frameCount / (stpFrame.elapsedMilliseconds / 1000))
          +'    Time:'+(stpFrame.elapsedMilliseconds / 1000), 5, 10);

      //Display current score.
      ctxFront.fillText('Score: '+ score, 5, cY - 25);

      //Request the next animation frame or end the game.
//      if(objList.length === 0) {
      if(user.dead) {
        endGame();
      } else {
        window.requestAnimationFrame(gameTick);
      }
    }

    /*****************************************************************************/
    function stillLoading() {
      if(loadQueue < 1) {
        var txtWidth;

        ctxFront.save();
        ctxFront.font = 'bold 30px sans-serif';
        txtWidth = ctxFront.measureText('LOADING...').width;
        ctxFront.fillText('LOADING...', cX / 2 - txtWidth / 2, cY / 2);
        ctxFront.restore();
        console.log('loadQueue', loadQueue);
        return true;
      }

      return false;
    }

    function clearText() {
      ctxFront.clearRect(0, 0, 250, 20);              //top left diag text
      ctxFront.clearRect(0, cY - 35, 150, 20);          //score
    }

    function endGame() {
      console.log('Ending game loop.');
      //stop the game clock.
      stpFrame.stop();

      //Remove canvas event listeners
      $(cvsFront).off('mousedown', mDown)
                 .off('mouseup', mUp4Path);

      //Scoring update
      hiScore = (score > hiScore) ? score : hiScore;

      //broadcast level end message
      mediator.publish('sys:levelEnd');
      levelEnd();       //inter level transition screen
    }
/*****************************************************************************/


    /** Display the home splash screen and such.
     */
    function home() {
      var $btnStart = $('#btnStart'),
          $btnScore = $('#btnScore');

      //clear objlist
      objList.length = 0;

      //Create nav buttons if they don't already exist.
      if(!$btnStart.length) {
        $btnStart = $( tmplStartBtn({id: 'btnStart', text: 'START'}) );
        $('body').append($btnStart);
      }
      if(!$btnScore.length) {
        $btnScore = $( tmplStartBtn({id: 'btnScore', text: 'SCORE'}) );
        $('body').append($btnScore);
      }

      //Show buttons
      $btnStart.show();
      $btnScore.show();

      //Hide the high score list.
      if($('#scoreTable').length) $('#scoreTable').hide();

      //Title
      cvsFront.width = cvsFront.width;
      cvsBg.width = cvsBg.width;
      ctxFront.font = 'bold 50px Courier';
      ctxFront.fillStyle = 'rgb(163, 188, 227)';
      ctxFront.fillText('Flappy Times Ahoy!', 250, 40);

      //Display buttons
      $btnStart.css({
          'position' : 'absolute',
          'top' : $(cvsFront).height() * .75 + 'px',
          'left' : $(cvsFront).width() *.33 + 'px',
          'z-index' : '3'
      });
      $btnScore.css({
          'position' : 'absolute',
          'top' : $btnStart.css('top'),
          'left' : $(cvsFront).width() *.33 + 100 + 'px',
          'z-index' : '3'
      });

      //Add some event handlers
      $btnStart.one('click', startClick);
      $btnScore.one('click', scoreClick);
    }


    /** Loads the level specified by the [String] uri
     * @param {String} url
     */
      function loadLevel(url) {
        //Open synchronous GET request.
        console.log('loadlevel url: ' + url);
        syncGetJson(url, function (result) {
            //Initialize background image.
            bg.src = '';
            bg.src = result.bg;
            //Set the background image's load event to draw it on the canvas.
            console.log('cX', cX);
            $(bg).one('load', drawBg);
        });
      }


    /** Callback function to draw an image to the background canvas on image
     *  load.
     */
    function drawBg() {
//      console.log('g:drawBg', this, ctxBg, cX, cY);
      mediator.publish('g:drawBg', this, ctxBg, cX, cY);
    }


    /** Loads the scores list specified by the [String] url.
     * @param {String} url
     */
    function loadScores(url) {
      var table,
          render = tmplScore({scores: [
                                       { "name": "Last", "score": score },
                                       { "name": "Best", "score": hiScore }
                                     ]
                                 });

      table = $('#scoreTable');

      //Create the table if it doesnt exist.
      if(!table.length) {
        table = $(render);
        //Add table to doc
        $('body').append(table);
      } else {
        table.html(render);
//        table.html( tmplScore({scores: [
//                                        { "name": "Last", "score": score },
//                                        { "name": "Best", "score": hiScore }
//                                        ]
//        }) );
      }

      //TODO: just give it a canvas sized div and center the darn thing
      table.css({
        'position' : 'absolute',
        'top' : $(cvsFront).height() * .35 + 'px',
        'left' : $(cvsFront).width() *.25 + 'px',
        'z-index' : '2'
      });

      table.show();
    }

    /** Submit a score to the server at location specified by {String} url
     * @param {String} url
     */
    function sendScore(url) {
      //Get user info?

      //Send POST request to server.
      $.post(url, {score : score, date : date}, function(data) {
        //Display result dialog.
        //alert('Server response: ' + data.response);
        $('#dialog-modal').text(data.response);
        $('#dialog-modal').dialog('open');
      }, 'JSON');
    }


    /** Inter-level transition screen. Re-uses home screen nav buttons */
    function levelEnd() {
      var btnHome = $('#btnStart'),
          btnNext = $('#btnScore');

      //Create nav buttons if they don't already exist.
      if(btnHome == null) {
        btnHome = $('<button id="btnHome"></button>');
        $('body').append(btnHome);
      }
      if(btnNext == null) {
        btnNext = $('<button id="btnNext"></button>');
        $('body').append(btnNext);
      }

      //Show buttons
      btnHome.show();
      btnHome.text('HOME');

//      btnNext.show();
//      btnNext.text('NEXT LEVEL');

      //Display buttons
      btnHome.css({
          'position' : 'absolute',
          'top' : $(cvsFront).height() * .75 + 'px',
          'left' : $(cvsFront).width() *.33 + 'px',
          'z-index' : '3'
      });
//      btnNext.css({
//          'position' : 'absolute',
//          'top' : btnHome.css('top'),
//          'left' : $(cvsFront).width() * .33 + 100 + 'px',
//          'z-index' : '3'
//      });
      loadScores();

      //New event handlers
      btnHome.one('click', homeClick);
//      btnNext.one('click', nextClick);
    }


    /** Canvas4 mouseDown event handler. Gives user vertical velocity */
    function mDown(ev) {
//      var click = new Coord({x : ev.offsetX, y : ev.offsetY});

      user.vy = -10;
//      console.log('user.vy', user.vy);

      //Toggle click n drag flag.
      drag = true;
    }


    /** Canvas 4 mouseUp event handler for path drawing. */
    function mUp4Path(ev) {
      //Toggle click n drag flag.
      drag = false;
    }


    /** Start button event */
    function startClick(ev) {
      console.log('startClick');
      var btnStart = $('#btnStart'),
          btnScore = $('#btnScore');

      //hide buttons.
      btnStart.hide();
      btnScore.hide();

      //Load level
      curLevel = 0;
      loadLevel(levels[curLevel]);

      //Remove event handler so we don't end up with multiples.
      //btnStart.off('click', startClick);
      btnScore.off('click', scoreClick);

      //Start the game!
      run();
    }


    /** Score button event */
    function scoreClick(ev) {
      console.log('scoreClick');
      var btnHome = $('#btnStart'),
          btnScore = $('#btnScore');

      //Adjust nav buttons
      btnScore.hide();
      btnHome.text('HOME');

      //Adjust event handlers.
  //    btnScore.on.click.remove(scoreClickHandler);
  //    btnScore.off('click', scoreClick);
      btnHome.off('click', startClick);
      btnHome.one('click', homeClick);

      //Show the score table
      loadScores('json/scores.json');
    }


    /** Home button event */
    function homeClick(ev) {
      console.log('homeClick');
      var btnHome = $('#btnStart'),
          btnNext = $('#btnScore');

      btnHome.text('START');
      btnNext.text('SCORES');

      //Remove event handler so we don't end up with multiples.
  //    btnHome.off('click', homeClick);
      btnNext.off('click', nextClick);

      //
      home();
    }

    /** Next level button event */
    function nextClick(ev) {
      console.log('nextClick');
      var btnHome = $('#btnStart'),
          btnNext = $('#btnScore');

      if(curLevel < levels.length-1) {    //More levels!
        //Remove event handler(s).
  //      btnNext.off('click', nextClick);
        btnHome.off('click', homeClick);

        //hide buttons.
        btnHome.hide();
        btnNext.hide();

        //Load the next level
        loadLevel(levels[++curLevel]);

        //Start the game!
        run();
      } else {    //No mas.
      //Load the next level
        loadLevel(levels[curLevel]);

        //Start the game!
        run();
      }
    }


    /** Add a new pipe, optionally specifying type and location
     * @param {int} type
     * @param {Coord} pos
     * @param {Number} heading
     */
    function addPipe(type, pos, heading) {
      var open = getRandomInt(60, cY - 60);
      if(type == null) {
        type = 0;
      }

      pos || (pos = new Coord({x: cX, y: open}));

      if(heading == null) {
        heading = 2 * Math.PI;
      }

      try {
//        console.log(mediator);
        var pipe = new Pipe(pos, imgSprites[type].img, imgSprites[type].alpha,
            imgSprites[type].frameWidth, imgSprites[type].frameHeight,
            {mediator: mediator});

        console.log(pipe.animations.def);
      } catch(e) {
        console.log(imgSprites);
        console.log(e);
        console.log(e.stack);
        return;
      }

      //Alter plane heading/velocity/etc.
      pipe.setScale(1);

      //Add to object list.
      objList.push(pipe);
    }


    /** Initialize sprites
     */
    function loadSprites() {
      //Open synchronous GET request.
      syncGetJson('json/sprites.json', function (result) {
        //Initialize plane list.
        for(var index = 0, sprite; sprite = result.sprites[index]; index++) {
          console.log('Adding sprite', sprite);

          imgSprites.push({
            img : loadImage(sprite.img),
            alpha : loadImage(sprite.alpha),
            frameWidth : sprite.frameWidth,
            frameHeight : sprite.frameHeight
          });
        }
      });
    }


    /** Collision detection
     * @param {Number} index  Objectlist index.
     * @param {Plane} obj   Plane referenced by index.
     * @returns {Boolean} True if collision detected.
     */
    function collisionDetection(index, obj) {
      if(obj instanceof Pipe) {
//        console.log("obj is a Pipe!");
        if(obj.x + obj.width/2 <= 5) {  //Pipe is off screen.
          //Increment score.
          mediator.publish('score:pipe');
          score++;

          //kill pipe
          obj.die();

          //add new pipe
          addPipe();

          return true;
        }
      }


      //Player Collision detection
      var userHalf = user.width/2;
          userHalfY = user.height/2;

      if(user.y + userHalf >= cY) {
        //Hit the floor.
        user.die();
      }

      for(var i = index+1; i < objList.length; i++) {
        if((objList[i].x - objList[i].width/2) > (user.x + userHalf)) {
          //player hasnt reached any pipes
          break;
        }

        if(user.y + userHalfY > objList[i].y + objList[i].gap ||
           user.y - userHalfY < objList[i].y - objList[i].gap) {
          //Collision! oh noes!

          //Start crash sequences
          obj.die();
          objList[i].die();

          return true;
        }
      }

      return false;
    }


    /**
     * @param {String}
     * @returns {Image}
     */
    function loadImage(src) {
      var imgTmp = new Image();

      loadQueue--;
      $(imgTmp).one('load', resourceLoad);
      imgTmp.src = src;

      return imgTmp;
    }


    /** Increments the resource loaded counter so we know everything is ready. */
    function resourceLoad() {
      loadQueue++;
      console.log('Resource loaded:', this, 'complete: ', this.complete);
    }


    function syncGetJson(url, callback) {
      $.ajax(url, {
        async : false,
        dataType : 'json',
        success : callback
      });
    }


    function aSyncGetJson(url, callback) {

    }



    return {
      home : home
    };
  }

  return Engine;
});
