Game = (require './Game.js').Game
Stone = (require './Stone.js').Stone
EventEmitter = (require 'events').EventEmitter

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

    setInterval (=> @addStone()), 1000

  addStone: ->
    console.log 'add'
    stone = new Stone .1
    @game.addStone stone, 100/300, 100/300, 0, 0

module.exports = Server
