(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("collections/bookmark_collection", function(exports, require, module) {
var Bookmark, BookmarkCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Bookmark = require('../models/bookmark');

module.exports = BookmarkCollection = (function(superClass) {
  extend(BookmarkCollection, superClass);

  BookmarkCollection.prototype.model = Bookmark;

  BookmarkCollection.prototype.url = 'bookmarks';

  function BookmarkCollection(view) {
    this.view = view;
    BookmarkCollection.__super__.constructor.call(this);
    this.bind("add", this.view.renderOne);
    this.bind("reset", this.view.renderAll);
  }

  return BookmarkCollection;

})(Backbone.Collection);

});

;require.register("initialize", function(exports, require, module) {
if (this.CozyApp == null) {
  this.CozyApp = {};
}

if (CozyApp.Routers == null) {
  CozyApp.Routers = {};
}

if (CozyApp.Views == null) {
  CozyApp.Views = {};
}

if (CozyApp.Models == null) {
  CozyApp.Models = {};
}

if (CozyApp.Collections == null) {
  CozyApp.Collections = {};
}

$(function() {
  var AppView;
  require('../lib/app_helpers');
  CozyApp.Views.appView = new (AppView = require('views/app_view'));
  CozyApp.Views.appView.render();
  return Backbone.history.start({
    pushState: true
  });
});

});

;require.register("lib/app_helpers", function(exports, require, module) {
(function() {
  return (function() {
    var console, dummy, method, methods, results;
    console = window.console = window.console || {};
    method = void 0;
    dummy = function() {};
    methods = 'assert,count,debug,dir,dirxml,error,exception, group,groupCollapsed,groupEnd,info,log,markTimeline, profile,profileEnd,time,timeEnd,trace,warn'.split(',');
    results = [];
    while (method = methods.pop()) {
      results.push(console[method] = console[method] || dummy);
    }
    return results;
  })();
})();

});

;require.register("lib/view", function(exports, require, module) {
var View,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = View = (function(superClass) {
  extend(View, superClass);

  function View() {
    return View.__super__.constructor.apply(this, arguments);
  }

  View.prototype.tagName = 'section';

  View.prototype.template = function() {};

  View.prototype.initialize = function() {
    return this.render();
  };

  View.prototype.getRenderData = function() {
    var ref;
    return {
      model: (ref = this.model) != null ? ref.toJSON() : void 0
    };
  };

  View.prototype.render = function() {
    this.beforeRender();
    this.$el.html(this.template());
    this.afterRender();
    return this;
  };

  View.prototype.beforeRender = function() {};

  View.prototype.afterRender = function() {};

  View.prototype.destroy = function() {
    this.undelegateEvents();
    this.$el.removeData().unbind();
    this.remove();
    return Backbone.View.prototype.remove.call(this);
  };

  return View;

})(Backbone.View);

});

;require.register("lib/view_collection", function(exports, require, module) {
var View, ViewCollection, methods,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

View = require('./view');

ViewCollection = (function(superClass) {
  extend(ViewCollection, superClass);

  function ViewCollection() {
    this.renderAll = bind(this.renderAll, this);
    this.renderOne = bind(this.renderOne, this);
    return ViewCollection.__super__.constructor.apply(this, arguments);
  }

  ViewCollection.prototype.collection = new Backbone.Collection();

  ViewCollection.prototype.view = new View();

  ViewCollection.prototype.views = [];

  ViewCollection.prototype.length = function() {
    return this.views.length;
  };

  ViewCollection.prototype.add = function(views, options) {
    var i, len, view;
    if (options == null) {
      options = {};
    }
    views = _.isArray(views) ? views.slice() : [views];
    for (i = 0, len = views.length; i < len; i++) {
      view = views[i];
      if (!this.get(view.cid)) {
        this.views.push(view);
        if (!options.silent) {
          this.trigger('add', view, this);
        }
      }
    }
    return this;
  };

  ViewCollection.prototype.get = function(cid) {
    return this.find(function(view) {
      return view.cid === cid;
    }) || null;
  };

  ViewCollection.prototype.remove = function(views, options) {
    var i, len, view;
    if (options == null) {
      options = {};
    }
    views = _.isArray(views) ? views.slice() : [views];
    for (i = 0, len = views.length; i < len; i++) {
      view = views[i];
      this.destroy(view);
      if (!options.silent) {
        this.trigger('remove', view, this);
      }
    }
    return this;
  };

  ViewCollection.prototype.destroy = function(view, options) {
    var _views;
    if (view == null) {
      view = this;
    }
    if (options == null) {
      options = {};
    }
    _views = this.filter(_view)(function() {
      return view.cid !== _view.cid;
    });
    this.views = _views;
    view.undelegateEvents();
    view.$el.removeData().unbind();
    view.remove();
    Backbone.View.prototype.remove.call(view);
    if (!options.silent) {
      this.trigger('remove', view, this);
    }
    return this;
  };

  ViewCollection.prototype.reset = function(views, options) {
    var i, j, len, len1, ref, view;
    if (options == null) {
      options = {};
    }
    views = _.isArray(views) ? views.slice() : [views];
    ref = this.views;
    for (i = 0, len = ref.length; i < len; i++) {
      view = ref[i];
      this.destroy(view, options);
    }
    if (views.length !== 0) {
      for (j = 0, len1 = views.length; j < len1; j++) {
        view = views[j];
        this.add(view, options);
      }
      if (!options.silent) {
        this.trigger('reset', view, this);
      }
    }
    return this;
  };

  ViewCollection.prototype.renderOne = function(model) {
    var view;
    view = new this.view(model);
    this.$el.prepend(view.render().el);
    this.add(view);
    return this;
  };

  ViewCollection.prototype.renderAll = function() {
    this.collection.each(this.renderOne);
    return this;
  };

  return ViewCollection;

})(View);

methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

_.each(methods, function(method) {
  return ViewCollection.prototype[method] = function() {
    return _[method].apply(_, [this.views].concat(_.toArray(arguments)));
  };
});

module.exports = ViewCollection;

});

;require.register("models/bookmark", function(exports, require, module) {
var Bookmark,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = Bookmark = (function(superClass) {
  extend(Bookmark, superClass);

  function Bookmark() {
    return Bookmark.__super__.constructor.apply(this, arguments);
  }

  Bookmark.prototype.urlRoot = 'bookmarks';

  Bookmark.prototype.isNew = function() {
    return this.id == null;
  };

  Bookmark.prototype.cleanValues = function() {
    var httpUrl, i, len, readableTags, tag, tags;
    readableTags = "";
    tags = this.attributes.tags;
    if (typeof tags === "string") {
      tags = tags.split(",");
    }
    for (i = 0, len = tags.length; i < len; i++) {
      tag = tags[i];
      readableTags += tag + ", ";
    }
    readableTags = readableTags.slice(0, readableTags.length - 2);
    this.attributes.readableTags = readableTags;
    httpUrl = this.attributes.url;
    if (httpUrl.slice(0, 4) !== "http") {
      httpUrl = "http://" + httpUrl;
    }
    return this.attributes.httpUrl = httpUrl;
  };

  return Bookmark;

})(Backbone.Model);

});

;require.register("routers/app_router", function(exports, require, module) {
var AppRouter,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = AppRouter = (function(superClass) {
  extend(AppRouter, superClass);

  function AppRouter() {
    return AppRouter.__super__.constructor.apply(this, arguments);
  }

  AppRouter.prototype.routes = {
    '': function() {}
  };

  return AppRouter;

})(Backbone.Router);

});

;require.register("views/app_view", function(exports, require, module) {
var AppRouter, AppView, Bookmark, BookmarksView, View,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

View = require("../lib/view");

AppRouter = require("../routers/app_router");

BookmarksView = require("./bookmarks_view");

Bookmark = require("../models/bookmark");

module.exports = AppView = (function(superClass) {
  extend(AppView, superClass);

  function AppView() {
    return AppView.__super__.constructor.apply(this, arguments);
  }

  AppView.prototype.el = "body.application";

  AppView.prototype.events = {
    "click form .create": "bookmarkLink",
    "keyup form .url-field": "showForm",
    "click form .url-field": "showForm",
    "click form .title": "toggleForm",
    "click form .clean": "cleanForm",
    "click .import": "import",
    "click .export": "export",
    "change #bookmarks-file": "uploadFile"
  };

  AppView.prototype.template = function() {
    return require("./templates/home");
  };

  AppView.prototype.initialize = function() {
    return this.router = CozyApp.Routers.AppRouter = new AppRouter();
  };

  AppView.prototype.afterRender = function() {
    $(".url-field").focus();
    this.bookmarksView = new BookmarksView();
    this.bookmarksView.$el.html('<em>loading...</em>');
    return this.bookmarksView.collection.fetch({
      success: (function(_this) {
        return function() {
          _this.bookmarksView.$el.find('em').remove();
          window.sortOptions = {
            "valueNames": ["title", "url", "tags", "description"]
          };
          window.featureList = new List("bookmarks-list", window.sortOptions);
          return alertify.log("bookmarks loaded");
        };
      })(this)
    });
  };

  AppView.prototype.showForm = function(evt) {
    var $container, title;
    $container = $("form .full-form");
    title = $(evt.target).parents(".title");
    if (!$container.is(":visible")) {
      title.click();
    }
    return false;
  };

  AppView.prototype.toggleForm = function(evt) {
    var $container, $title;
    $container = $("form .full-form");
    $title = $(evt.currentTarget);
    $container.toggle("slow", function() {
      if ($container.is(":visible")) {
        return $title.attr("title", "click to hide the detailed form");
      } else {
        return $title.attr("title", "click to show the full form");
      }
    });
    return false;
  };

  AppView.prototype.cleanForm = function(evt) {
    var $form, $inputs;
    $form = $("form");
    $inputs = $form.find("input, textarea");
    $inputs.val("");
    return false;
  };

  AppView.prototype.bookmarkLink = function(evt) {
    var bookObj, bookmark, description, tags, title, url;
    url = $('.url-field').val();
    title = $('.title-field').val();
    tags = $('.tags-field').val().split(',').map(function(tag) {
      return $.trim(tag);
    });
    description = $('.description-field').val();
    if ((url != null ? url.length : void 0) > 0) {
      bookObj = {
        title: title,
        url: url,
        tags: tags,
        description: description
      };
      bookmark = new Bookmark(bookObj);
      this.bookmarksView.collection.create(bookmark, {
        success: (function(_this) {
          return function() {
            _this.cleanForm();
            return alertify.log("" + (title || url) + " added");
          };
        })(this),
        error: (function(_this) {
          return function() {
            return alertify.alert("Server error occured, " + "bookmark was not saved");
          };
        })(this)
      });
    } else {
      alertify.alert("Url field is required");
    }
    return false;
  };

  AppView.prototype.addBookmarkFromFile = function(link) {
    var $link, bookObj, bookmark, description, next, title, url;
    $link = $(link);
    if (!!$link.attr("href").indexOf("place") && !$link.attr("feedurl")) {
      url = $link.attr("href");
      title = $link.text();
      description = "";
      next = $link.parents(":first").next();
      if (next.is("dd")) {
        description = next.text();
      }
      bookObj = {
        title: title,
        url: url,
        tags: [],
        description: description
      };
      bookmark = new Bookmark(bookObj);
      return this.bookmarksView.collection.create(bookmark, {
        success: (function(_this) {
          return function() {
            var imported;
            imported = $(".imported");
            if (imported.text()) {
              return imported.text(parseInt(imported.text()) + 1);
            } else {
              return imported.text(1);
            }
          };
        })(this),
        error: (function(_this) {
          return function() {
            var notImported;
            notImported = $(".import-failed");
            if (notImported.text()) {
              return notImported.text(parseInt(notImported.text()) + 1);
            } else {
              return notImported.text(1);
            }
          };
        })(this)
      });
    }
  };

  AppView.prototype.addBookmarksFromFile = function(file) {
    var i, len, link, links, loaded, results;
    loaded = $(file);
    links = loaded.find("dt a");
    results = [];
    for (i = 0, len = links.length; i < len; i++) {
      link = links[i];
      results.push(this.addBookmarkFromFile(link));
    }
    return results;
  };

  AppView.prototype.uploadFile = function(evt) {
    var file, reader;
    file = evt.target.files[0];
    if (file.type !== "text/html") {
      alertify.alert("This file cannot be imported");
      return;
    }
    reader = new FileReader();
    reader.onload = (function(_this) {
      return function(evt) {
        return _this.addBookmarksFromFile(evt.target.result);
      };
    })(this);
    return reader.readAsText(file);
  };

  AppView.prototype["import"] = function(evt) {
    return alertify.confirm("Import html bookmarks file exported by " + "firefox or chrome", function(ok) {
      if (ok) {
        return $("#bookmarks-file").click();
      }
    });
  };

  AppView.prototype["export"] = function(evt) {
    return window.location = "export";
  };

  return AppView;

})(View);

});

;require.register("views/bookmark_view", function(exports, require, module) {
var BookmarkView, View,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

View = require("../lib/view");

module.exports = BookmarkView = (function(superClass) {
  extend(BookmarkView, superClass);

  BookmarkView.prototype.className = "bookmark";

  BookmarkView.prototype.tagName = "li";

  BookmarkView.prototype.events = {
    "click .delete": "deleteBookmark"
  };

  function BookmarkView(model) {
    this.model = model;
    BookmarkView.__super__.constructor.call(this);
  }

  BookmarkView.prototype.template = function() {
    var template;
    template = require("./templates/bookmark");
    return template(this.getRenderData());
  };

  BookmarkView.prototype.render = function() {
    this.model.cleanValues();
    return BookmarkView.__super__.render.call(this);
  };

  BookmarkView.prototype.deleteBookmark = function() {
    var title;
    title = this.$el.find(".title").html();
    $(".url-field").val(this.$el.find(".title a").attr("href"));
    $(".title-field").val(this.$el.find(".title a").text());
    $(".tags-field").val(this.$el.find(".tags span").text());
    $(".description-field").val(this.$el.find(".description p").text());
    $(".full-form").show();
    return this.model.destroy({
      success: (function(_this) {
        return function() {
          _this.destroy();
          window.featureList.remove("title", title);
          return alertify.log("" + title + " removed and placed in form");
        };
      })(this),
      error: (function(_this) {
        return function() {
          alertify.alert("Server error occured, bookmark was not deleted.");
          return _this.$('.delete-button').html("delete");
        };
      })(this)
    });
  };

  return BookmarkView;

})(View);

});

;require.register("views/bookmarks_view", function(exports, require, module) {
var BookmarkCollection, BookmarkView, BookmarksView, ViewCollection,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ViewCollection = require('../lib/view_collection');

BookmarkView = require('./bookmark_view');

BookmarkCollection = require('../collections/bookmark_collection');

module.exports = BookmarksView = (function(superClass) {
  extend(BookmarksView, superClass);

  function BookmarksView() {
    this.renderOne = bind(this.renderOne, this);
    return BookmarksView.__super__.constructor.apply(this, arguments);
  }

  BookmarksView.prototype.el = '#bookmarks-list .list';

  BookmarksView.prototype.view = BookmarkView;

  BookmarksView.prototype.renderOne = function(model) {
    var sortObj, view;
    view = new this.view(model);
    this.$el.prepend(view.render().el);
    this.add(view);
    if (window.featureList) {
      sortObj = {
        "el": view.el,
        "values": window.sortOptions.valueNames
      };
      window.featureList.add(sortObj);
    }
    return this;
  };

  BookmarksView.prototype.initialize = function() {
    return this.collection = new BookmarkCollection(this);
  };

  return BookmarksView;

})(ViewCollection);

});

;require.register("views/templates/bookmark", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="buttons"><button title="Remove this link from saved bookmarks and place its details into the form" class="glyphicon glyphicon-share delete"></button></div><div class="all">');
if ( model.title)
{
buf.push('<div class="title"><a');
buf.push(attrs({ 'href':("" + (model.httpUrl) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>' + escape((interp = model.title) == null ? '' : interp) + '</a></div><div class="url"><a');
buf.push(attrs({ 'href':("" + (model.httpUrl) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>' + escape((interp = model.url) == null ? '' : interp) + '</a></div>');
}
else
{
buf.push('<div class="title full"><a');
buf.push(attrs({ 'href':("" + (model.httpUrl) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>' + escape((interp = model.url) == null ? '' : interp) + '</a></div>');
}
buf.push('</div>');
if ( model.description || model.tags.length)
{
buf.push('<div class="description"> ');
if ( model.tags.length)
{
buf.push('<div class="tags">tags: <span>' + escape((interp = model.readableTags) == null ? '' : interp) + '</span></div>');
}
buf.push('<p>' + escape((interp = model.description) == null ? '' : interp) + '</p></div>');
}
}
return buf.join("");
};
});

;require.register("views/templates/home", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="content"><div id="warning" class="panel"><div class="panel-body"><p>Please note that this application will not be updated anymore.</p><p>The future version of this application is now the <a target="_blank" href="https://github.com/pierrerousseau/quickmarks">quickmarks </a>app, available in the <a target="_top" href="/#applications">market place</a>.</p></div></div><input type="file" name="bookmarks-file" id="bookmarks-file"/><span class="import"><button title="import html bookmarks files exported from your browser" class="glyphicon glyphicon-upload import"><p class="imported"></p><p class="importe-failed"></p></button></span><span class="export"><button title="export bookmarks in html" class="glyphicon glyphicon-download export"></button></span><form id="create-bookmark-form" role="form"><div class="panel panel-default"><div class="panel-heading title"><h3 title="Show the full form" class="panel-title"> \nBookmark a link</h3><div class="row"><div class="form-group col-xs-8"><input placeholder="url" class="form-control url-field"/></div></div></div><div class="panel-body full-form"><div class="row"><div class="form-group col-xs-5"><input placeholder="title" class="form-control title-field"/></div><div class="form-group col-xs-5"><input placeholder="tags, separated by \',\'" class="form-control tags-field"/></div></div><div class="row"><div class="form-group col-xs-10"><textarea placeholder="description" class="form-control description-field"></textarea></div><div class="buttons col-xs-2"><button title="Save the bookmark" class="glyphicon glyphicon-ok-circle create"></button><button title="Clean the form" class="glyphicon glyphicon-remove-circle clean"></button></div></div></div></div></form><div id="bookmarks-list"><div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">mY BOOkmarks</h3><div class="row"><div class="tools col-xs-12"><div class="form-group"><input placeholder="search" class="form-control search"/></div><button title="Sort links" data-sort="title" class="glyphicon glyphicon-sort sort descending"></button></div></div></div><div class="panel-body"><ul class="list"></ul></div></div></div></div>');
}
return buf.join("");
};
});

;
//# sourceMappingURL=app.js.map