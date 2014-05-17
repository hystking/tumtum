var Box2D = require("./Box2D").Box2D;
var Stone = require("./Stone").Stone;

/*--------------------------------------------------------*/


/*--------------------------------------------------------*/
var Game = function(){
  /*
  var worldAABB = new b2AABB();
  worldAABB.lowerBound.Set(-100, -100);
  worldAABB.upperBound.Set(100, 100);

  console.log(worldAABB);
  */

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
    this.addStone(new Stone(0.2), 1, 0);
  }.bind(this), 1000);

  setInterval(function(){
    this.removeFallenStones();
  }.bind(this), 5000);
};

Game.prototype.removeFallenStones = function(){
  var i;
  for(i=0; i<this.stones.length; i++){
    var pos = this.stones[i].body.GetPosition();
    if(pos.y > 1){
      this.removeStone(i);
      i--;
    }
  }
};

Game.prototype.getStonesShapeInfo = function(){
  var i, stone, p, vs;
  var dest = [];
  for(i=0; i<this.stones.length; i++){
    p = {};
    stone = this.stones[i].stone;
    p.vs = stone.vs;
    p.color = stone.color;
    dest[this.stones[i].id] = p;
  }
  return dest;
};

Game.prototype.getStonesPosInfo = function(){
  var i, body, p, pos, vs, x, y;
  var dest = {};
  for(i=0; i<this.stones.length; i++){
    p = {};
    body = this.stones[i].body;
    pos = body.GetPosition();
    p.x = pos.x;
    p.y = pos.y;
    p.a = body.GetAngle();
    dest[this.stones[i].id] = p;
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
  this.stones.push({
    stone: stone,
    body: body,
    id: this.stones_id_counter++
  });
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
  this.world.Step(this.time_step, 10, 10);
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
