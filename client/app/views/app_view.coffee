View          = require "../lib/view"
AppRouter     = require "../routers/app_router"
BookmarksView = require "./bookmarks_view"
Bookmark      = require "../models/bookmark"

module.exports = class AppView extends View
    el: "body.application"

    events:
        "click form .create": "bookmarkLink"
        "keyup form .title input": "showForm"
        "click form .title input": "showForm"
        "click form .title": "toggleForm"
        "click form .clean": "cleanForm"
        "click .import": "import"
        "click .export": "export"
        "change #bookmarks-file": "uploadFile"

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

    showForm: (evt) ->
        $container = $ "form div.full-form"
        title     = evt.target.parentNode
        if !$container.is ":visible"
            title.click()
        false

    toggleForm: (evt) ->
        $container = $ "form div.full-form"
        $title     = $ evt.currentTarget
        $container.toggle "slow", () ->
            if $container.is ":visible"
                $title.attr "title", "click to hide the form"
            else
                $title.attr "title", "click to show the full form"
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

    addBookmarkFromFile: (link) ->
        $link = $ link
        if !!$link.attr("href").indexOf("place") and not $link.attr("feedurl")
            url         = $link.attr "href"
            title       = $link.text()
            description = ""
            next = $link.parents(":first").next()
            if next.is("dd")
                description = next.text()

            bookObj =
                title: title
                url: url
                tags: []
                description: description
            bookmark = new Bookmark bookObj
            @bookmarksView.collection.create bookmark,
                success: =>
                    imported = $(".imported")
                    if imported.text()
                        imported.text(parseInt(imported.text()) + 1)
                    else
                        imported.text(1)
                error: =>
                    notImported = $(".import-failed")
                    if notImported.text()
                        notImported.text(parseInt(notImported.text()) + 1)
                    else
                        notImported.text(1)

    addBookmarksFromFile: (file) ->
        loaded = $(file)
        links = loaded.find "dt a"
        for link in links
            @addBookmarkFromFile link

    uploadFile: (evt) ->
        file = evt.target.files[0]
        if file.type != "text/html"
            alertify.alert "This file cannot be imported"
            return

        reader = new FileReader()
        reader.onload = (evt) => @addBookmarksFromFile(evt.target.result)
        reader.readAsText(file)

    import: (evt) ->
        alertify.confirm "Import html bookmarks file exported by " +
                         "firefox or chrome",
            (ok) -> if ok
                $("#bookmarks-file").click()

    export: (evt) ->
        window.location = "export"
