var Game = require("./Game").Game;

var Room = function(io, name_room){
  this._room = io.of("/"+name_room);
  this._sockets = [];
  this._users = 0;
  this._io = io;
  this._game = new Game();
  /*
  setInterval((function(){
    console.log(name_room+"'s users:", this._users);
    console.log(this._game.ground.GetPosition());
    var i;
    for(i=0; i<this._game.testboxes.length; i++){
      console.log(this._game.testboxes[i].GetPosition());
    }
  }).bind(this), 100);
  */
  this._room.on("connection", this._onConnection.bind(this));
  this._game.start();
  console.log("aaaaaaaaaaaa");
};

Room.prototype._onConnection = function(socket){
  this._users++;
  this._sockets.push(socket);
  socket.on("echo", this._onEcho.bind(this));
  socket.on("close", this._onClose.bind(this));
  socket.on("disconnect", this._onDisconnect.bind(this));
  console.log("connected");
};

Room.prototype._onEcho = function(data){
  this._room.emit("echo", data);
};

Room.prototype._onClose = function(){
  this._users = -1;
  this._room.emit("close", data);
};

Room.prototype._onDisconnect = function(){
  this._users--;
};

exports.Room = Room;
