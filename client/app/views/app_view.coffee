View = require '../lib/view'
AppRouter = require '../routers/app_router'
BookmarksView = require './bookmarks_view'
Bookmark = require '../models/bookmark'

module.exports = class AppView extends View
    el: 'body.application'

    events:
        'click .create-button': 'onCreateClicked'

    template: ->
        require './templates/home'

    initialize: ->
        @router = CozyApp.Routers.AppRouter = new AppRouter()

    afterRender: ->
        $(".url-field").focus()
        $(".icon-more").click(->
            $(".description-field").toggle()
            if $(".icon-more").length > 0
                $(".icon-more").addClass("icon-less")
                $(".icon-more").removeClass("icon-more")
            else
                $(".icon-less").addClass("icon-more")
                $(".icon-less").removeClass("icon-less")
        )

        @bookmarksView = new BookmarksView()

        @bookmarksView.$el.html '<em>loading...</em>'
        @bookmarksView.collection.fetch
            success: =>
                @bookmarksView.$el.find('em').remove()
                window.sortOptions = {
                    "valueNames": ["title", "url", "tags", "description"] }
                window.featureList = new List("bookmark-list",
                                              window.sortOptions)

    onCreateClicked: (event) =>
        url = $('.url-field').val()
        title = $('.title-field').val()
        tags = $('.tags-field').val().split(',').map (tag) -> $.trim(tag)
        description = $('.description-field').val()

        if title?.length == 0
            title = url
        if title?.length > 0 and url?.length > 0
            bookObj =
                title: title
                url: url
                tags: tags
                description: description
            bookmark = new Bookmark bookObj
            @bookmarksView.collection.create bookmark,
                success: =>
                error: => alert "Server error occured, bookmark was not saved"
        else
            alert 'Url field is required'
        false
