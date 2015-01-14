var Server = require('./server.coffee');

$(document).ready(function(){
  var socket = new Server();
  var $canvas = $("canvas");
  var localGame = new LocalGame($canvas[0].getContext("2d"));
  window.socket = socket;
  window.lg = localGame;
  socket.on("stoneData", function(data){
    localGame.setStoneData(data);
  });
  socket.on("stoneDataAdd", function(data){
    localGame.setStoneData(data, true);
  });
  socket.on("posData", function(data){
    console.log(data);
  });
  socket.on('tick', function(data){
    
    localGame.setStoneData(data.stoneData);
    localGame.setPosData(data.posData);
    localGame.step();
    localGame.draw();
  });
  setInterval(function(){
  }, 1000/30);
  $canvas.click(function(e){
    console.log(e.pageX, e.pageY);
    socket.emit("addStone", {x: e.pageX, y:e.pageY});
  });
});
var getSocket = function(){
  var socket_url = window.location.href;
  var prc = socket_url.split("://");
  var split_by_slash = prc[1].split("/");
  if(!split_by_slash[1]){
    socket_url = prc[0]+"://"+split_by_slash[0]+"/lobby";
  }
  console.log(socket_url);
	var socket = io.connect(socket_url);
  return socket;
};

var LocalGame = function(ctx){
  this.width = ctx.width;
  this.height = ctx.height;
  this.pos_data_local = {};
  this.pos_data = {};
  this.stone_data = {};

  this.gradBack = ctx.createLinearGradient(0, 0, 0, 600);
  this.gradBack.addColorStop(0, "#fff");
  this.gradBack.addColorStop(1, "#bcd");

  ctx.lineCap = "round";
  ctx.lineWidth = 3;
  this.ctx = ctx;
};
LocalGame.prototype.step = function(){
  var pos_data = this.pos_data;
  var pos_data_local = this.pos_data_local;

  for(var i in pos_data){
    pos_local = pos_data_local[i];
    if(!pos_local) continue;
    pos = pos_data[i];
    pos_local.x += (pos.x - pos_local.x) * 1;//.1;
    pos_local.y += (pos.y - pos_local.y) * 1;//.22;
    pos_local.a += (pos.a - pos_local.a) * 1;//.1;

    //pos.x += pos.vx/10;
    //pos.y += pos.vy/10;

    pos.vx *= 0.8;
    pos.vy *= 0.8;
  }
};
LocalGame.prototype.draw = function(){
  var pos_body, pos_v, rad, stone, vs, i, x0, y0, x, y;
  var pos_data_local = this.pos_data_local;
  var stone_data = this.stone_data;
  var ctx = this.ctx;

  ctx.strokeStyle = "gray";

  ctx.fillStyle = this.gradBack;
  ctx.fillRect(0, 0, 1680, 600);

  ctx.fillStyle = "#abc";
  for(i=0; i<7; i++){
    ctx.beginPath();
    ctx.arc(120+i*240, 620, 100, 50, 0, Math.PI*2);
    ctx.fill();
  }

  for(var i in stone_data){
    pos_body = pos_data_local[i];
    if(!pos_body) continue;
    rad = pos_body.a;
    stone = stone_data[i];

    ctx.fillStyle = stone.color;

    vs = stone.vs;
    pos_v = vs[0];
    x0 = pos_v.x * Math.cos(rad) - pos_v.y * Math.sin(rad) + pos_body.x;
    y0 = pos_v.x * Math.sin(rad) + pos_v.y * Math.cos(rad) + pos_body.y;

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    for(var j=0; j<vs.length; j++){
      pos_v = vs[j];
      x = pos_v.x * Math.cos(rad) - pos_v.y * Math.sin(rad) + pos_body.x;
      y = pos_v.x * Math.sin(rad) + pos_v.y * Math.cos(rad) + pos_body.y;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(x0, y0);
    ctx.fill();
    ctx.stroke();
  }

  var t = +new Date()%2000;
  ctx.strokeStyle = "rgba(255,100,100,"+(2000-t)/2000+")";
  ctx.beginPath();
  ctx.moveTo(0, 100);
  ctx.lineTo(1680, 100);
  ctx.stroke();
  ctx.strokeStyle = "gray";
};
LocalGame.prototype.setPosData = function(pos_data){
  this.pos_data = pos_data; 
};
LocalGame.prototype.setStoneData = function(stone_data, add){
  var pos_data = this.pos_data;
  var pos_data_local = this.pos_data_local;

  var i;
  for(i in stone_data){
    this.stone_data[i] = stone_data[i];
  }

  if(!add){
    for(i in pos_data_local){
      if(!stone_data[i]){
        delete pos_data_local[i];
      }
    }
  }
  for(i in stone_data){
    var stone = stone_data[i];
    var pos_local = pos_data_local[i];
    if(pos_local){
      pos_data[i] = {
        x: stone.pos.x,
        y: stone.pos.y,
        vx: stone.pos.vx,
        vy: stone.pos.vy,
        a: stone.pos.a
      }
    }else{
      pos_data_local[i] = {
        x: stone.pos.x,
        y: stone.pos.y,
        a: stone.pos.a
      };
    }
  }
};
