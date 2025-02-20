import type { StandardSchemaV1 } from '@standard-schema/spec';
import { Suspense, createContext, useCallback, useContext } from 'react';
import type {
	DeepOptional,
	DefineFieldOptions,
	DefineFieldRenderContext,
	DefineFieldResult,
	FieldNameHelper,
	FieldNameProviderProps,
} from './types';

const FieldNameContext = createContext<{ name?: string }>({});

export function FieldNameProvider(
	props: FieldNameProviderProps,
): React.ReactElement {
	const { name: parentFieldName } = useContext(FieldNameContext);

	return (
		<FieldNameContext.Provider
			value={{
				name: [parentFieldName, props.name].filter(Boolean).join('.'),
			}}
		>
			{props.children}
		</FieldNameContext.Provider>
	);
}

export function defineField<TProps extends object = object>() {
	return function defineFieldImpl<
		TSchema extends StandardSchemaV1,
		TFieldName extends string,
	>(
		options: DefineFieldOptions<TSchema, TFieldName, React.ReactNode, TProps>,
	): DefineFieldResult<TSchema, TFieldName, React.ReactNode, TProps> {
		const { name, schema, getDefaultValues, render, fallback } = options;
		const context: DefineFieldRenderContext<TSchema, TFieldName> = {
			name,
			schema,
		};

		const FieldContent = (props: TProps) => {
			return <>{render(context, props)}</>;
		};

		const Field = (props: TProps): React.ReactNode => {
			const children = (
				<FieldNameProvider name={name}>
					<FieldContent {...props} />
				</FieldNameProvider>
			);

			if (fallback) {
				return <Suspense fallback={fallback}>{children}</Suspense>;
			}

			return children;
		};

		const FieldResult = Object.assign(Field, {
			getDefaultValues: (
				defaultValues?: DeepOptional<StandardSchemaV1.InferOutput<TSchema>>,
			) =>
				getDefaultValues
					? { [name]: getDefaultValues(defaultValues) }
					: undefined,
			fieldShape: { [name]: schema },
			extends: (overrideOptions: any) =>
				defineFieldImpl({ ...options, ...overrideOptions }),
		});

		return FieldResult as DefineFieldResult<
			TSchema,
			TFieldName,
			React.ReactNode,
			TProps
		>;
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

export type {
	InferFieldShape,
	InferFieldSchema,
} from './types';
