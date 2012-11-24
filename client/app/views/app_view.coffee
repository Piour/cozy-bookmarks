View = require '../lib/view'
AppRouter = require '../routers/app_router'
BookmarksView = require './bookmarks_view'
Bookmark = require '../models/bookmark'

module.exports = class AppView extends View
    el: 'body.application'

    events:
        'click .icon-create': 'onCreateClicked'
        'click .icon-more': 'onMoreClicked'
        'click .icon-less': 'onMoreClicked'

    template: ->
        require './templates/home'

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

    onMoreClicked: (event) =>
        $(".description-field").toggle()
        if $(".icon-more").length > 0
            $(".icon-more").addClass("icon-less")
            $(".icon-more").removeClass("icon-more")
            $(".icon-less").attr("title", "less")
        else
            $(".icon-less").addClass("icon-more")
            $(".icon-less").removeClass("icon-less")
            $(".icon-more").attr("title", "more")
        false

    onCreateClicked: (event) =>
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
                    $("#create-bookmark-form").find("input, textarea").val("")
                error: => alert "Server error occured, bookmark was not saved"
        else
            alert 'Url field is required'
        false
