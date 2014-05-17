var Box2D = require("./Box2D").Box2D;

/*--------------------------------------------------------*/


/*--------------------------------------------------------*/
var Game = function(){
  var world = new b2World(new b2Vec2(0, 9.8), true);

  var groundShape = createShapeBox(1, 1);
  var groundFixtureDef = createFixtureDef(0., 0.8, 0.1, groundShape);
  var groundBodyDef = createStaticBodyDef(1, 2);
  var groundBody = world.CreateBody(groundBodyDef);
  groundBody.CreateFixture(groundFixtureDef);

  this.world = world;
  
  this.setFps(60);
  this.timer_id = -1;

  this.stones = [];
  this.stones_id_counter = 0;

  setInterval(function(){
  }, 1000);
};

Game.getStonesShapeInfo = function(){
  var i, stone, p, vs;
  var dest = [];
  for(i=0; i<this.stones.length; i++){
    stone = this.stones[i].stone;
    p = {};
    p.id = stone.id;
    p.vs = stone.vs;
    p.color = stones.color;
    dest.push(p);
  }
  return dest;
};

Game.getStonesPosInfo = function(){
  var i, body, p, pos, vs, x, y;
  var dest = [];
  for(i=0; i<this.stones.length; i++){
    body = this.stones[i].body;
    p = {};
    pos = body.GetPosition();
    p.id = 
    p.x = pos.x;
    p.y = pos.y;
    p.a = pos.GetAngle();
  }
};

Game.addStone = function(stone, x, y){
  var bodyDef = createDynamicBodyDef(x, y);
  var body = this.world.CreateBody(bodyDef);

  //var shape = createShapeFromVs(stone.vs);
  var shape = createShapeFromVs();
  var fixtureDef = createFixtureDef(stone.density, stone.filter, stone.friction, shape)

  body.CreateFixture(stone.fixtureDef);
  this.stones.push({
    stone: stone,
    body: body,
    id: this.stones_id_counter++
  });
};

Game.prototype.setFps = function(fps){
  this.fps = fps;
  this.time_step = 1./fps;
}

Game.prototype.start = function(){
  this.timer_id = setInterval(this.step.bind(this), 1000/this.fps);
};

Game.prototype.stop = function(){
  clearInterval(this.timer_id);
  this.timer_id = -1;
};

Game.prototype.step = function(){
  this.world.Step(this.time_step, 10, 10);
};

Game.prototype.throwStone = function(x, y, vx, vy){
};

exports.Game = Game;

/*--------------------------------------------------------*/

var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2World = Box2D.Dynamics.b2World;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2Body = Box2D.Dynamics.b2Body;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;

var b2Vec2Zero = new b2Vec2(0, 0);

var createFixtureDef = function(density, friction, restitution, shape){
  var fixtureDef = new b2FixtureDef();
  fixtureDef.density = density;
  fixtureDef.friction = friction;
  fixtureDef.restitution = restitution;
  fixtureDef.shape = shape;
  return fixtureDef;
};

var createShapeBox = function(width, height, center, angle){
  center = center || b2Vec2Zero;
  angle = angle || 0;
  var polygonShape = new b2PolygonShape();
  polygonShape.SetAsOrientedBox(width, height, center, angle);
  return polygonShape;
};


var createShapeFromVs = function(vs){
  var polygonShape = new b2PolygonShape();
  polygonShape.SetAsArray(vs, vs.length);
  return polygonShape;
  /*
  var vs = [];
  for(i=0; i<STONE_VS; i++){
    rad = Math.PI*2/STONE_VS * i;
    x = (Math.cos(rad)*(Math.random()*0.5+0.5))*scale;
    y = (Math.sin(rad)*(Math.random()*0.5+0.5))*scale;
    vs.push(new b2Vec2(x, y*0.4));
  }
  */
};

var createDynamicBodyDef = function(x, y){
  var bodyDef = new b2BodyDef();
  bodyDef.position.Set(x, y);
  bodyDef.type = b2Body.b2_dynamicBody;
  return bodyDef;
};

var createStaticBodyDef = function(x, y){
  var bodyDef = new b2BodyDef();
  bodyDef.position.Set(x, y);
  bodyDef.type = b2Body.b2_staticBody;
  return bodyDef;
};
