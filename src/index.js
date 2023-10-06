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
exports.map = exports.aggregate = exports.id = void 0;
var id_1 = require("./id");
Object.defineProperty(exports, "id", { enumerable: true, get: function () { return id_1.transform; } });
var aggregate_1 = require("./aggregate");
Object.defineProperty(exports, "aggregate", { enumerable: true, get: function () { return aggregate_1.transform; } });
var map_1 = require("./map");
Object.defineProperty(exports, "map", { enumerable: true, get: function () { return map_1.transform; } });
