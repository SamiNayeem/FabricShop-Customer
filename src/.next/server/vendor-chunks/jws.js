/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/jws";
exports.ids = ["vendor-chunks/jws"];
exports.modules = {

/***/ "(rsc)/./node_modules/jws/index.js":
/*!***********************************!*\
  !*** ./node_modules/jws/index.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("/*global exports*/\nvar SignStream = __webpack_require__(/*! ./lib/sign-stream */ \"(rsc)/./node_modules/jws/lib/sign-stream.js\");\nvar VerifyStream = __webpack_require__(/*! ./lib/verify-stream */ \"(rsc)/./node_modules/jws/lib/verify-stream.js\");\n\nvar ALGORITHMS = [\n  'HS256', 'HS384', 'HS512',\n  'RS256', 'RS384', 'RS512',\n  'PS256', 'PS384', 'PS512',\n  'ES256', 'ES384', 'ES512'\n];\n\nexports.ALGORITHMS = ALGORITHMS;\nexports.sign = SignStream.sign;\nexports.verify = VerifyStream.verify;\nexports.decode = VerifyStream.decode;\nexports.isValid = VerifyStream.isValid;\nexports.createSign = function createSign(opts) {\n  return new SignStream(opts);\n};\nexports.createVerify = function createVerify(opts) {\n  return new VerifyStream(opts);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvandzL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0EsaUJBQWlCLG1CQUFPLENBQUMsc0VBQW1CO0FBQzVDLG1CQUFtQixtQkFBTyxDQUFDLDBFQUFxQjs7QUFFaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFrQjtBQUNsQixZQUFZO0FBQ1osY0FBYztBQUNkLGNBQWM7QUFDZCxlQUFlO0FBQ2Ysa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ZhYnJpY3Nob3AvLi9ub2RlX21vZHVsZXMvandzL2luZGV4LmpzPzE2NDQiXSwic291cmNlc0NvbnRlbnQiOlsiLypnbG9iYWwgZXhwb3J0cyovXG52YXIgU2lnblN0cmVhbSA9IHJlcXVpcmUoJy4vbGliL3NpZ24tc3RyZWFtJyk7XG52YXIgVmVyaWZ5U3RyZWFtID0gcmVxdWlyZSgnLi9saWIvdmVyaWZ5LXN0cmVhbScpO1xuXG52YXIgQUxHT1JJVEhNUyA9IFtcbiAgJ0hTMjU2JywgJ0hTMzg0JywgJ0hTNTEyJyxcbiAgJ1JTMjU2JywgJ1JTMzg0JywgJ1JTNTEyJyxcbiAgJ1BTMjU2JywgJ1BTMzg0JywgJ1BTNTEyJyxcbiAgJ0VTMjU2JywgJ0VTMzg0JywgJ0VTNTEyJ1xuXTtcblxuZXhwb3J0cy5BTEdPUklUSE1TID0gQUxHT1JJVEhNUztcbmV4cG9ydHMuc2lnbiA9IFNpZ25TdHJlYW0uc2lnbjtcbmV4cG9ydHMudmVyaWZ5ID0gVmVyaWZ5U3RyZWFtLnZlcmlmeTtcbmV4cG9ydHMuZGVjb2RlID0gVmVyaWZ5U3RyZWFtLmRlY29kZTtcbmV4cG9ydHMuaXNWYWxpZCA9IFZlcmlmeVN0cmVhbS5pc1ZhbGlkO1xuZXhwb3J0cy5jcmVhdGVTaWduID0gZnVuY3Rpb24gY3JlYXRlU2lnbihvcHRzKSB7XG4gIHJldHVybiBuZXcgU2lnblN0cmVhbShvcHRzKTtcbn07XG5leHBvcnRzLmNyZWF0ZVZlcmlmeSA9IGZ1bmN0aW9uIGNyZWF0ZVZlcmlmeShvcHRzKSB7XG4gIHJldHVybiBuZXcgVmVyaWZ5U3RyZWFtKG9wdHMpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/jws/index.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/jws/lib/data-stream.js":
/*!*********************************************!*\
  !*** ./node_modules/jws/lib/data-stream.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/*global module, process*/\nvar Buffer = (__webpack_require__(/*! safe-buffer */ \"(rsc)/./node_modules/safe-buffer/index.js\").Buffer);\nvar Stream = __webpack_require__(/*! stream */ \"stream\");\nvar util = __webpack_require__(/*! util */ \"util\");\n\nfunction DataStream(data) {\n  this.buffer = null;\n  this.writable = true;\n  this.readable = true;\n\n  // No input\n  if (!data) {\n    this.buffer = Buffer.alloc(0);\n    return this;\n  }\n\n  // Stream\n  if (typeof data.pipe === 'function') {\n    this.buffer = Buffer.alloc(0);\n    data.pipe(this);\n    return this;\n  }\n\n  // Buffer or String\n  // or Object (assumedly a passworded key)\n  if (data.length || typeof data === 'object') {\n    this.buffer = data;\n    this.writable = false;\n    process.nextTick(function () {\n      this.emit('end', data);\n      this.readable = false;\n      this.emit('close');\n    }.bind(this));\n    return this;\n  }\n\n  throw new TypeError('Unexpected data type ('+ typeof data + ')');\n}\nutil.inherits(DataStream, Stream);\n\nDataStream.prototype.write = function write(data) {\n  this.buffer = Buffer.concat([this.buffer, Buffer.from(data)]);\n  this.emit('data', data);\n};\n\nDataStream.prototype.end = function end(data) {\n  if (data)\n    this.write(data);\n  this.emit('end', data);\n  this.emit('close');\n  this.writable = false;\n  this.readable = false;\n};\n\nmodule.exports = DataStream;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvandzL2xpYi9kYXRhLXN0cmVhbS5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBLGFBQWEsNEZBQTZCO0FBQzFDLGFBQWEsbUJBQU8sQ0FBQyxzQkFBUTtBQUM3QixXQUFXLG1CQUFPLENBQUMsa0JBQU07O0FBRXpCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmFicmljc2hvcC8uL25vZGVfbW9kdWxlcy9qd3MvbGliL2RhdGEtc3RyZWFtLmpzPzZhMmEiXSwic291cmNlc0NvbnRlbnQiOlsiLypnbG9iYWwgbW9kdWxlLCBwcm9jZXNzKi9cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlcjtcbnZhciBTdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKTtcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuXG5mdW5jdGlvbiBEYXRhU3RyZWFtKGRhdGEpIHtcbiAgdGhpcy5idWZmZXIgPSBudWxsO1xuICB0aGlzLndyaXRhYmxlID0gdHJ1ZTtcbiAgdGhpcy5yZWFkYWJsZSA9IHRydWU7XG5cbiAgLy8gTm8gaW5wdXRcbiAgaWYgKCFkYXRhKSB7XG4gICAgdGhpcy5idWZmZXIgPSBCdWZmZXIuYWxsb2MoMCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBTdHJlYW1cbiAgaWYgKHR5cGVvZiBkYXRhLnBpcGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICB0aGlzLmJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygwKTtcbiAgICBkYXRhLnBpcGUodGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBCdWZmZXIgb3IgU3RyaW5nXG4gIC8vIG9yIE9iamVjdCAoYXNzdW1lZGx5IGEgcGFzc3dvcmRlZCBrZXkpXG4gIGlmIChkYXRhLmxlbmd0aCB8fCB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHtcbiAgICB0aGlzLmJ1ZmZlciA9IGRhdGE7XG4gICAgdGhpcy53cml0YWJsZSA9IGZhbHNlO1xuICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5lbWl0KCdlbmQnLCBkYXRhKTtcbiAgICAgIHRoaXMucmVhZGFibGUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZW1pdCgnY2xvc2UnKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5leHBlY3RlZCBkYXRhIHR5cGUgKCcrIHR5cGVvZiBkYXRhICsgJyknKTtcbn1cbnV0aWwuaW5oZXJpdHMoRGF0YVN0cmVhbSwgU3RyZWFtKTtcblxuRGF0YVN0cmVhbS5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZShkYXRhKSB7XG4gIHRoaXMuYnVmZmVyID0gQnVmZmVyLmNvbmNhdChbdGhpcy5idWZmZXIsIEJ1ZmZlci5mcm9tKGRhdGEpXSk7XG4gIHRoaXMuZW1pdCgnZGF0YScsIGRhdGEpO1xufTtcblxuRGF0YVN0cmVhbS5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24gZW5kKGRhdGEpIHtcbiAgaWYgKGRhdGEpXG4gICAgdGhpcy53cml0ZShkYXRhKTtcbiAgdGhpcy5lbWl0KCdlbmQnLCBkYXRhKTtcbiAgdGhpcy5lbWl0KCdjbG9zZScpO1xuICB0aGlzLndyaXRhYmxlID0gZmFsc2U7XG4gIHRoaXMucmVhZGFibGUgPSBmYWxzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0YVN0cmVhbTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/jws/lib/data-stream.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/jws/lib/sign-stream.js":
/*!*********************************************!*\
  !*** ./node_modules/jws/lib/sign-stream.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/*global module*/\nvar Buffer = (__webpack_require__(/*! safe-buffer */ \"(rsc)/./node_modules/safe-buffer/index.js\").Buffer);\nvar DataStream = __webpack_require__(/*! ./data-stream */ \"(rsc)/./node_modules/jws/lib/data-stream.js\");\nvar jwa = __webpack_require__(/*! jwa */ \"(rsc)/./node_modules/jwa/index.js\");\nvar Stream = __webpack_require__(/*! stream */ \"stream\");\nvar toString = __webpack_require__(/*! ./tostring */ \"(rsc)/./node_modules/jws/lib/tostring.js\");\nvar util = __webpack_require__(/*! util */ \"util\");\n\nfunction base64url(string, encoding) {\n  return Buffer\n    .from(string, encoding)\n    .toString('base64')\n    .replace(/=/g, '')\n    .replace(/\\+/g, '-')\n    .replace(/\\//g, '_');\n}\n\nfunction jwsSecuredInput(header, payload, encoding) {\n  encoding = encoding || 'utf8';\n  var encodedHeader = base64url(toString(header), 'binary');\n  var encodedPayload = base64url(toString(payload), encoding);\n  return util.format('%s.%s', encodedHeader, encodedPayload);\n}\n\nfunction jwsSign(opts) {\n  var header = opts.header;\n  var payload = opts.payload;\n  var secretOrKey = opts.secret || opts.privateKey;\n  var encoding = opts.encoding;\n  var algo = jwa(header.alg);\n  var securedInput = jwsSecuredInput(header, payload, encoding);\n  var signature = algo.sign(securedInput, secretOrKey);\n  return util.format('%s.%s', securedInput, signature);\n}\n\nfunction SignStream(opts) {\n  var secret = opts.secret||opts.privateKey||opts.key;\n  var secretStream = new DataStream(secret);\n  this.readable = true;\n  this.header = opts.header;\n  this.encoding = opts.encoding;\n  this.secret = this.privateKey = this.key = secretStream;\n  this.payload = new DataStream(opts.payload);\n  this.secret.once('close', function () {\n    if (!this.payload.writable && this.readable)\n      this.sign();\n  }.bind(this));\n\n  this.payload.once('close', function () {\n    if (!this.secret.writable && this.readable)\n      this.sign();\n  }.bind(this));\n}\nutil.inherits(SignStream, Stream);\n\nSignStream.prototype.sign = function sign() {\n  try {\n    var signature = jwsSign({\n      header: this.header,\n      payload: this.payload.buffer,\n      secret: this.secret.buffer,\n      encoding: this.encoding\n    });\n    this.emit('done', signature);\n    this.emit('data', signature);\n    this.emit('end');\n    this.readable = false;\n    return signature;\n  } catch (e) {\n    this.readable = false;\n    this.emit('error', e);\n    this.emit('close');\n  }\n};\n\nSignStream.sign = jwsSign;\n\nmodule.exports = SignStream;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvandzL2xpYi9zaWduLXN0cmVhbS5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBLGFBQWEsNEZBQTZCO0FBQzFDLGlCQUFpQixtQkFBTyxDQUFDLGtFQUFlO0FBQ3hDLFVBQVUsbUJBQU8sQ0FBQyw4Q0FBSztBQUN2QixhQUFhLG1CQUFPLENBQUMsc0JBQVE7QUFDN0IsZUFBZSxtQkFBTyxDQUFDLDREQUFZO0FBQ25DLFdBQVcsbUJBQU8sQ0FBQyxrQkFBTTs7QUFFekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmFicmljc2hvcC8uL25vZGVfbW9kdWxlcy9qd3MvbGliL3NpZ24tc3RyZWFtLmpzPzlmZjgiXSwic291cmNlc0NvbnRlbnQiOlsiLypnbG9iYWwgbW9kdWxlKi9cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlcjtcbnZhciBEYXRhU3RyZWFtID0gcmVxdWlyZSgnLi9kYXRhLXN0cmVhbScpO1xudmFyIGp3YSA9IHJlcXVpcmUoJ2p3YScpO1xudmFyIFN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpO1xudmFyIHRvU3RyaW5nID0gcmVxdWlyZSgnLi90b3N0cmluZycpO1xudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG5cbmZ1bmN0aW9uIGJhc2U2NHVybChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIHJldHVybiBCdWZmZXJcbiAgICAuZnJvbShzdHJpbmcsIGVuY29kaW5nKVxuICAgIC50b1N0cmluZygnYmFzZTY0JylcbiAgICAucmVwbGFjZSgvPS9nLCAnJylcbiAgICAucmVwbGFjZSgvXFwrL2csICctJylcbiAgICAucmVwbGFjZSgvXFwvL2csICdfJyk7XG59XG5cbmZ1bmN0aW9uIGp3c1NlY3VyZWRJbnB1dChoZWFkZXIsIHBheWxvYWQsIGVuY29kaW5nKSB7XG4gIGVuY29kaW5nID0gZW5jb2RpbmcgfHwgJ3V0ZjgnO1xuICB2YXIgZW5jb2RlZEhlYWRlciA9IGJhc2U2NHVybCh0b1N0cmluZyhoZWFkZXIpLCAnYmluYXJ5Jyk7XG4gIHZhciBlbmNvZGVkUGF5bG9hZCA9IGJhc2U2NHVybCh0b1N0cmluZyhwYXlsb2FkKSwgZW5jb2RpbmcpO1xuICByZXR1cm4gdXRpbC5mb3JtYXQoJyVzLiVzJywgZW5jb2RlZEhlYWRlciwgZW5jb2RlZFBheWxvYWQpO1xufVxuXG5mdW5jdGlvbiBqd3NTaWduKG9wdHMpIHtcbiAgdmFyIGhlYWRlciA9IG9wdHMuaGVhZGVyO1xuICB2YXIgcGF5bG9hZCA9IG9wdHMucGF5bG9hZDtcbiAgdmFyIHNlY3JldE9yS2V5ID0gb3B0cy5zZWNyZXQgfHwgb3B0cy5wcml2YXRlS2V5O1xuICB2YXIgZW5jb2RpbmcgPSBvcHRzLmVuY29kaW5nO1xuICB2YXIgYWxnbyA9IGp3YShoZWFkZXIuYWxnKTtcbiAgdmFyIHNlY3VyZWRJbnB1dCA9IGp3c1NlY3VyZWRJbnB1dChoZWFkZXIsIHBheWxvYWQsIGVuY29kaW5nKTtcbiAgdmFyIHNpZ25hdHVyZSA9IGFsZ28uc2lnbihzZWN1cmVkSW5wdXQsIHNlY3JldE9yS2V5KTtcbiAgcmV0dXJuIHV0aWwuZm9ybWF0KCclcy4lcycsIHNlY3VyZWRJbnB1dCwgc2lnbmF0dXJlKTtcbn1cblxuZnVuY3Rpb24gU2lnblN0cmVhbShvcHRzKSB7XG4gIHZhciBzZWNyZXQgPSBvcHRzLnNlY3JldHx8b3B0cy5wcml2YXRlS2V5fHxvcHRzLmtleTtcbiAgdmFyIHNlY3JldFN0cmVhbSA9IG5ldyBEYXRhU3RyZWFtKHNlY3JldCk7XG4gIHRoaXMucmVhZGFibGUgPSB0cnVlO1xuICB0aGlzLmhlYWRlciA9IG9wdHMuaGVhZGVyO1xuICB0aGlzLmVuY29kaW5nID0gb3B0cy5lbmNvZGluZztcbiAgdGhpcy5zZWNyZXQgPSB0aGlzLnByaXZhdGVLZXkgPSB0aGlzLmtleSA9IHNlY3JldFN0cmVhbTtcbiAgdGhpcy5wYXlsb2FkID0gbmV3IERhdGFTdHJlYW0ob3B0cy5wYXlsb2FkKTtcbiAgdGhpcy5zZWNyZXQub25jZSgnY2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLnBheWxvYWQud3JpdGFibGUgJiYgdGhpcy5yZWFkYWJsZSlcbiAgICAgIHRoaXMuc2lnbigpO1xuICB9LmJpbmQodGhpcykpO1xuXG4gIHRoaXMucGF5bG9hZC5vbmNlKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuc2VjcmV0LndyaXRhYmxlICYmIHRoaXMucmVhZGFibGUpXG4gICAgICB0aGlzLnNpZ24oKTtcbiAgfS5iaW5kKHRoaXMpKTtcbn1cbnV0aWwuaW5oZXJpdHMoU2lnblN0cmVhbSwgU3RyZWFtKTtcblxuU2lnblN0cmVhbS5wcm90b3R5cGUuc2lnbiA9IGZ1bmN0aW9uIHNpZ24oKSB7XG4gIHRyeSB7XG4gICAgdmFyIHNpZ25hdHVyZSA9IGp3c1NpZ24oe1xuICAgICAgaGVhZGVyOiB0aGlzLmhlYWRlcixcbiAgICAgIHBheWxvYWQ6IHRoaXMucGF5bG9hZC5idWZmZXIsXG4gICAgICBzZWNyZXQ6IHRoaXMuc2VjcmV0LmJ1ZmZlcixcbiAgICAgIGVuY29kaW5nOiB0aGlzLmVuY29kaW5nXG4gICAgfSk7XG4gICAgdGhpcy5lbWl0KCdkb25lJywgc2lnbmF0dXJlKTtcbiAgICB0aGlzLmVtaXQoJ2RhdGEnLCBzaWduYXR1cmUpO1xuICAgIHRoaXMuZW1pdCgnZW5kJyk7XG4gICAgdGhpcy5yZWFkYWJsZSA9IGZhbHNlO1xuICAgIHJldHVybiBzaWduYXR1cmU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aGlzLnJlYWRhYmxlID0gZmFsc2U7XG4gICAgdGhpcy5lbWl0KCdlcnJvcicsIGUpO1xuICAgIHRoaXMuZW1pdCgnY2xvc2UnKTtcbiAgfVxufTtcblxuU2lnblN0cmVhbS5zaWduID0gandzU2lnbjtcblxubW9kdWxlLmV4cG9ydHMgPSBTaWduU3RyZWFtO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/jws/lib/sign-stream.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/jws/lib/tostring.js":
/*!******************************************!*\
  !*** ./node_modules/jws/lib/tostring.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/*global module*/\nvar Buffer = (__webpack_require__(/*! buffer */ \"buffer\").Buffer);\n\nmodule.exports = function toString(obj) {\n  if (typeof obj === 'string')\n    return obj;\n  if (typeof obj === 'number' || Buffer.isBuffer(obj))\n    return obj.toString();\n  return JSON.stringify(obj);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvandzL2xpYi90b3N0cmluZy5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBLGFBQWEsb0RBQXdCOztBQUVyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ZhYnJpY3Nob3AvLi9ub2RlX21vZHVsZXMvandzL2xpYi90b3N0cmluZy5qcz9hMDVlIl0sInNvdXJjZXNDb250ZW50IjpbIi8qZ2xvYmFsIG1vZHVsZSovXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvU3RyaW5nKG9iaikge1xuICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpXG4gICAgcmV0dXJuIG9iajtcbiAgaWYgKHR5cGVvZiBvYmogPT09ICdudW1iZXInIHx8IEJ1ZmZlci5pc0J1ZmZlcihvYmopKVxuICAgIHJldHVybiBvYmoudG9TdHJpbmcoKTtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaik7XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/jws/lib/tostring.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/jws/lib/verify-stream.js":
/*!***********************************************!*\
  !*** ./node_modules/jws/lib/verify-stream.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/*global module*/\nvar Buffer = (__webpack_require__(/*! safe-buffer */ \"(rsc)/./node_modules/safe-buffer/index.js\").Buffer);\nvar DataStream = __webpack_require__(/*! ./data-stream */ \"(rsc)/./node_modules/jws/lib/data-stream.js\");\nvar jwa = __webpack_require__(/*! jwa */ \"(rsc)/./node_modules/jwa/index.js\");\nvar Stream = __webpack_require__(/*! stream */ \"stream\");\nvar toString = __webpack_require__(/*! ./tostring */ \"(rsc)/./node_modules/jws/lib/tostring.js\");\nvar util = __webpack_require__(/*! util */ \"util\");\nvar JWS_REGEX = /^[a-zA-Z0-9\\-_]+?\\.[a-zA-Z0-9\\-_]+?\\.([a-zA-Z0-9\\-_]+)?$/;\n\nfunction isObject(thing) {\n  return Object.prototype.toString.call(thing) === '[object Object]';\n}\n\nfunction safeJsonParse(thing) {\n  if (isObject(thing))\n    return thing;\n  try { return JSON.parse(thing); }\n  catch (e) { return undefined; }\n}\n\nfunction headerFromJWS(jwsSig) {\n  var encodedHeader = jwsSig.split('.', 1)[0];\n  return safeJsonParse(Buffer.from(encodedHeader, 'base64').toString('binary'));\n}\n\nfunction securedInputFromJWS(jwsSig) {\n  return jwsSig.split('.', 2).join('.');\n}\n\nfunction signatureFromJWS(jwsSig) {\n  return jwsSig.split('.')[2];\n}\n\nfunction payloadFromJWS(jwsSig, encoding) {\n  encoding = encoding || 'utf8';\n  var payload = jwsSig.split('.')[1];\n  return Buffer.from(payload, 'base64').toString(encoding);\n}\n\nfunction isValidJws(string) {\n  return JWS_REGEX.test(string) && !!headerFromJWS(string);\n}\n\nfunction jwsVerify(jwsSig, algorithm, secretOrKey) {\n  if (!algorithm) {\n    var err = new Error(\"Missing algorithm parameter for jws.verify\");\n    err.code = \"MISSING_ALGORITHM\";\n    throw err;\n  }\n  jwsSig = toString(jwsSig);\n  var signature = signatureFromJWS(jwsSig);\n  var securedInput = securedInputFromJWS(jwsSig);\n  var algo = jwa(algorithm);\n  return algo.verify(securedInput, signature, secretOrKey);\n}\n\nfunction jwsDecode(jwsSig, opts) {\n  opts = opts || {};\n  jwsSig = toString(jwsSig);\n\n  if (!isValidJws(jwsSig))\n    return null;\n\n  var header = headerFromJWS(jwsSig);\n\n  if (!header)\n    return null;\n\n  var payload = payloadFromJWS(jwsSig);\n  if (header.typ === 'JWT' || opts.json)\n    payload = JSON.parse(payload, opts.encoding);\n\n  return {\n    header: header,\n    payload: payload,\n    signature: signatureFromJWS(jwsSig)\n  };\n}\n\nfunction VerifyStream(opts) {\n  opts = opts || {};\n  var secretOrKey = opts.secret||opts.publicKey||opts.key;\n  var secretStream = new DataStream(secretOrKey);\n  this.readable = true;\n  this.algorithm = opts.algorithm;\n  this.encoding = opts.encoding;\n  this.secret = this.publicKey = this.key = secretStream;\n  this.signature = new DataStream(opts.signature);\n  this.secret.once('close', function () {\n    if (!this.signature.writable && this.readable)\n      this.verify();\n  }.bind(this));\n\n  this.signature.once('close', function () {\n    if (!this.secret.writable && this.readable)\n      this.verify();\n  }.bind(this));\n}\nutil.inherits(VerifyStream, Stream);\nVerifyStream.prototype.verify = function verify() {\n  try {\n    var valid = jwsVerify(this.signature.buffer, this.algorithm, this.key.buffer);\n    var obj = jwsDecode(this.signature.buffer, this.encoding);\n    this.emit('done', valid, obj);\n    this.emit('data', valid);\n    this.emit('end');\n    this.readable = false;\n    return valid;\n  } catch (e) {\n    this.readable = false;\n    this.emit('error', e);\n    this.emit('close');\n  }\n};\n\nVerifyStream.decode = jwsDecode;\nVerifyStream.isValid = isValidJws;\nVerifyStream.verify = jwsVerify;\n\nmodule.exports = VerifyStream;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvandzL2xpYi92ZXJpZnktc3RyZWFtLmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0EsYUFBYSw0RkFBNkI7QUFDMUMsaUJBQWlCLG1CQUFPLENBQUMsa0VBQWU7QUFDeEMsVUFBVSxtQkFBTyxDQUFDLDhDQUFLO0FBQ3ZCLGFBQWEsbUJBQU8sQ0FBQyxzQkFBUTtBQUM3QixlQUFlLG1CQUFPLENBQUMsNERBQVk7QUFDbkMsV0FBVyxtQkFBTyxDQUFDLGtCQUFNO0FBQ3pCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1IsY0FBYztBQUNkOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmFicmljc2hvcC8uL25vZGVfbW9kdWxlcy9qd3MvbGliL3ZlcmlmeS1zdHJlYW0uanM/ZTMzMSJdLCJzb3VyY2VzQ29udGVudCI6WyIvKmdsb2JhbCBtb2R1bGUqL1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyO1xudmFyIERhdGFTdHJlYW0gPSByZXF1aXJlKCcuL2RhdGEtc3RyZWFtJyk7XG52YXIgandhID0gcmVxdWlyZSgnandhJyk7XG52YXIgU3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJyk7XG52YXIgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3Rvc3RyaW5nJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciBKV1NfUkVHRVggPSAvXlthLXpBLVowLTlcXC1fXSs/XFwuW2EtekEtWjAtOVxcLV9dKz9cXC4oW2EtekEtWjAtOVxcLV9dKyk/JC87XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KHRoaW5nKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGhpbmcpID09PSAnW29iamVjdCBPYmplY3RdJztcbn1cblxuZnVuY3Rpb24gc2FmZUpzb25QYXJzZSh0aGluZykge1xuICBpZiAoaXNPYmplY3QodGhpbmcpKVxuICAgIHJldHVybiB0aGluZztcbiAgdHJ5IHsgcmV0dXJuIEpTT04ucGFyc2UodGhpbmcpOyB9XG4gIGNhdGNoIChlKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbn1cblxuZnVuY3Rpb24gaGVhZGVyRnJvbUpXUyhqd3NTaWcpIHtcbiAgdmFyIGVuY29kZWRIZWFkZXIgPSBqd3NTaWcuc3BsaXQoJy4nLCAxKVswXTtcbiAgcmV0dXJuIHNhZmVKc29uUGFyc2UoQnVmZmVyLmZyb20oZW5jb2RlZEhlYWRlciwgJ2Jhc2U2NCcpLnRvU3RyaW5nKCdiaW5hcnknKSk7XG59XG5cbmZ1bmN0aW9uIHNlY3VyZWRJbnB1dEZyb21KV1MoandzU2lnKSB7XG4gIHJldHVybiBqd3NTaWcuc3BsaXQoJy4nLCAyKS5qb2luKCcuJyk7XG59XG5cbmZ1bmN0aW9uIHNpZ25hdHVyZUZyb21KV1MoandzU2lnKSB7XG4gIHJldHVybiBqd3NTaWcuc3BsaXQoJy4nKVsyXTtcbn1cblxuZnVuY3Rpb24gcGF5bG9hZEZyb21KV1MoandzU2lnLCBlbmNvZGluZykge1xuICBlbmNvZGluZyA9IGVuY29kaW5nIHx8ICd1dGY4JztcbiAgdmFyIHBheWxvYWQgPSBqd3NTaWcuc3BsaXQoJy4nKVsxXTtcbiAgcmV0dXJuIEJ1ZmZlci5mcm9tKHBheWxvYWQsICdiYXNlNjQnKS50b1N0cmluZyhlbmNvZGluZyk7XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWRKd3Moc3RyaW5nKSB7XG4gIHJldHVybiBKV1NfUkVHRVgudGVzdChzdHJpbmcpICYmICEhaGVhZGVyRnJvbUpXUyhzdHJpbmcpO1xufVxuXG5mdW5jdGlvbiBqd3NWZXJpZnkoandzU2lnLCBhbGdvcml0aG0sIHNlY3JldE9yS2V5KSB7XG4gIGlmICghYWxnb3JpdGhtKSB7XG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcihcIk1pc3NpbmcgYWxnb3JpdGhtIHBhcmFtZXRlciBmb3IgandzLnZlcmlmeVwiKTtcbiAgICBlcnIuY29kZSA9IFwiTUlTU0lOR19BTEdPUklUSE1cIjtcbiAgICB0aHJvdyBlcnI7XG4gIH1cbiAgandzU2lnID0gdG9TdHJpbmcoandzU2lnKTtcbiAgdmFyIHNpZ25hdHVyZSA9IHNpZ25hdHVyZUZyb21KV1MoandzU2lnKTtcbiAgdmFyIHNlY3VyZWRJbnB1dCA9IHNlY3VyZWRJbnB1dEZyb21KV1MoandzU2lnKTtcbiAgdmFyIGFsZ28gPSBqd2EoYWxnb3JpdGhtKTtcbiAgcmV0dXJuIGFsZ28udmVyaWZ5KHNlY3VyZWRJbnB1dCwgc2lnbmF0dXJlLCBzZWNyZXRPcktleSk7XG59XG5cbmZ1bmN0aW9uIGp3c0RlY29kZShqd3NTaWcsIG9wdHMpIHtcbiAgb3B0cyA9IG9wdHMgfHwge307XG4gIGp3c1NpZyA9IHRvU3RyaW5nKGp3c1NpZyk7XG5cbiAgaWYgKCFpc1ZhbGlkSndzKGp3c1NpZykpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgdmFyIGhlYWRlciA9IGhlYWRlckZyb21KV1MoandzU2lnKTtcblxuICBpZiAoIWhlYWRlcilcbiAgICByZXR1cm4gbnVsbDtcblxuICB2YXIgcGF5bG9hZCA9IHBheWxvYWRGcm9tSldTKGp3c1NpZyk7XG4gIGlmIChoZWFkZXIudHlwID09PSAnSldUJyB8fCBvcHRzLmpzb24pXG4gICAgcGF5bG9hZCA9IEpTT04ucGFyc2UocGF5bG9hZCwgb3B0cy5lbmNvZGluZyk7XG5cbiAgcmV0dXJuIHtcbiAgICBoZWFkZXI6IGhlYWRlcixcbiAgICBwYXlsb2FkOiBwYXlsb2FkLFxuICAgIHNpZ25hdHVyZTogc2lnbmF0dXJlRnJvbUpXUyhqd3NTaWcpXG4gIH07XG59XG5cbmZ1bmN0aW9uIFZlcmlmeVN0cmVhbShvcHRzKSB7XG4gIG9wdHMgPSBvcHRzIHx8IHt9O1xuICB2YXIgc2VjcmV0T3JLZXkgPSBvcHRzLnNlY3JldHx8b3B0cy5wdWJsaWNLZXl8fG9wdHMua2V5O1xuICB2YXIgc2VjcmV0U3RyZWFtID0gbmV3IERhdGFTdHJlYW0oc2VjcmV0T3JLZXkpO1xuICB0aGlzLnJlYWRhYmxlID0gdHJ1ZTtcbiAgdGhpcy5hbGdvcml0aG0gPSBvcHRzLmFsZ29yaXRobTtcbiAgdGhpcy5lbmNvZGluZyA9IG9wdHMuZW5jb2Rpbmc7XG4gIHRoaXMuc2VjcmV0ID0gdGhpcy5wdWJsaWNLZXkgPSB0aGlzLmtleSA9IHNlY3JldFN0cmVhbTtcbiAgdGhpcy5zaWduYXR1cmUgPSBuZXcgRGF0YVN0cmVhbShvcHRzLnNpZ25hdHVyZSk7XG4gIHRoaXMuc2VjcmV0Lm9uY2UoJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5zaWduYXR1cmUud3JpdGFibGUgJiYgdGhpcy5yZWFkYWJsZSlcbiAgICAgIHRoaXMudmVyaWZ5KCk7XG4gIH0uYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5zaWduYXR1cmUub25jZSgnY2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLnNlY3JldC53cml0YWJsZSAmJiB0aGlzLnJlYWRhYmxlKVxuICAgICAgdGhpcy52ZXJpZnkoKTtcbiAgfS5iaW5kKHRoaXMpKTtcbn1cbnV0aWwuaW5oZXJpdHMoVmVyaWZ5U3RyZWFtLCBTdHJlYW0pO1xuVmVyaWZ5U3RyZWFtLnByb3RvdHlwZS52ZXJpZnkgPSBmdW5jdGlvbiB2ZXJpZnkoKSB7XG4gIHRyeSB7XG4gICAgdmFyIHZhbGlkID0gandzVmVyaWZ5KHRoaXMuc2lnbmF0dXJlLmJ1ZmZlciwgdGhpcy5hbGdvcml0aG0sIHRoaXMua2V5LmJ1ZmZlcik7XG4gICAgdmFyIG9iaiA9IGp3c0RlY29kZSh0aGlzLnNpZ25hdHVyZS5idWZmZXIsIHRoaXMuZW5jb2RpbmcpO1xuICAgIHRoaXMuZW1pdCgnZG9uZScsIHZhbGlkLCBvYmopO1xuICAgIHRoaXMuZW1pdCgnZGF0YScsIHZhbGlkKTtcbiAgICB0aGlzLmVtaXQoJ2VuZCcpO1xuICAgIHRoaXMucmVhZGFibGUgPSBmYWxzZTtcbiAgICByZXR1cm4gdmFsaWQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aGlzLnJlYWRhYmxlID0gZmFsc2U7XG4gICAgdGhpcy5lbWl0KCdlcnJvcicsIGUpO1xuICAgIHRoaXMuZW1pdCgnY2xvc2UnKTtcbiAgfVxufTtcblxuVmVyaWZ5U3RyZWFtLmRlY29kZSA9IGp3c0RlY29kZTtcblZlcmlmeVN0cmVhbS5pc1ZhbGlkID0gaXNWYWxpZEp3cztcblZlcmlmeVN0cmVhbS52ZXJpZnkgPSBqd3NWZXJpZnk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmVyaWZ5U3RyZWFtO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/jws/lib/verify-stream.js\n");

/***/ })

};
;