var Stone = require("./Stone").Stone;

var Player = function(){
  this.stone = null;
};

Player.prototype.pickupStone = function(){
  this.stone = new Stone(0.1);
};
Player.prototype.popStone = function(){
  var stone = this.stone;
  this.stone = null;
  return stone;
};

exports.Player = Player;
