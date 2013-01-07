all = ->
    emit Date.parse(doc.created), doc
    
Bookmark.defineRequest "all", all, (err) ->
    if err
        railway.logger.write "Bookmark All requests, cannot be created"
        railway.logger.write err
