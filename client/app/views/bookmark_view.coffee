View = require '../lib/view'

module.exports = class BookmarkView extends View
    className: 'bookmark'
    tagName: 'li'

    events:
        'click .icon-delete': 'onDeleteClicked'

    constructor: (@model) ->
        super()
    
    template: ->
        template = require './templates/bookmark'
        template @getRenderData()

    onDeleteClicked: ->
        console.log("clicked")
        @model.destroy
            success: =>
                @destroy()
            error: =>
                alert "Server error occured, bookmark was not deleted."
                @$('.delete-button').html "delete"
