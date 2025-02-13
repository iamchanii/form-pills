import type { StandardSchemaV1 } from '@standard-schema/spec';
import type {
	DefineFieldOptions,
	DefineFieldRenderProps,
	DefineFieldResult,
	DefaultValues,
} from './types';
import { Suspense } from 'react';

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
		const Field = fallback
			? (props: DefineFieldRenderProps<TSchema, TFieldName> & TProps) => (
					<Suspense fallback={fallback}>
						<Render {...props} />
					</Suspense>
				)
			: Render;

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

export type { InferFieldShape } from './types';
