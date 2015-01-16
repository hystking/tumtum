_ = require "lodash"
EventEmitter = (require "events").EventEmitter

class StoneInput extends EventEmitter
  constructor: (threshold) ->
    MediaStreamTrack.getSources (infos) =>
      console.log infos
      console.log infos[2].id
      navigator.webkitGetUserMedia {
        audio:
          optional: [
            sourceId: infos[2].id
          ]
      }, (stream) =>
        ctx = new webkitAudioContext()

        analyser = ctx.createAnalyser()
        microphone = ctx.createMediaStreamSource stream

        microphone.connect analyser
        analyser.connect ctx.destination
        
        console.log analyser

        bufferLength = analyser.frequencyBinCount
        setInterval =>
          freqData = new Uint8Array bufferLength
          analyser.getByteFrequencyData freqData
          level = _.reduce freqData, ((a, b) -> a + b), 0
          if level > threshold
            @emit "input", level: level
        , 10
      , ->
        console.log "error on getUserMedia"

module.exports = StoneInput
