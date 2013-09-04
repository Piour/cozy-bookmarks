Bookmark = require '../models/bookmark'

module.exports.all = (req, res) ->
    Bookmark.all (err, bookmarks) ->
        if err
            console.log err
            msg = "Server error occured while retrieving data."
            res.send error: true, msg: msg
        else
            res.send bookmarks

module.exports.create = (req, res) ->
    Bookmark.create req.body, (err, bookmark) =>
        if err
            console.log err
            msg = "Server error while creating bookmark."
            res.send error: true, msg: msg, 500
        else
            res.send bookmark

module.exports.destroy = (req, res) ->
    Bookmark.find req.params.id, (err, bookmark) =>
        if err? or not bookmark?
            res.send error: true, msg: "Bookmark not found", 404
        else
            bookmark.destroy (err) ->
                if err
                    console.log err
                    res.send error: 'Cannot destroy bookmark', 500
                else
                    res.send success: 'Bookmark succesfuly deleted'

                bookmark = null