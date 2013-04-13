View = require "../lib/view"

module.exports = class BookmarkView extends View
    className: "bookmark"
    tagName: "li"

    events:
        "click .delete": "deleteBookmark"

    constructor: (@model) ->
        super()

    template: ->
        template = require "./templates/bookmark"
        template @getRenderData()

    cleanTags: () ->
        readableTags = ""
        for tag in @model.attributes.tags
            readableTags += tag + ", "
        readableTags = readableTags.slice(0, readableTags.length - 2)
        @model.attributes.readableTags = readableTags
 
    render: () ->
        @cleanTags()
        super()

    deleteBookmark: ->
        title = @$el.find(".title").html()
        $(".url-field").val(@$el.find(".title a").attr("href"))
        $(".title-field").val(@$el.find(".title a").text())
        $(".tags-field").val(@$el.find(".tags").text())
        $(".description-field").val(@$el.find(".description").text())
        @model.destroy
            success: =>
                @destroy()
                window.featureList.remove("title", title)
                alertify.log "" + title + " removed and placed in form"
            error: =>
                alertify.alert "Server error occured, bookmark was not deleted."
                @$('.delete-button').html "delete"
