americano = require 'americano'

module.exports =
    bookmark:
        all: (doc) -> emit Date.parse(doc.created), doc