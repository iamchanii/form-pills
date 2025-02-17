import type { StandardSchemaV1 } from '@standard-schema/spec';
import { createContext, Suspense, useContext, useMemo } from 'react';
import type {
	DefaultValues,
	DefineFieldOptions,
	DefineFieldResult,
	DefineFieldResultProps,
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
		render: Render,
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
		const Field = (
			props: DefineFieldResultProps<TSchema, TFieldName> & TProps,
		): React.ReactNode => {
			const { name: accumulatedFieldName } = useContext(FieldNameContext);

			const renderResult = (
				<FieldNameContext.Provider
					value={useMemo(
						() => ({
							name: [accumulatedFieldName, name].filter(Boolean).join('.'),
						}),
						[accumulatedFieldName, name],
					)}
				>
					<Render {...props} name={props.name || name} />
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

export function useFieldName<
	TFieldShape extends object = any,
>(): FieldNameHelper<TFieldShape> {
	const { name } = useContext(FieldNameContext);

	return ((fieldName?: string) =>
		[name, fieldName].filter(Boolean).join('.')) as never;
}

export type { InferFieldShape, InferParentFieldShape } from './types';
