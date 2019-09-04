define(function () {
  class Animation {
  constructor(opts) {
    this.firstFrame = 0;  //
    this.length = 0;     //
    this.repeat = 0;
    this.fps = 0; 

    this.init(opts);
  }

  init(opt) {
    var key = null,
      default_args = {
        firstFrame : 0,
        length : 0,
        repeat : 0,
        fps : 60
      };

    opt = (opt || default_args);
    
    for(key in default_args) {
      if(typeof opt[key] == "undefined") opt[key] = default_args[key];
    }
    
    // opt[] has all the data - user provided and optional.
    for(key in opt) {
      //console.log(key + " = " + opt[key]);
      this[key] = opt[key];
    }
  }
  }

  return Animation;
});
