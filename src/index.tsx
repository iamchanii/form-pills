import type { StandardSchemaV1 } from '@standard-schema/spec';
import {
	createContext,
	Suspense,
	useCallback,
	useContext,
	useMemo,
} from 'react';
import type {
	DefaultValues,
	DefineFieldOptions,
	DefineFieldRenderContext,
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
		render,
		fallback,
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
		const FieldContent = (
			props: TProps & DefineFieldResultProps<TFieldName>,
		) => {
			const context = useMemo<DefineFieldRenderContext<TSchema, TFieldName>>(
				() => ({ name: (props.overrideName || name) as TFieldName, schema }),
				[props.overrideName, name, schema],
			);

			return <>{render(context, props)}</>;
		};

		const Field = (
			props: TProps & DefineFieldResultProps<TFieldName>,
		): React.ReactNode => {
			const { name: parentFieldName } = useContext(FieldNameContext);

			const children = (
				<FieldNameContext.Provider
					value={{
						name: [parentFieldName, props.overrideName || name]
							.filter(Boolean)
							.join('.'),
					}}
				>
					<FieldContent {...props} />
				</FieldNameContext.Provider>
			);

			if (fallback) {
				return <Suspense fallback={fallback}>{children}</Suspense>;
			}

			return children;
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
	TDefineFieldRenderContext extends DefineFieldRenderContext<any, any>,
>(context: TDefineFieldRenderContext) {
	const { name } = useContext(FieldNameContext);

	return useCallback(
		// @ts-expect-error
		(fieldName) => [name || context.name, fieldName].filter(Boolean).join('.'),
		[context, name],
	) as TDefineFieldRenderContext extends DefineFieldRenderContext<
		infer Schema,
		infer FieldName
	>
		? FieldNameHelper<FieldName, StandardSchemaV1.InferOutput<Schema>>
		: never;
}

export type { InferFieldShape, InferParentFieldShape } from './types';
