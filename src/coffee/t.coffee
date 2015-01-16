_ = require "lodash"
param = require "global-param"
StoneInput = require "./stone-input"

stoneInput = new StoneInput 10000

stoneInput.on "input", _.throttle (e) ->
  console.log e.level
, 400, trailing: false
