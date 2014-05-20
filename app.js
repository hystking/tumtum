var express = require("express")
var app = express();
var http = require("http");
var server = http.createServer(app);
var io = require("socket.io").listen(server, {"log level": 1});
var RoomManager = require("./js/RoomManager").RoomManager;

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
 });

var port = process.env.PORT || 5000;
server.listen(port);

var ptn = /^\/([a-zA-Z0-9_]+)$/;

app.get(ptn, function(req, res){
	var name_room = req.params[0];
	console.log("get room: ", name_room);
	var room = rm.getRoom(name_room);
  if(room){
	  res.sendfile("templates/room.html");
  }else{
    res.status(404);
  }
});

app.post(ptn, function(req, res){
	var name_room = req.params[0];
	var url = "/"+name_room;
  rm.createRoom(name_room);
  res.redirect(url);
});

app.use(express.static(__dirname + "/htdocs"));

var rm = new RoomManager(io, ptn);
rm.createRoom("lobby");
