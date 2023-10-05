"use strict";
exports.__esModule = true;
exports.SOURCE_FORMAT_UNKNOWN = exports.SOURCE_FORMAT_TYPED_ARRAY = exports.SOURCE_FORMAT_KEYED_COLUMNS = exports.SOURCE_FORMAT_OBJECT_ROWS = exports.SOURCE_FORMAT_ARRAY_ROWS = exports.SOURCE_FORMAT_ORIGINAL = void 0;
var UNDEFINED = 'undefined';
exports.SOURCE_FORMAT_ORIGINAL = 'original';
exports.SOURCE_FORMAT_ARRAY_ROWS = 'arrayRows';
exports.SOURCE_FORMAT_OBJECT_ROWS = 'objectRows';
exports.SOURCE_FORMAT_KEYED_COLUMNS = 'keyedColumns';
exports.SOURCE_FORMAT_TYPED_ARRAY = 'typedArray';
exports.SOURCE_FORMAT_UNKNOWN = 'unknown';
var dataCtors = {
    'float': typeof Float64Array === UNDEFINED
        ? Array : Float64Array,
    'int': typeof Int32Array === UNDEFINED
        ? Array : Int32Array,
    'ordinal': Array,
    'number': Array,
    'time': Array
};
//# sourceMappingURL=types.js.map