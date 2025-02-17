import type { StandardSchemaV1 } from '@standard-schema/spec';
import {
	Suspense,
	createContext,
	useCallback,
	useContext,
	useMemo,
} from 'react';
import type {
	DefaultValues,
	DefineFieldOptions,
	DefineFieldRenderContext,
	DefineFieldResult,
	FieldNameHelper,
} from './types';

const FieldNameContext = createContext<{ name?: string }>({});

export function defineField<TProps extends object = object>() {
	return function defineFieldImpl<
		TSchema extends StandardSchemaV1,
		TFieldName extends string,
		TGetDefaultValuesArgs extends unknown[],
	>({
		name,
		schema,
		getDefaultValues,
		fallback,
		render,
	}: DefineFieldOptions<
		TSchema,
		TFieldName,
		TGetDefaultValuesArgs,
		React.ReactNode,
		TProps
	>): DefineFieldResult<
		TSchema,
		TFieldName,
		TGetDefaultValuesArgs,
		React.ReactNode,
		TProps
	> {
		const Field = (props: TProps): React.ReactNode => {
			const { name: accumulatedFieldName } = useContext(FieldNameContext);

			const context = useMemo<DefineFieldRenderContext<TSchema, TFieldName>>(
				() => ({ name, schema }),
				[name, schema],
			);

			const renderResult = (
				<FieldNameContext.Provider
					value={{
						name: [accumulatedFieldName, name].filter(Boolean).join('.'),
					}}
				>
					{render(context, props)}
				</FieldNameContext.Provider>
			);

			if (fallback) {
				return <Suspense fallback={fallback}>{renderResult}</Suspense>;
			}

			return renderResult;
		};

		const FieldResult = Object.assign(Field, {
			getDefaultValues: ((...args: TGetDefaultValuesArgs) =>
				getDefaultValues
					? { [name]: getDefaultValues(...args) }
					: undefined) as (...args: TGetDefaultValuesArgs) => {
				[key in TFieldName]: DefaultValues<
					StandardSchemaV1.InferOutput<TSchema>
				>;
			},
			schemaShape: { [name]: schema } as {
				[key in TFieldName]: TSchema;
			},
		});

		return FieldResult;
	};
}

export function useFieldName<TDefineFieldRenderContext>(
	_context: TDefineFieldRenderContext,
) {
	const { name } = useContext(FieldNameContext);

	return useCallback(
		// @ts-expect-error
		(fieldName) => [name, fieldName].filter(Boolean).join('.'),
		[name],
	) as TDefineFieldRenderContext extends DefineFieldRenderContext<
		infer Schema,
		infer FieldName
	>
		? FieldNameHelper<FieldName, StandardSchemaV1.InferOutput<Schema>>
		: never;
}

export type { InferFieldShape, InferParentFieldShape } from './types';
