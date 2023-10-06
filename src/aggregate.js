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
var util_1 = require("./util");
var METHOD_INTERNAL = {
    'SUM': true,
    'COUNT': true,
    'FIRST': true,
    'AVERAGE': true,
    'Q1': true,
    'Q2': true,
    'Q3': true,
    'MIN': true,
    'MAX': true
};
var METHOD_NEEDS_COLLECT = {
    AVERAGE: ['COUNT']
};
var METHOD_NEEDS_GATHER_VALUES = {
    Q1: true,
    Q2: true,
    Q3: true
};
var METHOD_ALIAS = {
    MEDIAN: 'Q2'
};
var ResultDimInfoInternal = /** @class */ (function () {
    function ResultDimInfoInternal(index, indexInUpstream, method, name, needGatherValues) {
        this.collectionInfoList = [];
        // FIXME: refactor
        this.gatheredValuesByGroup = {};
        this.gatheredValuesNoGroup = [];
        this.needGatherValues = false;
        this._collectionInfoMap = {};
        this.method = method;
        this.name = name;
        this.index = index;
        this.indexInUpstream = indexInUpstream;
        this.needGatherValues = needGatherValues;
    }
    ResultDimInfoInternal.prototype.addCollectionInfo = function (item) {
        this._collectionInfoMap[item.method] = this.collectionInfoList.length;
        this.collectionInfoList.push(item);
    };
    ResultDimInfoInternal.prototype.getCollectionInfo = function (method) {
        return this.collectionInfoList[this._collectionInfoMap[method]];
    };
    // FIXME: temp implementation. Need refactor.
    ResultDimInfoInternal.prototype.gatherValue = function (groupByDimInfo, groupVal, value) {
        // FIXME: convert to number compulsorily temporarily.
        value = +value;
        if (groupByDimInfo) {
            if (groupVal != null) {
                var groupValStr = groupVal + '';
                var values = this.gatheredValuesByGroup[groupValStr]
                    || (this.gatheredValuesByGroup[groupValStr] = []);
                values.push(value);
            }
        }
        else {
            this.gatheredValuesNoGroup.push(value);
        }
    };
    return ResultDimInfoInternal;
}());
exports.transform = {
    type: 'ecSimpleTransform:aggregate',
    transform: function (params) {
        var upstream = params.upstream;
        var config = params.config;
        var groupByDimInfo = prepareGroupByDimInfo(config, upstream);
        var _a = prepareDimensions(config, upstream, groupByDimInfo), finalResultDimInfoList = _a.finalResultDimInfoList, collectionDimInfoList = _a.collectionDimInfoList;
        // Collect
        var collectionResult;
        if (collectionDimInfoList.length) {
            collectionResult = travel(groupByDimInfo, upstream, collectionDimInfoList, createCollectionResultLine, updateCollectionResultLine);
        }
        for (var i = 0; i < collectionDimInfoList.length; i++) {
            var dimInfo = collectionDimInfoList[i];
            dimInfo.__collectionResult = collectionResult;
            // FIXME: just for Q1, Q2, Q3: need asc.
            asc(dimInfo.gatheredValuesNoGroup);
            var gatheredValuesByGroup = dimInfo.gatheredValuesByGroup;
            for (var key in gatheredValuesByGroup) {
                if ((0, util_1.hasOwn)(gatheredValuesByGroup, key)) {
                    asc(gatheredValuesByGroup[key]);
                }
            }
        }
        // Calculate
        var finalResult = travel(groupByDimInfo, upstream, finalResultDimInfoList, createFinalResultLine, updateFinalResultLine);
        var dimensions = [];
        for (var i = 0; i < finalResultDimInfoList.length; i++) {
            dimensions.push(finalResultDimInfoList[i].name);
        }
        return {
            dimensions: dimensions,
            data: finalResult.outList
        };
    }
};
function prepareDimensions(config, upstream, groupByDimInfo) {
    var resultDimensionsConfig = config.resultDimensions;
    var finalResultDimInfoList = [];
    var collectionDimInfoList = [];
    var gIndexInLine = 0;
    for (var i = 0; i < resultDimensionsConfig.length; i++) {
        var resultDimInfoConfig = resultDimensionsConfig[i];
        var dimInfoInUpstream = upstream.getDimensionInfo(resultDimInfoConfig.from);
        (0, util_1.assert)(dimInfoInUpstream, 'Can not find dimension by `from`: ' + resultDimInfoConfig.from);
        var rawMethod = resultDimInfoConfig.method;
        (0, util_1.assert)(groupByDimInfo.index !== dimInfoInUpstream.index || rawMethod == null, "Dimension ".concat(dimInfoInUpstream.name, " is the \"groupBy\" dimension, must not have any \"method\"."));
        var method = normalizeMethod(rawMethod);
        (0, util_1.assert)(method, 'method is required');
        var name_1 = resultDimInfoConfig.name != null ? resultDimInfoConfig.name : dimInfoInUpstream.name;
        var finalResultDimInfo = new ResultDimInfoInternal(finalResultDimInfoList.length, dimInfoInUpstream.index, method, name_1, (0, util_1.hasOwn)(METHOD_NEEDS_GATHER_VALUES, method));
        finalResultDimInfoList.push(finalResultDimInfo);
        // For collection.
        var needCollect = false;
        if ((0, util_1.hasOwn)(METHOD_NEEDS_COLLECT, method)) {
            needCollect = true;
            var collectionTargetMethods = METHOD_NEEDS_COLLECT[method];
            for (var j = 0; j < collectionTargetMethods.length; j++) {
                finalResultDimInfo.addCollectionInfo({
                    method: collectionTargetMethods[j],
                    indexInLine: gIndexInLine++
                });
            }
        }
        if ((0, util_1.hasOwn)(METHOD_NEEDS_GATHER_VALUES, method)) {
            needCollect = true;
        }
        if (needCollect) {
            collectionDimInfoList.push(finalResultDimInfo);
        }
    }
    return { collectionDimInfoList: collectionDimInfoList, finalResultDimInfoList: finalResultDimInfoList };
}
function prepareGroupByDimInfo(config, upstream) {
    var groupByConfig = config.groupBy;
    var groupByDimInfo;
    if (groupByConfig != null) {
        groupByDimInfo = upstream.getDimensionInfo(groupByConfig);
        (0, util_1.assert)(groupByDimInfo, 'Can not find dimension by `groupBy`: ' + groupByConfig);
    }
    return groupByDimInfo;
}
function travel(groupByDimInfo, upstream, resultDimInfoList, doCreate, doUpdate) {
    var outList = [];
    var mapByGroup;
    if (groupByDimInfo) {
        mapByGroup = {};
        for (var dataIndex = 0, len = upstream.count(); dataIndex < len; dataIndex++) {
            var groupByVal = upstream.retrieveValue(dataIndex, groupByDimInfo.index);
            // PENDING: when value is null/undefined
            if (groupByVal == null) {
                continue;
            }
            var groupByValStr = groupByVal + '';
            if (!(0, util_1.hasOwn)(mapByGroup, groupByValStr)) {
                var newLine = doCreate(upstream, dataIndex, resultDimInfoList, groupByDimInfo, groupByVal);
                outList.push(newLine);
                mapByGroup[groupByValStr] = newLine;
            }
            else {
                var targetLine = mapByGroup[groupByValStr];
                doUpdate(upstream, dataIndex, targetLine, resultDimInfoList, groupByDimInfo, groupByVal);
            }
        }
    }
    else {
        var targetLine = doCreate(upstream, 0, resultDimInfoList);
        outList.push(targetLine);
        for (var dataIndex = 1, len = upstream.count(); dataIndex < len; dataIndex++) {
            doUpdate(upstream, dataIndex, targetLine, resultDimInfoList);
        }
    }
    return { mapByGroup: mapByGroup, outList: outList };
}
function normalizeMethod(method) {
    if (method == null) {
        return 'FIRST';
    }
    var methodInternal = method.toUpperCase();
    methodInternal = (0, util_1.hasOwn)(METHOD_ALIAS, methodInternal)
        ? METHOD_ALIAS[methodInternal]
        : methodInternal;
    (0, util_1.assert)((0, util_1.hasOwn)(METHOD_INTERNAL, methodInternal), "Illegal method ".concat(method, "."));
    return methodInternal;
}
var createCollectionResultLine = function (upstream, dataIndex, collectionDimInfoList, groupByDimInfo, groupByVal) {
    var newLine = [];
    for (var i = 0; i < collectionDimInfoList.length; i++) {
        var dimInfo = collectionDimInfoList[i];
        var collectionInfoList = dimInfo.collectionInfoList;
        for (var j = 0; j < collectionInfoList.length; j++) {
            var collectionInfo = collectionInfoList[j];
            // FIXME: convert to number compulsorily temporarily.
            newLine[collectionInfo.indexInLine] = +lineCreator[collectionInfo.method](upstream, dataIndex, dimInfo, groupByDimInfo, groupByVal);
        }
        // FIXME: refactor
        if (dimInfo.needGatherValues) {
            var val = upstream.retrieveValue(dataIndex, dimInfo.indexInUpstream);
            dimInfo.gatherValue(groupByDimInfo, groupByVal, val);
        }
    }
    return newLine;
};
var updateCollectionResultLine = function (upstream, dataIndex, targetLine, collectionDimInfoList, groupByDimInfo, groupByVal) {
    for (var i = 0; i < collectionDimInfoList.length; i++) {
        var dimInfo = collectionDimInfoList[i];
        var collectionInfoList = dimInfo.collectionInfoList;
        for (var j = 0; j < collectionInfoList.length; j++) {
            var collectionInfo = collectionInfoList[j];
            var indexInLine = collectionInfo.indexInLine;
            // FIXME: convert to number compulsorily temporarily.
            targetLine[indexInLine] = +lineUpdater[collectionInfo.method](targetLine[indexInLine], upstream, dataIndex, dimInfo, groupByDimInfo, groupByVal);
        }
        // FIXME: refactor
        if (dimInfo.needGatherValues) {
            var val = upstream.retrieveValue(dataIndex, dimInfo.indexInUpstream);
            dimInfo.gatherValue(groupByDimInfo, groupByVal, val);
        }
    }
};
var createFinalResultLine = function (upstream, dataIndex, finalResultDimInfoList, groupByDimInfo, groupByVal) {
    var newLine = [];
    for (var i = 0; i < finalResultDimInfoList.length; i++) {
        var dimInfo = finalResultDimInfoList[i];
        var method = dimInfo.method;
        newLine[i] = isGroupByDimension(groupByDimInfo, dimInfo)
            ? groupByVal
            : lineCreator[method](upstream, dataIndex, dimInfo, groupByDimInfo, groupByVal);
    }
    return newLine;
};
var updateFinalResultLine = function (upstream, dataIndex, targetLine, finalResultDimInfoList, groupByDimInfo, groupByVal) {
    for (var i = 0; i < finalResultDimInfoList.length; i++) {
        var dimInfo = finalResultDimInfoList[i];
        if (isGroupByDimension(groupByDimInfo, dimInfo)) {
            continue;
        }
        var method = dimInfo.method;
        targetLine[i] = lineUpdater[method](targetLine[i], upstream, dataIndex, dimInfo, groupByDimInfo, groupByVal);
    }
};
function isGroupByDimension(groupByDimInfo, targetDimInfo) {
    return groupByDimInfo && targetDimInfo.indexInUpstream === groupByDimInfo.index;
}
function asc(list) {
    list.sort(function (a, b) {
        return a - b;
    });
}
var lineCreator = {
    'SUM': function (upstream, dataIndex, dimInfo) {
        return upstream.retrieveValue(dataIndex, dimInfo.indexInUpstream);
    },
    'COUNT': function () {
        return 1;
    },
    'FIRST': function (upstream, dataIndex, dimInfo) {
        return upstream.retrieveValue(dataIndex, dimInfo.indexInUpstream);
    },
    'MIN': function (upstream, dataIndex, dimInfo) {
        return upstream.retrieveValue(dataIndex, dimInfo.indexInUpstream);
    },
    'MAX': function (upstream, dataIndex, dimInfo) {
        return upstream.retrieveValue(dataIndex, dimInfo.indexInUpstream);
    },
    'AVERAGE': function (upstream, dataIndex, dimInfo, groupByDimInfo, groupByVal) {
        // FIXME: refactor, bad implementation.
        var collectLine = groupByDimInfo
            ? dimInfo.__collectionResult.mapByGroup[groupByVal + '']
            : dimInfo.__collectionResult.outList[0];
        return upstream.retrieveValue(dataIndex, dimInfo.indexInUpstream)
            / collectLine[dimInfo.getCollectionInfo('COUNT').indexInLine];
    },
    // FIXME: refactor
    'Q1': function (upstream, dataIndex, dimInfo, groupByDimInfo, groupByVal) {
        return lineCreatorForQ(0.25, dimInfo, groupByDimInfo, groupByVal);
    },
    'Q2': function (upstream, dataIndex, dimInfo, groupByDimInfo, groupByVal) {
        return lineCreatorForQ(0.5, dimInfo, groupByDimInfo, groupByVal);
    },
    'Q3': function (upstream, dataIndex, dimInfo, groupByDimInfo, groupByVal) {
        return lineCreatorForQ(0.75, dimInfo, groupByDimInfo, groupByVal);
    }
};
var lineUpdater = {
    'SUM': function (val, upstream, dataIndex, dimInfo) {
        // FIXME: handle other types
        return val + upstream.retrieveValue(dataIndex, dimInfo.indexInUpstream);
    },
    'COUNT': function (val) {
        return val + 1;
    },
    'FIRST': function (val) {
        return val;
    },
    'MIN': function (val, upstream, dataIndex, dimInfo) {
        return Math.min(val, upstream.retrieveValue(dataIndex, dimInfo.indexInUpstream));
    },
    'MAX': function (val, upstream, dataIndex, dimInfo) {
        return Math.max(val, upstream.retrieveValue(dataIndex, dimInfo.indexInUpstream));
    },
    'AVERAGE': function (val, upstream, dataIndex, dimInfo, groupByDimInfo, groupByVal) {
        // FIXME: refactor, bad implementation.
        var collectLine = groupByDimInfo
            ? dimInfo.__collectionResult.mapByGroup[groupByVal + '']
            : dimInfo.__collectionResult.outList[0];
        return val
            + upstream.retrieveValue(dataIndex, dimInfo.indexInUpstream)
                / collectLine[dimInfo.getCollectionInfo('COUNT').indexInLine];
    },
    'Q1': function (val, upstream, dataIndex, dimInfo) {
        return val;
    },
    'Q2': function (val, upstream, dataIndex, dimInfo) {
        return val;
    },
    'Q3': function (val, upstream, dataIndex, dimInfo) {
        return val;
    }
};
function lineCreatorForQ(percent, dimInfo, groupByDimInfo, groupByVal) {
    var gatheredValues = groupByDimInfo
        ? dimInfo.gatheredValuesByGroup[groupByVal + '']
        : dimInfo.gatheredValuesNoGroup;
    return (0, util_1.quantile)(gatheredValues, percent);
}
