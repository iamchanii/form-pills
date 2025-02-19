import type { StandardSchemaV1 } from '@standard-schema/spec';

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
	TGetDefaultValuesArgs extends unknown[],
	TRenderResult,
	TProps,
> {
	name: TFieldName;
	schema: TSchema;
	getDefaultValues?: (
		...args: TGetDefaultValuesArgs
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
	TGetDefaultValuesArgs extends unknown[],
	TRenderResult,
	TProps,
> {
	(props: TProps): TRenderResult;
	fieldShape: { [key in TFieldName]: TSchema };
	getDefaultValues: (...args: TGetDefaultValuesArgs) => {
		[key in TFieldName]: StandardSchemaV1.InferOutput<TSchema>;
	};
	override: <
		TOverrideSchema extends StandardSchemaV1 = TSchema,
		TOverrideFieldName extends string = TFieldName,
		TOverrideGetDefaultValuesArgs extends unknown[] = TGetDefaultValuesArgs,
		TOverrideProps = TProps,
	>(
		options: Partial<
			DefineFieldOptions<
				TOverrideSchema,
				TOverrideFieldName,
				TOverrideGetDefaultValuesArgs,
				TRenderResult,
				TOverrideProps
			>
		>,
	) => DefineFieldResult<
		TOverrideSchema,
		TOverrideFieldName,
		TOverrideGetDefaultValuesArgs,
		TRenderResult,
		TOverrideProps
	>;
}

type InferFieldSchemaFromDefineFieldResult<T> = T extends DefineFieldResult<
	infer Schema,
	any,
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
