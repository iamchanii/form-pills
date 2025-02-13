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

export interface DefineFieldResultProps<
	TSchema extends StandardSchemaV1,
	TFieldName extends string,
	TFieldShape = StandardSchemaV1.InferOutput<TSchema>,
> {
	name?: TFieldName;
	value?: TFieldShape;
	onChange?: (values: TFieldShape) => void;
}

export interface DefineFieldRenderProps<
	TSchema extends StandardSchemaV1,
	TFieldName extends string,
	TFieldShape = StandardSchemaV1.InferOutput<TSchema>,
> extends Omit<
		DefineFieldResultProps<TSchema, TFieldName, TFieldShape>,
		'name'
	> {
	name: TFieldName;
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
		props: DefineFieldRenderProps<TSchema, TFieldName> & TProps,
	) => TRenderResult;
}

export interface DefineFieldResult<
	TSchema extends StandardSchemaV1,
	TFieldName extends string,
	TGetDefaultValuesArgs extends unknown[],
	TRenderResult,
	TProps,
> {
	(props: DefineFieldResultProps<TSchema, TFieldName> & TProps): TRenderResult;
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
	? StandardSchemaV1.InferOutput<Schema>
	: never;

export type InferSchemaShape<T> = T extends DefineFieldResult<
	infer Schema,
	infer FieldName,
	any,
	any,
	any
>
	? { [key in FieldName]: StandardSchemaV1.InferOutput<Schema> }
	: never;
