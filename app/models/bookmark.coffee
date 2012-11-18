Bookmark.all = (params, callback) ->
    Bookmark.request "all", { "descending": true }, params, callback
