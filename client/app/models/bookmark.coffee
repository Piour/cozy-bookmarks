module.exports = class Bookmark extends Backbone.Model

    urlRoot: 'bookmarks'

    isNew: () ->
        not @id?

    cleanValues: () ->
        readableTags = ""
        for tag in @attributes.tags
            readableTags += tag + ", "
        readableTags = readableTags.slice(0, readableTags.length - 2)
        @attributes.readableTags = readableTags
        
        httpUrl = @attributes.url
        if httpUrl.slice(0, 4) != "http"
            httpUrl = "http://" + httpUrl
        @attributes.httpUrl = httpUrl
 
