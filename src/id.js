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
exports.transform = void 0;
exports.transform = {
    type: 'ecSimpleTransform:id',
    transform: function (params) {
        var upstream = params.upstream;
        var config = params.config;
        var dimensionIndex = config.dimensionIndex;
        var dimensionName = config.dimensionName;
        var dimsDef = upstream.cloneAllDimensionInfo();
        dimsDef[dimensionIndex] = dimensionName;
        var data = upstream.cloneRawData();
        // TODO: support objectRows
        for (var i = 0, len = data.length; i < len; i++) {
            var line = data[i];
            line[dimensionIndex] = i;
        }
        return {
            dimensions: dimsDef,
            data: data
        };
    }
};
