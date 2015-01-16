_ = require "lodash"
Server = require("./server.coffee")
StoneInput = require "./stone-input"

SHIFT_X = 0
SHIFT_Y = 100
SCALE2 = 1
SCALE = 300 *SCALE2




$(document).ready ->
  socket = new Server()
  stoneInput = new StoneInput 10000
  $canvas = $("canvas")
  canvas = $canvas[0]
  localGame = new LocalGame(canvas.getContext("2d"))
  window.socket = socket
  window.lg = localGame

  onResize = (e) ->
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  window.addEventListener "resize", onResize
  onResize()
  socket.on "stoneData", (data) ->
    localGame.setStoneData data
    return

  socket.on "stoneDataAdd", (data) ->
    localGame.setStoneData data, true
    return

  socket.on "posData", (data) ->
    console.log data
    return

  socket.on "tick", (data) ->
    localGame.setStoneData data.stoneData
    localGame.setPosData data.posData
    localGame.step()
    localGame.draw()
    return
  
  stoneInput.on "input", _.throttle (e) ->
    console.log e.level
    socket.addStone 1.2*SCALE, -100
  , 400, trailing: false

  $canvas.click (e) ->
    console.log e.pageX, e.pageY
    socket.emit "addStone",
      x: e.pageX
      y: e.pageY

    return

  return

getSocket = ->
  socket_url = window.location.href
  prc = socket_url.split("://")
  split_by_slash = prc[1].split("/")
  socket_url = prc[0] + "://" + split_by_slash[0] + "/lobby"  unless split_by_slash[1]
  console.log socket_url
  socket = io.connect(socket_url)
  socket

LocalGame = (ctx) ->
  @width = ctx.width
  @height = ctx.height
  @pos_data_local = {}
  @pos_data = {}
  @stone_data = {}
  @gradBack = ctx.createLinearGradient(0, 0, 0, 1000)
  @gradBack.addColorStop 0, "#fff"
  @gradBack.addColorStop 1, "#bcd"
  
  @gradGround = ctx.createLinearGradient(0, SHIFT_Y, 0, 600+SHIFT_Y)
  @gradGround.addColorStop .85, "#fff"
  @gradGround.addColorStop 1, "rgba(255, 255, 255, 0)"
  
  ctx.lineCap = "round"
  ctx.lineWidth = 3
  @ctx = ctx
  return

LocalGame::step = ->
  pos_data = @pos_data
  pos_data_local = @pos_data_local
  for i of pos_data
    pos_local = pos_data_local[i]
    continue  unless pos_local
    pos = pos_data[i]
    pos_local.x += (pos.x - pos_local.x) * 1 #.1;
    pos_local.y += (pos.y - pos_local.y) * 1 #.22;
    pos_local.a += (pos.a - pos_local.a) * 1 #.1;
    
    #pos.x += pos.vx/10;
    #pos.y += pos.vy/10;
    pos.vx *= 0.8
    pos.vy *= 0.8
  return

LocalGame::draw = ->
  pos_body = undefined
  pos_v = undefined
  rad = undefined
  stone = undefined
  vs = undefined
  i = undefined
  x0 = undefined
  y0 = undefined
  x = undefined
  y = undefined
  pos_data_local = @pos_data_local
  stone_data = @stone_data
  ctx = @ctx

  ctx.strokeStyle = "gray"
  ctx.fillStyle = @gradBack
  ctx.fillRect 0, 0, ctx.canvas.width, ctx.canvas.height
  
  ctx.fillStyle = @gradGround
  i = 0
  ctx.beginPath()
  ctx.arc 1.2*SCALE+SHIFT_X, 1560+SHIFT_Y, 1000, 50, 0, Math.PI * 2
  ctx.fill()
  
  ctx.lineWidth = 3
  for i of stone_data
    pos_body = pos_data_local[i]
    continue  unless pos_body
    rad = pos_body.a
    stone = stone_data[i]
    ctx.fillStyle = stone.color
    vs = stone.vs
    pos_v = vs[0]
    x0 = pos_v.x * Math.cos(rad) - pos_v.y * Math.sin(rad) + pos_body.x
    y0 = pos_v.x * Math.sin(rad) + pos_v.y * Math.cos(rad) + pos_body.y
    ctx.beginPath()
    ctx.moveTo x0+SHIFT_X, y0+SHIFT_Y
    j = 0

    while j < vs.length
      pos_v = vs[j]
      x = pos_v.x * Math.cos(rad) - pos_v.y * Math.sin(rad) + pos_body.x
      y = pos_v.x * Math.sin(rad) + pos_v.y * Math.cos(rad) + pos_body.y
      ctx.lineTo x+SHIFT_X, y+SHIFT_Y
      j++
    ctx.lineTo x0+SHIFT_X, y0+SHIFT_Y
    ctx.fill()
    ctx.stroke()

  ###
  t = +new Date() % 2000
  ctx.strokeStyle = "rgba(255,100,100," + (2000 - t) / 2000 + ")"
  ctx.beginPath()
  ctx.moveTo 0, 100
  ctx.lineTo 1680, 100
  ctx.stroke()
  ctx.strokeStyle = "gray"
  ###
  return

LocalGame::setPosData = (pos_data) ->
  @pos_data = pos_data
  return

LocalGame::setStoneData = (stone_data, add) ->
  pos_data = @pos_data
  pos_data_local = @pos_data_local
  i = undefined
  for i of stone_data
    @stone_data[i] = stone_data[i]
  unless add
    for i of pos_data_local
      delete pos_data_local[i]  unless stone_data[i]
  for i of stone_data
    stone = stone_data[i]
    pos_local = pos_data_local[i]
    if pos_local
      pos_data[i] =
        x: stone.pos.x
        y: stone.pos.y
        vx: stone.pos.vx
        vy: stone.pos.vy
        a: stone.pos.a
    else
      pos_data_local[i] =
        x: stone.pos.x
        y: stone.pos.y
        a: stone.pos.a
  return
