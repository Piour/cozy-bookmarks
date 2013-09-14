americano = require 'americano-cozy'

module.exports =
    bookmark:
        all: (doc) -> emit Date.parse(doc.created), doc