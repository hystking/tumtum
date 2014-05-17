$(document).ready(function(){
  var socket = getSocket();
  var world = $("#world");
  var box_size = 200;
  window.socket = socket;
  socket.on("push", function(data){
    console.log(data);
    var img_url = data.url;
    var $img = $("<img/>");
    $img.on("load", function(){
      $this = $(this);
      var real_width = this.width;
      var real_height = this.height;

      var width = box_size;
      var height = box_size;

      if(real_width > real_height){
        width = box_size;
        height = real_height * box_size/real_width;
      }else{
        width = real_width * box_size/real_height;
        height = box_size;
      }

      world.append($this);
      $this.css({
        left: world.prop("clientWidth")/2-width/2+(Math.random()-0.5)*box_size+"px",
        width: width+"px",
        height: height+"px"
      });

      setTimeout(function(){
        $this.box2d({'y-velocity':20});

        var t_mousedown = -1;
        $this.on("mousedown", function(){
          t_mousedown = +new Date;
        });
        $this.on("mouseup", function(){
          if(+new Date - t_mousedown < 250){
            window.open(img_url);
          }
        });
      },1);
    });
    $img.attr({"src": img_url});
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
