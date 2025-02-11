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

export interface CreateFieldsRenderProps<
	TFieldsShape,
	TFieldName extends string,
> {
	name?: TFieldName;
	value?: TFieldsShape;
	onChange?: (values: TFieldsShape) => void;
}

export interface CreateFieldsOptions<
	TFieldsShape,
	TFieldName extends string,
	TProps,
	TRenderResult,
> {
	name: TFieldName;
	schema: StandardSchemaV1<TFieldsShape>;
	defaultValues?: DefaultValues<TFieldsShape>;
	fallback?: TRenderResult;
	render: (
		props: CreateFieldsRenderProps<TFieldsShape, TFieldName> & TProps,
	) => TRenderResult;
}

export interface CreateFieldsResult<
	TFieldsShape,
	TFieldName extends string,
	TProps,
	TRenderResult,
> {
	(
		props: CreateFieldsRenderProps<TFieldsShape, TFieldName> & TProps,
	): TRenderResult;
	schemaShape: { [key in TFieldName]: StandardSchemaV1<TFieldsShape> };
	getDefaultValue: () =>
		| { [key in TFieldName]: DefaultValues<TFieldsShape> }
		| undefined;
}
