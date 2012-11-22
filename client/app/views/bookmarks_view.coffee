ViewCollection = require '../lib/view_collection'
BookmarkView  = require './bookmark_view'
BookmarkCollection = require '../collections/bookmark_collection'

module.exports = class BookmarksView extends ViewCollection
    el: '#bookmark-list .list'

    view: BookmarkView

    renderOne: (model) =>
        view = new @view model
        @$el.prepend view.render().el
        @add view
        if window.featureList
            sortObj = { "el": view.el, "values": window.sortOptions.valueNames }
            window.featureList.add(sortObj)
        @

    initialize: ->
        @collection = new BookmarkCollection @
