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

export interface DefineFieldRenderProps<
	TFieldsShape,
	TFieldName extends string,
> {
	name?: TFieldName;
	value: TFieldsShape;
	onChange: (values: TFieldsShape) => void;
}

export interface DefineFieldOptions<
	TFieldsShape,
	TSchema extends StandardSchemaV1<TFieldsShape>,
	TFieldName extends string,
	TProps,
	TRenderResult,
> {
	name: TFieldName;
	schema: TSchema;
	defaultValues?: DefaultValues<TFieldsShape>;
	fallback?: TRenderResult;
	render: (
		props: DefineFieldRenderProps<TFieldsShape, TFieldName> & TProps,
	) => TRenderResult;
}

export interface DefineFieldResult<
	TFieldsShape,
	TSchema extends StandardSchemaV1<TFieldsShape>,
	TFieldName extends string,
	TProps,
	TRenderResult,
> {
	(
		props: DefineFieldRenderProps<TFieldsShape, TFieldName> & TProps,
	): TRenderResult;
	schemaShape: { [key in TFieldName]: TSchema };
	getDefaultValue: () =>
		| { [key in TFieldName]: DefaultValues<TFieldsShape> }
		| undefined;
}
