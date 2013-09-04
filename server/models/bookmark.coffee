americano = require 'americano-cozy'

module.exports = Bookmark = americano.getModel 'Bookmark',
    'title': type: String
    'url': type: String
    'tags': type: String
    'description': type: String
    'created': type: Date, default: Date

Bookmark.all = (params, callback) ->
    Bookmark.request "all", params, callback
