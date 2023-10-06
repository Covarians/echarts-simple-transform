import {
    DataTransformOption, DimensionLoose, DimensionName, DimensionIndex, ExternalDataTransform,
    ExternalDimensionDefinition, ExternalSource, OptionDataValue, OptionSourceDataArrayRows
} from './types';

export interface MapTransformOption extends DataTransformOption {
    type: 'aexviewTransform:map';
    config: {
        // Mandatory
        resultDimensions: {
            // Optional. The name of the result dimensions.
            // If not provided, inherit the name from `from`.
            name: DimensionName;
            // Mandatory. `from` is used to reference dimension from `source`.
            from: DimensionIndex;
            // Optional. Map function to apply to the dimension.
            method: Function;
        }[];
    
    };
}

// Echart transform to apply a map function to  a dimension
export const transform: ExternalDataTransform<MapTransformOption> = {

    type: 'ecSimpleTransform:map',

    transform: function (params) {
        const upstream = params.upstream;
        const config = params.config;
        const resultDimensions = config.resultDimensions;

        const dimsDef = upstream.cloneAllDimensionInfo() as ExternalDimensionDefinition[];

        const data = upstream.cloneRawData() as OptionSourceDataArrayRows;
        const resultData: OptionSourceDataArrayRows = [];

        for (let i = 0; i < data.length; i++) {
            const dataItem = data[i];
            const resultDataItem: OptionSourceDataArrayRows[number] = [];
            for (let j = 0; j < resultDimensions.length; j++) {
                const resultDimension = resultDimensions[j];
                const fromDimension = resultDimension.from;
                const method = resultDimension.method;
                const value = dataItem[fromDimension];
                const resultValue = method(value);
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
