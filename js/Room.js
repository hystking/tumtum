var Game = require("./Game").Game;

var Player = require("./Player").Player;

var Room = function(io, name_room){
  this._room = io.of("/"+name_room);
  this._sockets = [];
  this._users = 0;
  this._io = io;
  this._game = new Game();
  this._room.on("connection", this._onConnection.bind(this));
  this._game.start();
  setInterval((function(){
    this._room.emit("stoneData", this._game.getStonesData());
  }).bind(this), 10000);
  setInterval((function(){
    data = this._game.getStonesPosData();
    if(Object.keys(data).length <= 0) return;
    this._room.emit("posData", data);
  }).bind(this), 200);
};

Room.prototype._onConnection = function(socket){
  this._users++;
  this._sockets.push(socket);

  self = {};
  self.room = this;
  self.socket = socket;
  self._player = new Player();
  self._player.pickupStone();

  socket.on("echo", this._onEcho.bind(self));
  socket.on("close", this._onClose.bind(self));
  socket.on("disconnect", this._onDisconnect.bind(self));
  socket.on("addStone", this._onAddStone.bind(self));
  console.log("connected");

  socket.emit("stoneData", this._game.getStonesData());
};

Room.prototype._onAddStone = function(data){
  var player = this._player;
  var stone = player.popStone();
  if(!stone) return;
  var sd = this.room._game.addStone(stone, data.x/300, data.y/300, 0, 0);

  var p = {};
  p[sd.id] = sd.getData();
  p[sd.id].pos = sd.getPosData()

  this.room._room.emit("stoneDataAdd", p);
  setTimeout(function(){
     player.pickupStone();
  }, 1000);
};

Room.prototype._onEcho = function(data){
  this.room._room.emit("echo", data);
};

Room.prototype._onClose = function(){
  this.room._users = -1;
  this.room._room.emit("close", data);
};

Room.prototype._onDisconnect = function(){
  this.room._users--;
};

exports.Room = Room;
