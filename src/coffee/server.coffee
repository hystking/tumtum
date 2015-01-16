Game = (require './Game.js').Game
Stone = (require './Stone.js').Stone
EventEmitter = (require 'events').EventEmitter

SCALE = 300

class Server extends EventEmitter
  constructor: ->
    @game = new Game()
    @game.start()

    ###
    setInterval =>
      data = @game.getStonesPosData true
      #@emit 'stoneData', @game.getStonesData()
      #@emit 'posData', data
    , 100
    ###
    setInterval =>
      @emit 'tick',
        posData: @game.getStonesPosData true
        stoneData: @game.getStonesData()
    , 1000/60


  addStone: (x, y) ->
    console.log 'add'
    stone = new Stone .1
    @game.addStone stone, x/SCALE, y/SCALE, 0, 0

module.exports = Server
