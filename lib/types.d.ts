export type Dictionary<T> = {
    [key: string]: T;
};
export type DimensionIndex = number;
export type DimensionName = string;
export type DimensionIndexLoose = DimensionIndex | string;
export type DimensionLoose = DimensionName | DimensionIndexLoose;
export type DataTransformType = string;
export type DataTransformConfig = unknown;
export type ParsedValue = ParsedValueNumeric | OrdinalRawValue;
export type ParsedValueNumeric = number | OrdinalNumber;
export type OrdinalRawValue = string | number;
export type OrdinalNumber = number;
export declare const SOURCE_FORMAT_ORIGINAL: "original";
export declare const SOURCE_FORMAT_ARRAY_ROWS: "arrayRows";
export declare const SOURCE_FORMAT_OBJECT_ROWS: "objectRows";
export declare const SOURCE_FORMAT_KEYED_COLUMNS: "keyedColumns";
export declare const SOURCE_FORMAT_TYPED_ARRAY: "typedArray";
export declare const SOURCE_FORMAT_UNKNOWN: "unknown";
export type SourceFormat = typeof SOURCE_FORMAT_ORIGINAL | typeof SOURCE_FORMAT_ARRAY_ROWS | typeof SOURCE_FORMAT_OBJECT_ROWS | typeof SOURCE_FORMAT_KEYED_COLUMNS | typeof SOURCE_FORMAT_TYPED_ARRAY | typeof SOURCE_FORMAT_UNKNOWN;
declare const dataCtors: {
    float: ArrayConstructor | Float64ArrayConstructor;
    int: ArrayConstructor | Int32ArrayConstructor;
    ordinal: ArrayConstructor;
    number: ArrayConstructor;
    time: ArrayConstructor;
};
export type ListDimensionType = keyof typeof dataCtors;
export type DimensionDefinition = {
    type?: ListDimensionType;
    name?: DimensionName;
    displayName?: string;
};
export type DimensionDefinitionLoose = DimensionDefinition['name'] | DimensionDefinition;
export interface DataTransformOption {
    type: DataTransformType;
    config: DataTransformConfig;
    print?: boolean;
}
export type OptionDataValue = string | number | Date;
export type OptionSourceDataArrayRows<VAL extends OptionDataValue = OptionDataValue> = Array<Array<VAL>>;
export type OptionSourceDataObjectRows<VAL extends OptionDataValue = OptionDataValue> = Array<Dictionary<VAL>>;
export interface ExternalDataTransform<TO extends DataTransformOption = DataTransformOption> {
    type: string;
    __isBuiltIn?: boolean;
    transform: (param: ExternalDataTransformParam<TO>) => ExternalDataTransformResultItem | ExternalDataTransformResultItem[];
}
interface ExternalDataTransformParam<TO extends DataTransformOption = DataTransformOption> {
    upstream: ExternalSource;
    upstreamList: ExternalSource[];
    config: TO['config'];
}
export interface ExternalDataTransformResultItem {
    data: OptionSourceDataArrayRows | OptionSourceDataObjectRows;
    dimensions?: DimensionDefinitionLoose[];
}
export type DataTransformDataItem = ExternalDataTransformResultItem['data'][number];
export interface ExternalDimensionDefinition extends Partial<DimensionDefinition> {
    index: DimensionIndex;
}
export interface ExternalSource {
    sourceFormat: SourceFormat;
    getRawDataItem(dataIndex: number): number;
    getRawDataItem(dataIndex: number): DataTransformDataItem;
    cloneRawData(): OptionSourceDataArrayRows | OptionSourceDataObjectRows;
    getDimensionInfo(dim: DimensionLoose): ExternalDimensionDefinition;
    cloneAllDimensionInfo(): ExternalDimensionDefinition[];
    count(): number;
    retrieveValue(dataIndex: number, dimIndex: DimensionIndex): OptionDataValue;
    retrieveValueFromItem(dataItem: DataTransformDataItem, dimIndex: DimensionIndex): OptionDataValue;
    convertValue(rawVal: unknown, dimInfo: ExternalDimensionDefinition): ParsedValue;
}
export {};
