View = require '../lib/view'

module.exports = class BookmarkView extends View
    className: 'bookmark'
    tagName: 'li'

    events:
        'click .delete-button': 'onDeleteClicked'

    constructor: (@model) ->
        super()
    
    template: ->
        template = require './templates/bookmark'
        template @getRenderData()

    onDeleteClicked: ->
        console.log("clicked")
        @$('.delete-button').html "deleting..."
        @model.destroy
            success: =>
                @destroy()
            error: =>
                alert "Server error occured, bookmark was not deleted."
                @$('.delete-button').html "delete"
