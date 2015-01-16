var STONE_VS = 6;

var Stone = function(scale){
  var i, rad, x, y;
  var vs = [];
  for(i=0; i<STONE_VS; i++){
    rad = Math.PI*2/STONE_VS * i;
    x = (Math.cos(rad)*(Math.random()*0.4+0.6))*scale;
    y = (Math.sin(rad)*(Math.random()*0.4+0.6))*scale;
    vs.push({x: x, y: y*0.4});
  }
  this.vs = vs;
  this.density = 1.;
  this.filter = .8;
  this.friction = 0;//-0.9;
  if(Math.random() < .2){
    this.color = "#"+(158+20+Math.random()*20-10|0).toString(16)+(165+20+Math.random()*20-10|0).toString(16)+(175+20+Math.random()*20-10|0).toString(16);
  }else{
    var val = Math.random()*10+246|0;
    this.color = "rgb("+val+","+val+","+val+")";
  }
};

exports.Stone = Stone;
