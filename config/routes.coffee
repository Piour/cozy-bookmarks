exports.routes = (map) ->

    map.get 'bookmarks', 'bookmarks#all'
    map.post 'bookmarks', 'bookmarks#create'
    map.del 'bookmarks/:id', 'bookmarks#destroy'
