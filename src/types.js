"use strict";
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOURCE_FORMAT_UNKNOWN = exports.SOURCE_FORMAT_TYPED_ARRAY = exports.SOURCE_FORMAT_KEYED_COLUMNS = exports.SOURCE_FORMAT_OBJECT_ROWS = exports.SOURCE_FORMAT_ARRAY_ROWS = exports.SOURCE_FORMAT_ORIGINAL = void 0;
/* global Float64Array, Int32Array */
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
    // Ordinal data type can be string or int
    'ordinal': Array,
    'number': Array,
    'time': Array
};
