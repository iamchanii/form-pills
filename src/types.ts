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

export interface FieldNameHelper<
	TAvailableFieldNames,
	TFieldNamePrefix extends string = '',
> {
	(): TFieldNamePrefix;
	<TFieldName extends TAvailableFieldNames & string>(
		fieldName?: TFieldName,
	): TFieldNamePrefix extends ''
		? TFieldName
		: `${TFieldNamePrefix}.${TFieldName}`;
}

export interface DefineFieldRenderContext<
	TFieldName extends string,
	TAvailableFieldNames,
> {
	name: FieldNameHelper<TAvailableFieldNames, TFieldName>;
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
	fallback?: TRenderResult;
	render: (
		context: DefineFieldRenderContext<
			TFieldName,
			keyof StandardSchemaV1.InferOutput<TSchema>
		>,
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

export type InferFieldShape<T> = T extends DefineFieldResult<
	infer Schema,
	any,
	any,
	any,
	any
>
	? NonNullable<StandardSchemaV1.InferOutput<Schema>>
	: never;

export type InferParentFieldShape<T> = T extends DefineFieldResult<
	infer Schema,
	infer FieldName,
	any,
	any,
	any
>
	? { [key in FieldName]: NonNullable<StandardSchemaV1.InferOutput<Schema>> }
	: never;
