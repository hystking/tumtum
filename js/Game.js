var Box2D = require("./Box2D").Box2D;
var Stone = require("./Stone").Stone;

/*--------------------------------------------------------*/

SCALE = 300;

/*--------------------------------------------------------*/
var Game = function(){
  /*
  var worldAABB = new b2AABB();
  worldAABB.lowerBound.Set(-100, -100);
  worldAABB.upperBound.Set(100, 100);

  console.log(worldAABB);
  */

  var world = new b2World(new b2Vec2(0, 9.8), true);

  var groundShape = createShapeBox(0.2, 1.1);
  var groundFixtureDef = createFixtureDef(0, 1., 0, groundShape);

  var addGround = function(x){
    var groundBodyDef = createStaticBodyDef(x, 3);
    var groundBody = world.CreateBody(groundBodyDef);
    groundBody.CreateFixture(groundFixtureDef);
  };
  addGround(0.4);
  addGround(1.2);
  addGround(2.0);
  addGround(2.8);
  addGround(3.6);
  addGround(4.4);
  addGround(5.2);
  this.world = world;
  this.setFps(60);
  this.timer_id = -1;
  this.stones = [];
  this.stones_id_counter = 0;

  setInterval(function(){
    this.removeFallenStones();
  }.bind(this), 3000);
};

StoneData = function(stone, body, id){
  var i, p;
  this.stone = stone;
  this.body = body;
  this.id = id;
  this.px = -1;
  this.py = -1;
  this.pa = -1;

  this.scaled_vs = [];
  for(i=0; i<stone.vs.length; i++){
    p = {};
    p.x = stone.vs[i].x * SCALE | 0;
    p.y = stone.vs[i].y * SCALE | 0;
    this.scaled_vs.push(p);
  }
};
StoneData.prototype.getData = function(){
  var p = {};
  p.vs = this.scaled_vs;
  p.color = this.stone.color;
  return p;
};

StoneData.prototype.getPosData = function(force){
  var pos, a, v, p;
  var body = this.body;
  if(!force && !body.IsAwake()) return null;
  pos = body.GetPosition();
  a = body.GetAngle();
  p = {};
  p.x = pos.x*SCALE|0;
  p.y = pos.y*SCALE|0;
  p.a = (a*100|0)/100;
  if(
    !force &&
    Math.abs(this.px - p.x) < 1 &&
    Math.abs(this.py - p.y) < 1 &&
    Math.abs(this.pa - a) < .01
    ) return null;
  v = body.GetLinearVelocity();
  p.vx = v.x*SCALE|0;
  p.vy = v.y*SCALE|0;
  
  //update
  this.px = p.x;
  this.py = p.y;
  this.pa = p.a;

  return p;
};

Game.prototype.removeFallenStones = function(){
  var i;
  for(i=0; i<this.stones.length; i++){
    var pos = this.stones[i].body.GetPosition();
    if(pos.y > 6){
      this.removeStone(i);
      i--;
    }
  }
};

Game.prototype.getStonesData = function(){
  var i, stone, p;
  var dest = {};
  for(i=0; i<this.stones.length; i++){
    stone = this.stones[i];
    p = stone.getData();
    p.pos = stone.getPosData(true);
    dest[stone.id] = p;
  }
  return dest;
};

Game.prototype.getStonesPosData = function(){
  var i, p;
  var dest = {};
  for(i=0; i<this.stones.length; i++){
    stone = this.stones[i];
    p = stone.getPosData(false);
    if(p) dest[stone.id] = p;
  }
  return dest;
};

Game.prototype.addStone = function(stone, x, y, vx, vy){
  var bodyDef = createDynamicBodyDef(x, y);
  var body = this.world.CreateBody(bodyDef);
  var shape = createShapeFromVs(stone.vs);
  var fixtureDef = createFixtureDef(stone.density, stone.filter, stone.friction, shape)
  body.CreateFixture(fixtureDef);
  body.SetLinearVelocity(new b2Vec2(vx, vy));
  var stoneData = new StoneData(stone, body, this.stones_id_counter++)
  this.stones.push(stoneData);
  return stoneData;
};

Game.prototype.removeStone = function(i){
  var body = this.stones[i].body;
  this.world.DestroyBody(body);
  this.stones.splice(i, 1);
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
  this.world.Step(this.time_step, 30, 30);
};

exports.Game = Game;

/*--------------------------------------------------------*/

var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2World = Box2D.Dynamics.b2World;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2Body = Box2D.Dynamics.b2Body;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2AABB = Box2D.Collision.b2AABB;

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
