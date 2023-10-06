"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = void 0;
// Echart transform to apply a map function to  a dimension
exports.transform = {
    type: 'ecSimpleTransform:map',
    transform: function (params) {
        var upstream = params.upstream;
        var config = params.config;
        var resultDimensions = config.resultDimensions;
        var dimsDef = upstream.cloneAllDimensionInfo();
        var data = upstream.cloneRawData();
        var resultData = [];
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var resultDataItem = [];
            for (var j = 0; j < resultDimensions.length; j++) {
                var resultDimension = resultDimensions[j];
                var fromDimension = resultDimension.from;
                var method = resultDimension.method;
                var value = dataItem[fromDimension];
                var resultValue = method(value);
                resultDataItem.push(resultValue);
            }
            resultData.push(resultDataItem);
        }
        return {
            dimensions: dimsDef,
            data: resultData,
        };
    }
};
