(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
"use strict mode";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmark_parser = function () {
    function bmark_parser() {
        _classCallCheck(this, bmark_parser);

        this._selection_rules = {
            div: {
                rules: [{ method: this.keep_len, param: { length: 100 }, conbination: "or" }]
            },
            other: {
                rules: [{ method: this.keep_len, param: { length: 100 }, conbination: "or" }]
            }
        };

        this._element_rules = [{ elem: ["h1"], method: this.is_near_element, params: null }, { elem: ["h2"], method: this.is_near_element, params: null }, { elem: ["h3"], method: this.is_near_element, params: null }, { elem: ["h4"], method: this.is_near_element, params: null }, { elem: ["h5"], method: this.is_near_element, params: null }, { elem: ["h6"], method: this.is_near_element, params: null }];
        this._element_checklist = [];
    }

    _createClass(bmark_parser, [{
        key: "parse",
        value: function parse(selection_elem) {
            return this.get_selection_element(selection_elem);
        }

        //----------------------------------------------------------------------------
        //      Find tags
        //----------------------------------------------------------------------------

    }, {
        key: "get_information_tagsearch",
        value: function get_information_tagsearch(selection_elem) {
            this._init_chk_element();
            this._chk_element(selection_elem);
            return this._element_rules;
        }
    }, {
        key: "_init_chk_element",
        value: function _init_chk_element() {
            var _this = this;

            this._element_rules.forEach(function (rule) {
                _this._element_checklist.push(rule.elem);
                rule.buffers = {};
                rule.elements = [];
            });
        }
    }, {
        key: "_chk_findelements_rule",
        value: function _chk_findelements_rule(selection_elem, chk_elem, rule) {
            rule.method.call(this, selection_elem, chk_elem, rule);
        }
    }, {
        key: "_chk_element",
        value: function _chk_element(selection_elem) {
            var _this2 = this;

            this._element_rules.forEach(function (rule) {
                rule.elem.forEach(function (tagstr) {
                    var tagList = document.getElementsByTagName(tagstr);
                    for (var i = 0; i < tagList.length; i++) {
                        var chk_elem = tagList[i];
                        _this2._chk_findelements_rule(selection_elem, chk_elem, rule);
                    }
                });
            });
            return false;
        }

        //----------------------------------------------------------------------------
        //      Get selection element
        //----------------------------------------------------------------------------

    }, {
        key: "get_selection_element",
        value: function get_selection_element(selection_elem) {
            if (this._chk_selection_rules(selection_elem)) {
                return selection_elem;
            } else {
                return this.parse(selection_elem.parentNode);
            }
        }
    }, {
        key: "_chk_selection_rules",
        value: function _chk_selection_rules(elem) {
            var _this3 = this;

            var rule = this._selection_rules[elem.tagName];
            if (!rule) rule = this._selection_rules.other;

            var is_valid = false;
            rule.rules.forEach(function (val) {
                var buf_result = val.method.call(_this3, elem, val.param);
                if (val.conbination === "or" && buf_result) {
                    is_valid = true;return;
                }
            });

            return is_valid;
        }

        //----------------------------------------------------------------------------
        //      Rules
        //----------------------------------------------------------------------------

    }, {
        key: "keep_len",
        value: function keep_len(elem, param) {
            return elem.innerHTML.length > param.length;
        }
    }, {
        key: "is_near_element",
        value: function is_near_element(selection_elem, chk_elem, param) {
            var bRect_selectionelem = selection_elem.getBoundingClientRect();
            var bRect_chk_elem = chk_elem.getBoundingClientRect();
            var diff_distance = bRect_selectionelem.top - bRect_chk_elem.top;
            if (diff_distance < 0) return;
            if (bRect_chk_elem.width === 0) return;
            if (bRect_chk_elem.height === 0) return;
            if (!param.buffers.dist) {
                param.elements.push(chk_elem);
                param.buffers.dist = diff_distance;
                console.log(chk_elem.tagName + "," + param.buffers.dist);
            } else if (param.buffers.dist > diff_distance) {
                param.elements[0] = chk_elem;
                param.buffers.dist = diff_distance;
            }
        }
    }]);

    return bmark_parser;
}();

exports.default = bmark_parser;

},{}],2:[function(require,module,exports){
'use strict';

var _selection = require('./selection.js');

var _selection2 = _interopRequireDefault(_selection);

var _bmark_parser = require('./bmark_parser.js');

var _bmark_parser2 = _interopRequireDefault(_bmark_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectbox = new _selection2.default(document.body);
var bmark_parser = new _bmark_parser2.default(document.body);

var curpos = { x: 0, y: 0 };

function select_area() {}

function find_element_fromtext(text) {}

function find_element_fromcurpos() {
    var setpos_x = window.pageXOffset + curpos.x;
    var setpos_y = window.pageYOffset + curpos.y;
    var obj = document.elementFromPoint(curpos.x, curpos.y);
    var retobj = bmark_parser.parse(obj);
    var rettags = bmark_parser.get_information_tagsearch(obj);
    console.log(retobj);
    console.log(rettags);
    return retobj;
}

function handler_mousemove(e) {
    curpos.x = e.clientX;
    curpos.y = e.clientY;
}

document.addEventListener("contextmenu", handler_mousemove, false);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.id = "element_memo") {
        console.log(find_element_fromcurpos().innerHTML);
        sendResponse({ selection_elem: find_element_fromcurpos().innerHTML });
    } else {
        sendResponse({ selection_text: window.getSelection() });
    }
});

},{"./bmark_parser.js":1,"./selection.js":3}],3:[function(require,module,exports){
"use strict";
"use strict mode";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var select_ui = function () {
    function select_ui(watching_element) {
        _classCallCheck(this, select_ui);

        this._watch_elem = watching_element;
        this._reg_mousedown_eventlistener();
        this._reg_mousemove_eventlistener();
        this._reg_mouseup_eventlistener();

        /* Select box */
        this._selbox = document.createElement("div");
        this._selbox.style.position = "absolute";
        this._selbox.style.borderStyle = "solid";
        this._selbox.style.borderWidth = "1px";
        this._selbox.style.zindex = "100";
        this._watch_elem.appendChild(this._selbox);

        this._selpos_start = { x: 0, y: 0 };
        this._selpos_end = { x: 0, y: 0 };
        this._rectangle = { pos1: null, pos2: null, width: 0, height: 0 };
        this._is_start_selecting = false;
        this._is_start_enable = false;
    }

    _createClass(select_ui, [{
        key: "_reg_mousedown_eventlistener",
        value: function _reg_mousedown_eventlistener() {
            var _this = this;

            this._watch_elem.addEventListener("mousedown", function (e) {
                _this._handler_mousedown(e);
            }, false);
        }
    }, {
        key: "_reg_mousemove_eventlistener",
        value: function _reg_mousemove_eventlistener() {
            var _this2 = this;

            this._watch_elem.addEventListener("mousemove", function (e) {
                _this2._handler_mousemove(e);
            }, false);
        }
    }, {
        key: "_reg_mouseup_eventlistener",
        value: function _reg_mouseup_eventlistener() {
            var _this3 = this;

            this._watch_elem.addEventListener("mouseup", function (e) {
                _this3._handler_mouseup(e);
            }, false);
        }
    }, {
        key: "_hide_selbox",
        value: function _hide_selbox() {
            this._selbox.style.display = "none";
        }
    }, {
        key: "_show_selbox",
        value: function _show_selbox() {
            this._selbox.style.display = "";
        }
    }, {
        key: "_set_rect_info",
        value: function _set_rect_info(setpos1, setpos2) {
            var pos1 = { x: 0, y: 0 };
            var pos2 = { x: 0, y: 0 };
            if (setpos1.x > setpos2.x) {
                pos1.x = setpos2.x;
                pos2.x = setpos1.x;
            } else {
                pos1.x = setpos1.x;
                pos2.x = setpos2.x;
            }
            if (setpos1.y > setpos2.y) {
                pos1.y = setpos2.y;
                pos2.y = setpos1.y;
            } else {
                pos1.y = setpos1.y;
                pos2.y = setpos2.y;
            }
            return { pos1: pos1, pos2: pos2, width: pos2.x - pos1.x, height: pos2.y - pos1.y };
        }
    }, {
        key: "start_select",
        value: function start_select(pos) {
            if (!this._is_start_enable) return;
            this._is_start_selecting = true;
            this._selpos_start = { x: pos.x, y: pos.y };
            this._selbox.style.left = pos.x + "px";
            this._selbox.style.top = pos.y + "px";
            this._watch_elem.style.userSelect = "none";
            this._show_selbox();
        }
    }, {
        key: "end_select",
        value: function end_select(pos) {
            this._selpos_end = { x: pos.x, y: pos.y };
            this._rectangle = this._set_rect_info(this._selpos_start, this._selpos_end);
            this._hide_selbox();
            this._is_start_selecting = false;
            this._watch_elem.style.userSelect = "";
        }
    }, {
        key: "box_sizechange",
        value: function box_sizechange(pos) {
            var rectinfo = this._set_rect_info(this._selpos_start, pos);
            this._selbox.style.width = rectinfo.width + "px";
            this._selbox.style.height = rectinfo.height + "px";
            this._selbox.style.left = rectinfo.pos1.x + "px";
            this._selbox.style.top = rectinfo.pos1.y + "px";
        }
    }, {
        key: "_get_curpos",
        value: function _get_curpos(e) {
            return { x: e.clientX + window.pageXOffset, y: e.clientY + window.pageYOffset };
        }
    }, {
        key: "_handler_mousemove",
        value: function _handler_mousemove(e) {
            if (this._is_start_selecting) {
                this.box_sizechange(this._get_curpos(e));
            }
        }
    }, {
        key: "_handler_mousedown",
        value: function _handler_mousedown(e) {
            this.start_select(this._get_curpos(e));
        }
    }, {
        key: "_handler_mouseup",
        value: function _handler_mouseup(e) {
            if (this._is_start_selecting) {
                this.end_select(this._get_curpos(e));
            }
        }
    }]);

    return select_ui;
}();

exports.default = select_ui;

},{}]},{},[2]);
