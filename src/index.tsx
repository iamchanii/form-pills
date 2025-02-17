import type { StandardSchemaV1 } from '@standard-schema/spec';
import { createContext, Suspense, useContext, useMemo } from 'react';
import type {
	DefaultValues,
	DefineFieldOptions,
	DefineFieldRenderContext,
	DefineFieldResult,
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

			const context = useMemo<
				DefineFieldRenderContext<
					TFieldName,
					keyof StandardSchemaV1.InferOutput<TSchema>
				>
			>(
				() => ({
					name: (fieldName) =>
						// @ts-expect-error
						[accumulatedFieldName, name, fieldName]
							.filter(Boolean)
							.join('.'),
				}),
				[accumulatedFieldName, name],
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

export type { InferFieldShape, InferParentFieldShape } from './types';
