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
