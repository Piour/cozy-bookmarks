View          = require "../lib/view"
AppRouter     = require "../routers/app_router"
BookmarksView = require "./bookmarks_view"
Bookmark      = require "../models/bookmark"

module.exports = class AppView extends View
    el: "body.application"

    events:
        "click form .create": "bookmarkLink"
        "click form .title": "toggleForm"
        "click form .clean": "cleanForm"

    template: ->
        require "./templates/home"

    initialize: ->
        @router = CozyApp.Routers.AppRouter = new AppRouter()

    afterRender: ->
        $(".url-field").focus()
        @bookmarksView = new BookmarksView()

        @bookmarksView.$el.html '<em>loading...</em>'
        @bookmarksView.collection.fetch
            success: =>
                @bookmarksView.$el.find('em').remove()
                window.sortOptions = {
                    "valueNames": ["title", "url", "tags", "description"] }
                window.featureList = new List("bookmark-list",
                                              window.sortOptions)
                alertify.log "bookmarks loaded"

    toggleForm: (evt) ->
        $container = $ "form div"
        $title     = $ evt.target
        $container.toggle "slow", () ->
            if $container.is ":visible"
                $title.attr "title", "click to hide the form"
            else
                $title.attr "title", "click to show the form"
        false

    cleanForm: (evt) ->
        $form = $ "form"
        $inputs = $form.find "input, textarea"
        $inputs.val ""
        false

    bookmarkLink: (evt) ->
        url   = $('.url-field').val()
        title = $('.title-field').val()
        tags  = $('.tags-field').val().split(',').map (tag) -> $.trim(tag)
        description = $('.description-field').val()

        if url?.length > 0
            bookObj =
                title: title
                url: url
                tags: tags
                description: description
            bookmark = new Bookmark bookObj
            @bookmarksView.collection.create bookmark,
                success: =>
                    @cleanForm()
                    alertify.log "" + (title || url) + " added"
                error: =>
                    alertify.alert "Server error occured, " +
                                   "bookmark was not saved"
        else
            alertify.alert "Url field is required"
        false
