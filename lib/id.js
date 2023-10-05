"use strict";
exports.__esModule = true;
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
//# sourceMappingURL=id.js.map