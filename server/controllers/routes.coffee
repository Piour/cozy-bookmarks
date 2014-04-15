bookmarks = require './bookmarks'

module.exports =
    'bookmarks':
        get: bookmarks.all
        post: bookmarks.create
    'bookmarks/:id':
        delete: bookmarks.destroy
    'export':
        get: bookmarks.export
