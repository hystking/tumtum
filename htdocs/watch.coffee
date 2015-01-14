watch = require 'watch'
browserify = require 'browserify'
fs = require 'fs'

watch.watchTree './js', (f) ->
  browserify './js/app.js'
    .transform {}, 'coffeeify'
    .bundle()
    .pipe fs.createWriteStream './js/main.js'
    .on 'error', (e) ->
      console.log e
