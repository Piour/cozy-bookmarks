Bookmark = require '../models/bookmark'

SendError = (res, details, httpCode = 500) ->
    msg = 'Internal server error: ' + details
    res.send error: true, msg: msg, httpCode
    true

module.exports.all = (req, res) ->
    Bookmark.all (err, bookmarks) ->
        if err
            console.error err
            SendError res, 'while retrieving data'
            return
        res.send bookmarks

module.exports.create = (req, res) ->
    Bookmark.create req.body, (err, bookmark) =>
        if err
            console.error err
            SendError res, 'while creating bookmark'
            return
        res.send bookmark

module.exports.destroy = (req, res) ->
    Bookmark.find req.params.id, (err, bookmark) =>
        if err
            SendError res, 'while finding bookmark with id ' + req.params.id
            return

        if not bookmark
            SendError res, 'bookmark not found', 404
            return

        bookmark.destroy (err) ->
            if err
                console.error err
                SendError res, 'while destroying bookmark'
                return

            res.send success: 'Bookmark successfully deleted'
            bookmark = null
