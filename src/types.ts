import type { StandardSchemaV1 } from '@standard-schema/spec';

export type DeepOptional<T> = T extends Date | Function
	? T
	: T extends (infer R)[]
		? DeepOptional<R>[]
		: T extends Record<PropertyKey, any>
			? {
					[K in keyof T]?: DeepOptional<T[K]>;
				}
			: T;

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
	name: TFieldName;
	schema: TSchema;
}

export interface DefineFieldOptions<
	TSchema extends StandardSchemaV1,
	TFieldName extends string,
	TRenderResult,
	TProps,
> {
	name: TFieldName;
	schema: TSchema;
	getDefaultValues?: (
		defaultValues?: DeepOptional<StandardSchemaV1.InferOutput<TSchema>>,
	) => StandardSchemaV1.InferOutput<TSchema>;
	render: (
		context: DefineFieldRenderContext<TSchema, TFieldName>,
		props: TProps,
	) => TRenderResult;
	fallback?: TRenderResult;
}

export interface DefineFieldResult<
	TSchema extends StandardSchemaV1,
	TFieldName extends string,
	TRenderResult,
	TProps,
> {
	(props: TProps): TRenderResult;
	fieldShape: { [key in TFieldName]: TSchema };
	getDefaultValues: (
		defaultValues?: DeepOptional<StandardSchemaV1.InferOutput<TSchema>>,
	) => {
		[key in TFieldName]: StandardSchemaV1.InferOutput<TSchema>;
	};
	extends: <
		TExtendSchema extends StandardSchemaV1 = TSchema,
		TExtendFieldName extends string = TFieldName,
	>(
		options: Partial<
			DefineFieldOptions<TExtendSchema, TExtendFieldName, TRenderResult, TProps>
		>,
	) => DefineFieldResult<
		TExtendSchema,
		TExtendFieldName,
		TRenderResult,
		TProps
	>;
}

type InferFieldSchemaFromDefineFieldResult<T> = T extends DefineFieldResult<
	infer Schema,
	any,
	any,
	any
>
	? NonNullable<StandardSchemaV1.InferOutput<Schema>>
	: never;

type InferFieldSchemaFromDefineFieldRenderContext<T> =
	T extends DefineFieldRenderContext<infer Schema, any>
		? NonNullable<StandardSchemaV1.InferOutput<Schema>>
		: never;

export type InferFieldSchema<T> =
	| InferFieldSchemaFromDefineFieldResult<T>
	| InferFieldSchemaFromDefineFieldRenderContext<T>;

type InferFieldShapeFromDefineFieldResult<T> = T extends DefineFieldResult<
	infer Schema,
	infer FieldName,
	any,
	any
>
	? { [key in FieldName]: NonNullable<StandardSchemaV1.InferOutput<Schema>> }
	: never;

type InferFieldShapeFromDefineFieldRenderContext<T> =
	T extends DefineFieldRenderContext<infer Schema, infer FieldName>
		? { [key in FieldName]: NonNullable<StandardSchemaV1.InferOutput<Schema>> }
		: never;

export type InferFieldShape<T> =
	| InferFieldShapeFromDefineFieldResult<T>
	| InferFieldShapeFromDefineFieldRenderContext<T>;

export interface FieldNameProviderProps {
	name: string;
	children: any;
}
