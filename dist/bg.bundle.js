/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ({

/***/ 6:
/***/ (function(module, exports) {


var db_version = 2.3;
var db;
var transaction;

function contextMenu_Click(info, tab) {
    chrome.tabs.sendMessage(tab.id, { hoge: "text_memo" }, function (response) {});
}

function mnu_ElementMemo_click(info, tab) {
    chrome.tabs.sendMessage(tab.id, { id: "element_memo" }, function (response) {
        console.log(response);
        transaction = db.transaction(["bookmarks"], "readwrite");
        var objectStore = transaction.objectStore("bookmarks");
        var data = { block_html: response.block, url: response.url, title: response.title, addinfo_tostr: response.send_additional_info_tostr };
        var request = objectStore.add(data);
        request.onsuccess = function (e) {
            console.log("success!!!");
        };
    });
}

chrome.contextMenus.create({
    title: "この部分を切り抜く",
    contexts: ["selection"],
    onclick: contextMenu_Click
});

chrome.contextMenus.create({
    title: "この部分を切り抜く",
    onclick: mnu_ElementMemo_click
});

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

var request = window.indexedDB.open("Bookmarkers", db_version);
request.onsuccess = e => {
    db = e.target.result;
};
request.onerror = () => {};
request.onupgradeneeded = e => {
    var db = e.target.result;
    var objectStore = db.createObjectStore("bookmarks", { autoIncrement: true });
    console.log("upgrade!!");
};

/***/ })

/******/ });