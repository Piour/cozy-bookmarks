# Bookmark application

Store all your bookmarks here !

# To do ...

* change tag model to use [String]
* continue to review listjs use
* choose the sorting fields
* tag helper
* go back to the initial sorting (added time)
* removing tutorial non used stuff
* display in the app links to the used ressources

# Changelog

* v0.9.4
  * add an export button
* v0.9.3
  * config config
* v0.9.2
  * change default port (all apps with same port may disturb cozy)
* v0.9.1
  * using americano instead of compound
* v0.9
  * import from firefox/chrome html export
  * adding http to url that dont start with http
  * css corrections for small screens
  * fixed bug (issue #2) : no display of the form when writting in url input
* v0.8
  * reducing list.js
  * display full form only after a click on the url field
  * a bit less dark
  * fixed bug : wrong initial sorting on creation dates
  * fixed bug : sort button was not working using chrome
* v0.7
  * quickfix to adapt list.js to application needs (testing before rewriting)
  * new styles
  * use of alertify.js
  * clean form after adding a bookmark
  * use of ellipsis for too longs urls and minor display changes
  * solved bug : sorting after adding/deleting bookmark : need more work
* v0.6
  * put last deleted link into adding link form
  * show url only once if there is no title
  * icons added
  * add create button (submit on hit enter)
  * ordered by last created
* v0.5
  * create/delete bookmarks
  * store tags, description of bookmarks
  * search, sort bookmarks

# About Cozy

This app is suited to be deployed on the Cozy platform. Cozy is the personal
server for everyone. It allows you to install your every day web applications 
easily on your server, a single place you control. This means you can manage 
efficiently your data while protecting your privacy without technical skills.

More informations and hosting services on:
http://cozycloud.cc

# Tools & resources used :

* please, check package.json files
* main icon from IconTexto (http://icontexto.blogspot.fr/ - CC by-nc-sa)
* other icons from Gnome Project (http://art.gnome.org/themes/icon - GPL) 
* alertify.js (http://fabien-d.github.com/alertify.js/ - MIT)
* List.js (http://listjs.com/ - MIT)
