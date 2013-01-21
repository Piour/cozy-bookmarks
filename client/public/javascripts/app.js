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
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"collections/bookmark_collection": function(exports, require, module) {
  var Bookmark, BookmarkCollection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Bookmark = require('../models/bookmark');

  module.exports = BookmarkCollection = (function(_super) {

    __extends(BookmarkCollection, _super);

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
  
}});

window.require.define({"initialize": function(exports, require, module) {
  var _ref, _ref1, _ref2, _ref3, _ref4;

  if ((_ref = this.CozyApp) == null) {
    this.CozyApp = {};
  }

  if ((_ref1 = CozyApp.Routers) == null) {
    CozyApp.Routers = {};
  }

  if ((_ref2 = CozyApp.Views) == null) {
    CozyApp.Views = {};
  }

  if ((_ref3 = CozyApp.Models) == null) {
    CozyApp.Models = {};
  }

  if ((_ref4 = CozyApp.Collections) == null) {
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
  
}});

window.require.define({"lib/app_helpers": function(exports, require, module) {
  
  (function() {
    return (function() {
      var console, dummy, method, methods, _results;
      console = window.console = window.console || {};
      method = void 0;
      dummy = function() {};
      methods = 'assert,count,debug,dir,dirxml,error,exception,\
                     group,groupCollapsed,groupEnd,info,log,markTimeline,\
                     profile,profileEnd,time,timeEnd,trace,warn'.split(',');
      _results = [];
      while (method = methods.pop()) {
        _results.push(console[method] = console[method] || dummy);
      }
      return _results;
    })();
  })();
  
}});

window.require.define({"lib/view": function(exports, require, module) {
  var View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = View = (function(_super) {

    __extends(View, _super);

    function View() {
      return View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.tagName = 'section';

    View.prototype.template = function() {};

    View.prototype.initialize = function() {
      return this.render();
    };

    View.prototype.getRenderData = function() {
      var _ref;
      return {
        model: (_ref = this.model) != null ? _ref.toJSON() : void 0
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
  
}});

window.require.define({"lib/view_collection": function(exports, require, module) {
  var View, ViewCollection, methods,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('./view');

  ViewCollection = (function(_super) {

    __extends(ViewCollection, _super);

    function ViewCollection() {
      this.renderAll = __bind(this.renderAll, this);

      this.renderOne = __bind(this.renderOne, this);
      return ViewCollection.__super__.constructor.apply(this, arguments);
    }

    ViewCollection.prototype.collection = new Backbone.Collection();

    ViewCollection.prototype.view = new View();

    ViewCollection.prototype.views = [];

    ViewCollection.prototype.length = function() {
      return this.views.length;
    };

    ViewCollection.prototype.add = function(views, options) {
      var view, _i, _len;
      if (options == null) {
        options = {};
      }
      views = _.isArray(views) ? views.slice() : [views];
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
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
      var view, _i, _len;
      if (options == null) {
        options = {};
      }
      views = _.isArray(views) ? views.slice() : [views];
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
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
      var view, _i, _j, _len, _len1, _ref;
      if (options == null) {
        options = {};
      }
      views = _.isArray(views) ? views.slice() : [views];
      _ref = this.views;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        this.destroy(view, options);
      }
      if (views.length !== 0) {
        for (_j = 0, _len1 = views.length; _j < _len1; _j++) {
          view = views[_j];
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
  
}});

window.require.define({"models/bookmark": function(exports, require, module) {
  var Bookmark,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Bookmark = (function(_super) {

    __extends(Bookmark, _super);

    function Bookmark() {
      return Bookmark.__super__.constructor.apply(this, arguments);
    }

    Bookmark.prototype.urlRoot = 'bookmarks';

    Bookmark.prototype.isNew = function() {
      return !(this.id != null);
    };

    return Bookmark;

  })(Backbone.Model);
  
}});

window.require.define({"routers/app_router": function(exports, require, module) {
  var AppRouter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = AppRouter = (function(_super) {

    __extends(AppRouter, _super);

    function AppRouter() {
      return AppRouter.__super__.constructor.apply(this, arguments);
    }

    AppRouter.prototype.routes = {
      '': function() {}
    };

    return AppRouter;

  })(Backbone.Router);
  
}});

window.require.define({"views/app_view": function(exports, require, module) {
  var AppRouter, AppView, Bookmark, BookmarksView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require("../lib/view");

  AppRouter = require("../routers/app_router");

  BookmarksView = require("./bookmarks_view");

  Bookmark = require("../models/bookmark");

  module.exports = AppView = (function(_super) {

    __extends(AppView, _super);

    function AppView() {
      return AppView.__super__.constructor.apply(this, arguments);
    }

    AppView.prototype.el = "body.application";

    AppView.prototype.events = {
      "click form .create": "bookmarkLink",
      "keyup form .title input": "showForm",
      "click form .title input": "showForm",
      "click form .title": "toggleForm",
      "click form .clean": "cleanForm"
    };

    AppView.prototype.template = function() {
      return require("./templates/home");
    };

    AppView.prototype.initialize = function() {
      return this.router = CozyApp.Routers.AppRouter = new AppRouter();
    };

    AppView.prototype.afterRender = function() {
      var _this = this;
      $(".url-field").focus();
      this.bookmarksView = new BookmarksView();
      this.bookmarksView.$el.html('<em>loading...</em>');
      return this.bookmarksView.collection.fetch({
        success: function() {
          _this.bookmarksView.$el.find('em').remove();
          window.sortOptions = {
            "valueNames": ["title", "url", "tags", "description"]
          };
          window.featureList = new List("bookmark-list", window.sortOptions);
          return alertify.log("bookmarks loaded");
        }
      });
    };

    AppView.prototype.showForm = function(evt) {
      var $container, title;
      $container = $("form div.full-form");
      title = evt.target.parentNode;
      if (!$container.is(":visible")) {
        title.click();
      }
      return false;
    };

    AppView.prototype.toggleForm = function(evt) {
      var $container, $title;
      $container = $("form div.full-form");
      $title = $(evt.currentTarget);
      $container.toggle("slow", function() {
        if ($container.is(":visible")) {
          return $title.attr("title", "click to hide the form");
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
      var bookObj, bookmark, description, tags, title, url,
        _this = this;
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
          success: function() {
            _this.cleanForm();
            return alertify.log("" + (title || url) + " added");
          },
          error: function() {
            return alertify.alert("Server error occured, " + "bookmark was not saved");
          }
        });
      } else {
        alertify.alert("Url field is required");
      }
      return false;
    };

    return AppView;

  })(View);
  
}});

window.require.define({"views/bookmark_view": function(exports, require, module) {
  var BookmarkView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require("../lib/view");

  module.exports = BookmarkView = (function(_super) {

    __extends(BookmarkView, _super);

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

    BookmarkView.prototype.deleteBookmark = function() {
      var title,
        _this = this;
      title = this.$el.find(".title").html();
      $(".url-field").val(this.$el.find(".title a").attr("href"));
      $(".title-field").val(this.$el.find(".title a").text());
      $(".tags-field").val(this.$el.find(".tags").text());
      $(".description-field").val(this.$el.find(".description").text());
      return this.model.destroy({
        success: function() {
          _this.destroy();
          window.featureList.remove("title", title);
          return alertify.log("" + title + " removed and placed in form");
        },
        error: function() {
          alertify.alert("Server error occured, bookmark was not deleted.");
          return _this.$('.delete-button').html("delete");
        }
      });
    };

    return BookmarkView;

  })(View);
  
}});

window.require.define({"views/bookmarks_view": function(exports, require, module) {
  var BookmarkCollection, BookmarkView, BookmarksView, ViewCollection,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewCollection = require('../lib/view_collection');

  BookmarkView = require('./bookmark_view');

  BookmarkCollection = require('../collections/bookmark_collection');

  module.exports = BookmarksView = (function(_super) {

    __extends(BookmarksView, _super);

    function BookmarksView() {
      this.renderOne = __bind(this.renderOne, this);
      return BookmarksView.__super__.constructor.apply(this, arguments);
    }

    BookmarksView.prototype.el = '#bookmark-list .list';

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
  
}});

window.require.define({"views/templates/bookmark": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="buttons"><button title="click to remove this link from saved bookmarks and place its details into the form" class="delete"><img src="icons/delete.png" alt="delete"/></button></div>');
  if ( model.title)
  {
  buf.push('<div class="title"><a');
  buf.push(attrs({ 'href':("" + (model.url) + "") }, {"href":true}));
  buf.push('>' + escape((interp = model.title) == null ? '' : interp) + '</a></div>');
  }
  else
  {
  buf.push('<div class="title"><a');
  buf.push(attrs({ 'href':("" + (model.url) + "") }, {"href":true}));
  buf.push('>' + escape((interp = model.url) == null ? '' : interp) + '</a></div>');
  }
  buf.push('<div class="tags">' + escape((interp = model.tags) == null ? '' : interp) + '</div>');
  if ( model.title)
  {
  buf.push('<a');
  buf.push(attrs({ 'href':("" + (model.url) + ""), "class": ('url') }, {"href":true}));
  buf.push('>' + escape((interp = model.url) == null ? '' : interp) + '</a>');
  }
  if ( model.description)
  {
  buf.push('<p class="description">' + escape((interp = model.description) == null ? '' : interp) + '</p>');
  }
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/home": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="content"><form id="create-bookmark-form"><h1 title="click to show the full form" class="title"> <span>Bookmark a link</span><input title="click to show the full form" placeholder="url" class="url-field"/></h1><div class="full-form"><p><input placeholder="title" class="title-field"/><input placeholder="tags, separated by \',\'" class="tags-field"/></p><p class="last"><textarea placeholder="description" class="description-field"></textarea></p><div class="buttons"><button title="click here to store the bookmark" class="create"><img src="icons/add.png" alt="add"/></button><button title="click to clean the form" class="clean"><img src="icons/clean.png" alt="clean"/></button></div></div></form><div id="bookmark-list"><h1 class="title">mY BOOkmarks</h1><div class="tools"><input placeholder="search" class="search"/><button title="click to sort links" data-sort="title" class="sort descending"><img src="icons/sort-descending.png" alt="sort"/></button></div><ul class="list"></ul></div></div>');
  }
  return buf.join("");
  };
}});

