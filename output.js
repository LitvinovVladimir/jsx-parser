
          const _react = window.React;
          const _client = window.ReactDOM;
          const _logo = {};
          

// D:\Work\jsx-parser\input.jsx
"use strict";

var Counter = function Counter() {
  return /*#__PURE__*/_react.createElement("div", null, "1");
};
function App() {
  return /*#__PURE__*/_react.createElement("div", {
    className: "App"
  }, /*#__PURE__*/_react.createElement("header", {
    className: "App-header"
  }, /*#__PURE__*/_react.createElement("img", {
    src: _logo,
    className: "App-logo",
    alt: "logo"
  }), /*#__PURE__*/_react.createElement("p", null, "Edit ", /*#__PURE__*/_react.createElement("code", null, "src/App.js"), " and save to reload."), /*#__PURE__*/_react.createElement("a", {
    className: "App-link",
    href: "https://reactjs.org",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Learn React")), /*#__PURE__*/_react.createElement(Counter, null));
}
;
var root = _client.createRoot(document.getElementById('root'));
root.render( /*#__PURE__*/_react.createElement(_react.StrictMode, null, /*#__PURE__*/_react.createElement(App, null)));
        