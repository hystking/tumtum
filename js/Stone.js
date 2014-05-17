var STONE_VS = 6;

var Stone = function(scale){
  var i, rad, x, y;
  var vs = [];
  for(i=0; i<STONE_VS; i++){
    rad = Math.PI*2/STONE_VS * i;
    x = (Math.cos(rad)*(Math.random()*0.5+0.5))*scale;
    y = (Math.sin(rad)*(Math.random()*0.5+0.5))*scale;
    vs.push({x: x, y: y*0.4});
  }
  this.vs = vs;
  this.density = 0.5;
  this.filter = 0.5;
  this.friction = 0.5;
  this.color = "#cccccc";
};

exports.Stone = Stone;
