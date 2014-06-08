/*
ListJS Beta 0.2.0
By Jonny Strömberg (www.jonnystromberg.com, www.listjs.com)
modified version for cozy-bookmarks (https://github.com/Piour/cozy-bookmarks)

OBS. The API is not frozen. It MAY change!

License (MIT)

Copyright (c) 2011 Jonny Strömberg http://jonnystromberg.com

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/
(function (window, $, undefined) {
    "use strict";
    var document = window.document,
        h,
        List;

    List = function (id, options) {
        var self = this,
            init,
            Item,
            sortButtons,
            events = { 'updated': [] };

        this.listContainer = (typeof(id) === 'string') ?
                document.getElementById(id) :
                id;

        if (!this.listContainer) {
            return;
        }

        this.items = [];
        this.visibleItems = [];
        this.matchingItems = [];
        this.searched = false;

        this.list = null;

        this.page = options.page || 200;
        this.i = options.i || 1;

        init = {
            start: function (options) {
                this.classes(options);
                this.callbacks(options);
                this.items.start(options);
                self.update();
            },
            classes: function (options) {
                options.listClass = options.listClass || 'list';
                options.searchClass = options.searchClass || 'search';
                options.sortClass = options.sortClass || 'sort';
            },
            callbacks: function (options) {
                self.list = h.getByClass(options.listClass,
                                         self.listContainer,
                                         true);
                h.addEvent(h.getByClass(options.searchClass,
                                        self.listContainer),
                           'keyup',
                           self.search);
                sortButtons = h.getByClass(options.sortClass,
                                           self.listContainer);
                h.addEvent(sortButtons, 'click', self.sort);
            },
            items: {
                start: function (options) {
                    if (options.valueNames) {
                        this.index(this.get(), options.valueNames);
                    }
                },
                get: function () {
                    var nodes = self.list.childNodes,
                        items = [],
                        nodeLength = nodes.length,
                        i;

                    for (i = 0; i < nodeLength; i++) {
                        // Only textnodes have a data attribute
                        if (nodes[i].data === undefined) {
                            items.push(nodes[i]);
                        }
                    }
                    return items;
                },
                index: function (itemElements, valueNames) {
                    var itemElementsLength = itemElements.length,
                        i;
                    for (i = 0; i < itemElementsLength; i++) {
                        self.items.push(new Item(valueNames, itemElements[i]));
                    }
                }
            }
        };

        this.add = function (values) {
            var added = [],
                valuesLength,
                i,
                item;
            if (values[0] === undefined) {
                values = [values];
            }
            valuesLength = values.length;
            for (i = 0; i < valuesLength; i++) {
                item = null;
                if (values[i] instanceof Item) {
                    item = values[i];
                    item.reload();
                } else {
                    item = new Item(values[i].values, values[i].el);
                }
                self.items.push(item);
                added.push(item);
            }
            self.update();
            return added;
        };

        this.show = function (i, page) {
            this.i = i;
            this.page = page;
            self.update();
        };

        this.remove = function (valueName, value) {
            var found = 0,
                selfItemsLength = self.items.length,
                i;
            for (i = 0; i < selfItemsLength; i++) {
                if (self.items[i].values()[valueName] === value) {
                    self.items.splice(i, 1);
                    selfItemsLength--;
                    found++;
                }
            }
            self.update();
            return found;
        };

        this.get = function (valueName, value) {
            var matchedItems = [],
                selfItemsLength = self.items.length,
                i,
                item,
                elem;
            for (i = 0; i < selfItemsLength; i++) {
                item = self.items[i];
                if (item.values()[valueName] === value) {
                    matchedItems.push(item);
                }
            }
            if (matchedItems.length === 0) {
                elem = null;
            } else if (matchedItems.length === 1) {
                elem = matchedItems[0];
            } else {
                elem = matchedItems;
            }
            return elem;
        };

        this.sort = function (valueName, options) {
            var value = null,
                target = valueName.currentTarget || valueName.srcElement,
                isAsc = false,
                asc = 'asc',
                desc = 'desc',
                options = options || {},
                i;

            if (target === undefined) {
                value = valueName;
                isAsc = options.asc || false;
            } else {
                value = h.getAttribute(target, 'data-sort');
                if (!value) {
                    value = h.getAttribute(target.parentNode, 'data-sort');
                }
                isAsc = h.hasClass(target, asc) ? false : true;
            }
            h.removeClass(target, asc);
            h.removeClass(target, desc);
            if (isAsc) {
                if (target !== undefined) {
                    h.addClass(target, asc);
                }
                isAsc = true;
            } else {
                if (target !== undefined) {
                    h.addClass(target, desc);
                }
                isAsc = false;
            }

            if (!options.sortFunction) {
                options.sortFunction = function (a, b) {
                    return h.
                        sorter.
                        alphanum(a.values()[value].toLowerCase(),
                                 b.values()[value].toLowerCase(),
                                 isAsc);
                };
            }
            self.items.sort(options.sortFunction);
            self.update(true);
        };

        this.search = function (searchString, columns) {
            self.i = 1; // Reset paging
            var matching = [],
                found,
                item,
                text,
                values,
                is,
                isLength,
                columns = (columns === undefined) ?
                        self.items[0].values() :
                        columns,
                searchString = (searchString === undefined) ?
                        "" :
                        searchString,
                target = searchString.target || searchString.srcElement,
                k,
                j;

            searchString = (target === undefined) ?
                    (String() + searchString).toLowerCase() :
                    (String() + target.value).toLowerCase();
            is = self.items;
            isLength = is.length;

            searchString =
                searchString.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            if (searchString === "") {
                self.reset.search();
                self.searched = false;
                self.update();
            } else {
                self.searched = true;

                for (k = 0; k < isLength; k++) {
                    found = false;
                    item = is[k];
                    values = item.values();

                    for (j in columns) {
                        if (values.hasOwnProperty(j) && columns[j] !== null) {
                            text = (values[j] !== null) ?
                                    values[j].toString().toLowerCase() :
                                    "";
                            if ((searchString !== "") &&
                                (text.search(searchString) > -1)) {
                                found = true;
                                break;
                            }
                        }
                    }
                    if (found) {
                        item.found = true;
                        matching.push(item);
                    } else {
                        item.found = false;
                    }
                }
                self.update();
            }
            return self.visibleItems;
        };

        this.size = function () {
            return self.items.length;
        };

        this.clear = function () {
            self.items = [];
        };

        this.on = function (event, callback) {
            events[event].push(callback);
        };

        this.trigger = function (event) {
            var i = events[event].length;
            while (i--) {
                events[event][i]();
            }
        };

        this.reset = {
            search: function () {
                var is = self.items,
                    il = is.length;
                while (il--) {
                    is[il].found = false;
                }
            }
        };

        this.update = function (reload) {
            var is = self.items,
                i,
                isLength = is.length,
                listSource = h.getByClass(options.listClass,
                                          this.listContainer,
                                          true);

            self.visibleItems = [];
            self.matchingItems = [];
            if (reload) {
                if (listSource.hasChildNodes()) {
                    while (listSource.childNodes.length >= 1) {
                        listSource.removeChild(listSource.firstChild);
                    }
                }
            }
            for (i = 0; i < isLength; i++) {
                if (is[i].matching() &&
                    ((self.matchingItems.length + 1) >= self.i &&
                      self.visibleItems.length < self.page)) {
                    is[i].show();
                    self.visibleItems.push(is[i]);
                    self.matchingItems.push(is[i]);
                } else if (is[i].matching()) {
                    self.matchingItems.push(is[i]);
                    is[i].hide();
                } else {
                    is[i].hide();
                }
                if (reload) {
                    $(listSource).append($(is[i].elm));
                }
            }
            self.trigger('updated');
        };

        Item = function (initValues, element) {
            var item = this,
                values = {},
                init = function (initValues, element) {
                    var _values = {},
                        elm,
                        i,
                        initValuesLength = initValues.length;
                    if (element === undefined) {
                        item.values(initValues);
                    } else {
                        item.elm = element;
                        for (i = 0; i < initValuesLength; i++) {
                            elm = h.getByClass(initValues[i], item.elm, true);
                            _values[initValues[i]] = elm ?  elm.innerHTML : "";
                        }
                        item.values(_values);
                    }
                };

            this.found = false;

            this.values = function (newValues) {
                var name;
                if (newValues !== undefined) {
                    for (name in newValues) {
                        values[name] = newValues[name];
                    }
                } else {
                    return values;
                }
            };

            this.show = function () {
                $(item.elm).show();
            };

            this.hide = function () {
                $(item.elm).hide();
            };

            this.matching = function () {
                return ((self.searched && item.found) || (!self.searched));
            };

            this.visible = function () {
                return (item.elm.parentNode) ? true : false;
            };

            init(initValues, element);
        };

        init.start(options);
    };

    h = {
        /*
        * Cross browser getElementsByClassName, which uses native
        * if it exists. Modified version of Dustin Diaz function:
        * http://www.dustindiaz.com/getelementsbyclass
        */
        getByClass: (function () {
            if (document.getElementsByClassName) {
                return function (searchClass, node, single) {
                    var byClass;
                    if (single) {
                        byClass = node.getElementsByClassName(searchClass)[0];
                    } else {
                        byClass = node.getElementsByClassName(searchClass);
                    }
                    return byClass;
                };
            } else {
                return function (searchClass, node, single) {
                    var classElements = [],
                        tag = '*',
                        els,
                        elsLen,
                        pattern,
                        i,
                        j;
                    if (node === null) {
                        node = document;
                    }
                    els = node.getElementsByTagName(tag);
                    elsLen = els.length;
                    pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
                    for (i = 0, j = 0; i < elsLen; i++) {
                        if (pattern.test(els[i].className)) {
                            if (single) {
                                classElements = els[i];
                                break;
                            } else {
                                classElements[j] = els[i];
                                j++;
                            }
                        }
                    }
                    return classElements;
                };
            }
        }()),

        /* (elm, 'event' callback)
         * Source: http://net.tutsplus.com/tutorials/javascript-ajax/javascript-from-null-cross-browser-event-binding/
         */
        addEvent: (function (window, document) {
            if (document.addEventListener) {
                return function (elem, type, cb) {
                    var len,
                        i;
                    if ((elem &&
                         !(elem instanceof Array) &&
                         !elem.length &&
                         !h.isNodeList(elem) &&
                         (elem.length !== 0)) ||
                        elem === window) {
                        elem.addEventListener(type, cb, false);
                    } else if (elem && elem[0] !== undefined) {
                        len = elem.length;
                        for (i = 0; i < len; i++) {
                            h.addEvent(elem[i], type, cb);
                        }
                    }
                };
            } else if (document.attachEvent) {
                return function (elem, type, cb) {
                    var len,
                        i;
                    if ((elem &&
                         !(elem instanceof Array) &&
                         !elem.length &&
                         !h.isNodeList(elem) &&
                         (elem.length !== 0)) ||
                        elem === window) {
                        elem.attachEvent('on' + type,
                                         function () {
                                             return cb.call(elem,
                                                            window.event);
                                         });
                    } else if (elem && elem[0] !== undefined) {
                        len = elem.length;
                        for (i = 0; i < len; i++) {
                            h.addEvent(elem[i], type, cb);
                        }
                    }
                };
            }
        }(this, document)),

        /* (elm, attribute)
         * Source: http://stackoverflow.com/questions/3755227/cross-browser-javascript-getattribute-method
         */
        getAttribute: function (ele, attr) {
            var result = (ele.getAttribute && ele.getAttribute(attr)) || null,
                attrs,
                length,
                i;

            if (!result) {
                attrs = ele.attributes;
                length = attrs.length;
                for (i = 0; i < length; i++) {
                    if (attr[i] !== undefined) {
                        if (attr[i].nodeName === attr) {
                            result = attr[i].nodeValue;
                        }
                    }
                }
            }
            return result;
        },

        /* http://stackoverflow.com/questions/7238177/detect-htmlcollection-nodelist-in-javascript
         */
        isNodeList: function (nodes) {
            var result = Object.prototype.toString.call(nodes);
            if (typeof nodes === 'object' &&
                /^\[object (HTMLCollection|NodeList|Object)\]$/.test(result) &&
               (nodes.length === 0 ||
                (typeof nodes[0] === "object" && nodes[0].nodeType > 0))) {
                return true;
            }
            return false;
        },

        hasClass: function (ele, classN) {
            var classes = this.getAttribute(ele, 'class') ||
                          this.getAttribute(ele, 'className') ||
                          "";
            return (classes.search(classN) > -1);
        },

        addClass: function (ele, classN) {
            var classes;
            if (!this.hasClass(ele, classN)) {
                classes = this.getAttribute(ele, 'class') ||
                          this.getAttribute(ele, 'className') ||
                          "";
                classes = classes + ' ' + classN + ' ';
                classes = classes.replace(/\s{2,}/g, ' ');
                ele.setAttribute('class', classes);
            }
        },

        removeClass: function (ele, classN) {
            var classes;
            if (this.hasClass(ele, classN)) {
                classes = this.getAttribute(ele, 'class') ||
                          this.getAttribute(ele, 'className') ||
                          "";
                classes = classes.replace(classN, '');
                ele.setAttribute('class', classes);
            }
        },

        /*
         * The sort function.
         * From http://my.opera.com/GreyWyvern/blog/show.dml/1671288
         */
        sorter: {
            alphanum: function (a, b, asc) {
                var aa, bb, c, d, x;
                if (a === undefined || a === null) {
                    a = "";
                }
                if (b === undefined || b === null) {
                    b = "";
                }
                a = a.toString().replace(/&(lt|gt);/g,
                                         function (strMatch, p1) {
                                             return (p1 === "lt") ? "<" : ">";
                                         });
                a = a.replace(/<\/?[^>]+(>|$)/g, "");

                b = b.toString().replace(/&(lt|gt);/g,
                                         function (strMatch, p1) {
                                             return (p1 === "lt") ? "<" : ">";
                                         });
                b = b.replace(/<\/?[^>]+(>|$)/g, "");

                aa = this.chunkify(a);
                bb = this.chunkify(b);

                for (x = 0; aa[x] && bb[x]; x++) {
                    if (aa[x] !== bb[x]) {
                        c = Number(aa[x]);
                        d = Number(bb[x]);
                        if (asc) {
                            if (c === aa[x] && d === bb[x]) {
                                return c - d;
                            } else {
                                return (aa[x] > bb[x]) ? 1 : -1;
                            }
                        } else {
                            if (c === aa[x] && d === bb[x]) {
                                return d - c; // c - d;
                            } else {
                                return (aa[x] > bb[x]) ? -1 : 1; // 1 : -1;
                            }
                        }
                    }
                }
                return aa.length - bb.length;
            },

            chunkify: function (t) {
                var tz = [],
                    x = 0,
                    y = -1,
                    n = 0,
                    i,
                    j,
                    m;

                while (i = (j = t.charAt(x++)).charCodeAt(0)) {
                    m = (i === 45 || i === 46 || (i >= 48 && i <= 57));
                    if (m !== n) {
                        tz[++y] = "";
                        n = m;
                    }
                    tz[y] += j;
                }
                return tz;
            }
        }
    };

    window.List = List;
    window.ListJsHelpers = h;
}(window, $));
