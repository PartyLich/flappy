  /** StopWatch object constructor
   *
   */
  function StopWatch() {
//    this.elapsedMilliseconds = 0;
//    this.startTime = Date.now();
    this.reset();
    //    this.start();
    this.running = false;
  }

  /**
   *
   */
  StopWatch.prototype.start = function start() {
    this.running = true;
  };


  /**
   *
   */
  StopWatch.prototype.stop = function stop() {
    this.running = false;
  };


  /**
   *
   */
  StopWatch.prototype.reset = function reset() {
    this.startTime = Date.now();
    this.elapsedMilliseconds = 0;
  };


  /**
   *
   */
  StopWatch.prototype.update = function update() {
    if(this.running) {
      this.elapsedMilliseconds = Date.now() - this.startTime;
    }

    return this.running;
  };

export default StopWatch;
