import type { StandardSchemaV1 } from '@standard-schema/spec';
import { Suspense } from 'react';
import type {
	DefaultValues,
	DefineFieldOptions,
	DefineFieldResult,
	DefineFieldResultProps,
} from './types';

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
			const renderResult = <Render {...props} name={props.name || name} />;

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

export type { InferFieldShape, InferSchemaShape } from './types';
