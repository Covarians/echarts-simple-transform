"use strict";
exports.__esModule = true;
exports.quantile = exports.hasOwn = exports.assert = void 0;
function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
exports.assert = assert;
function hasOwn(own, prop) {
    return own.hasOwnProperty(prop);
}
exports.hasOwn = hasOwn;
function quantile(ascArr, p) {
    var H = (ascArr.length - 1) * p + 1;
    var h = Math.floor(H);
    var v = +ascArr[h - 1];
    var e = H - h;
    return e ? v + e * (ascArr[h] - v) : v;
}
exports.quantile = quantile;
//# sourceMappingURL=util.js.map