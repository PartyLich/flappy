define(function () {
  function Action(json) {
    this.time = 0;  //When the even should happen, in seconds.
    this.planes = [];     //Plane type(s) that should be added.

    if(json) {
      Action.prototype.fromJson.call(this, json);
    }
  }

  Action.prototype.fromJson = function (json) {
    this.time = json['time'];
  //  this.planes = new List.from(json['planes']);
    this.planes = new Array().concat(json['planes']);
  ////this.planes.addAll(json['planes']);
  };

  //class Level {
  function Level() {
  //  String bg;
    this.bg = '';
  //  List<Coord> runways;
    this.runways = [];
  //  List<Action> events;
    this.events = [];
  }

  return Action;
});