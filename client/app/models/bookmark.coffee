module.exports = class Bookmark extends Backbone.Model

    urlRoot: 'bookmarks'

    isNew: () ->
        not @id?
