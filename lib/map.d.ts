import { DataTransformOption, DimensionLoose, DimensionName, ExternalDataTransform } from './types';
export interface MapTransformOption extends DataTransformOption {
    type: 'aexviewTransform:map';
    config: {
        resultDimensions: {
            name: DimensionName;
            from: DimensionLoose;
            method: Function;
        }[];
    };
}
export declare const transform: ExternalDataTransform<MapTransformOption>;
