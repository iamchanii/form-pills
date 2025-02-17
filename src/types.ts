import type { StandardSchemaV1 } from '@standard-schema/spec';

// Vendoring from react-hook-form
declare const $NestedValue: unique symbol;

type NestedValue<TValue extends object = object> = {
  [$NestedValue]: never;
} & TValue;

type BrowserNativeObject = Date | FileList | File;

type ExtractObjects<T> = T extends infer U
  ? U extends object
  ? U
  : never
  : never;

type DeepPartial<T> = T extends BrowserNativeObject | NestedValue
  ? T
  : {
    [K in keyof T]?: ExtractObjects<T[K]> extends never
    ? T[K]
    : DeepPartial<T[K]>;
  };

type AsyncDefaultValues<TFieldValues> = (
  payload?: unknown,
) => Promise<TFieldValues>;

export type DefaultValues<TFieldValues> =
  TFieldValues extends AsyncDefaultValues<TFieldValues>
  ? DeepPartial<Awaited<TFieldValues>>
  : DeepPartial<TFieldValues>;

type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined
  | any[];

type KeysOfUnion<T> = T extends T ? keyof T : never;

type KeyOfFieldShape<T> = T extends Primitive
  ? string | number
  : KeysOfUnion<T>;

export interface FieldNameHelper<TFieldNamePrefix extends string, TFieldShape> {
  (): TFieldNamePrefix;
  <TFieldName extends KeyOfFieldShape<TFieldShape> & (string | number)>(
    fieldName?: TFieldName,
  ): [TFieldName] extends [never]
    ? TFieldNamePrefix
    : TFieldNamePrefix extends ''
    ? TFieldName
    : `${TFieldNamePrefix}.${TFieldName}`;
}

export interface DefineFieldRenderContext<
  TSchema extends StandardSchemaV1,
  TFieldName extends string,
> {
  parentFieldName?: string;
  name: TFieldName;
  schema: TSchema;
}

export interface DefineFieldOptions<
  TSchema extends StandardSchemaV1,
  TFieldName extends string,
  TGetDefaultValuesArgs extends unknown[],
  TRenderResult,
  TProps,
> {
  name: TFieldName;
  schema: TSchema;
  getDefaultValues?: (
    ...args: TGetDefaultValuesArgs
  ) => DefaultValues<StandardSchemaV1.InferOutput<TSchema>>;
  render: (
    context: DefineFieldRenderContext<TSchema, TFieldName>,
    props: TProps,
  ) => TRenderResult;
}

export interface DefineFieldResult<
  TSchema extends StandardSchemaV1,
  TFieldName extends string,
  TGetDefaultValuesArgs extends unknown[],
  TRenderResult,
  TProps,
> {
  (props: TProps): TRenderResult;
  schemaShape: { [key in TFieldName]: TSchema };
  getDefaultValues: (...args: TGetDefaultValuesArgs) => {
    [key in TFieldName]: DefaultValues<StandardSchemaV1.InferOutput<TSchema>>;
  };
}

type InferFieldShapeFromDefineFieldResult<T> = T extends DefineFieldResult<
  infer Schema,
  any,
  any,
  any,
  any
>
  ? NonNullable<StandardSchemaV1.InferOutput<Schema>>
  : never;

type InferFieldShapeFromDefineFieldRenderContext<T> =
  T extends DefineFieldRenderContext<infer Schema, any>
  ? NonNullable<StandardSchemaV1.InferOutput<Schema>>
  : never;

export type InferFieldShape<T> =
  | InferFieldShapeFromDefineFieldResult<T>
  | InferFieldShapeFromDefineFieldRenderContext<T>;

type InferParentFieldShapeFromDefineFieldResult<T> =
  T extends DefineFieldResult<infer Schema, infer FieldName, any, any, any>
  ? { [key in FieldName]: NonNullable<StandardSchemaV1.InferOutput<Schema>> }
  : never;

type InferParentFieldShapeFromDefineFieldRenderContext<T> =
  T extends DefineFieldRenderContext<infer Schema, infer FieldName>
  ? { [key in FieldName]: NonNullable<StandardSchemaV1.InferOutput<Schema>> }
  : never;

export type InferParentFieldShape<T> =
  | InferParentFieldShapeFromDefineFieldResult<T>
  | InferParentFieldShapeFromDefineFieldRenderContext<T>;
