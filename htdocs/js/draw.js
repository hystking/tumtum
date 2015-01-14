
var draw = function(){
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
