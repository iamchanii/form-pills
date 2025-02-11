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
		TFieldsShape,
		TSchema extends StandardSchemaV1<TFieldsShape>,
		TFieldName extends string,
	>({
		name,
		schema,
		defaultValues,
		fallback,
		render: Render,
	}: DefineFieldOptions<
		TFieldsShape,
		TSchema,
		TFieldName,
		TProps,
		React.ReactNode
	>): DefineFieldResult<
		TFieldsShape,
		TSchema,
		TFieldName,
		TProps,
		React.ReactNode
	> {
		const Field = fallback
			? (props: DefineFieldRenderProps<TFieldsShape, TFieldName> & TProps) => (
					<Suspense fallback={fallback}>
						<Render {...props} />
					</Suspense>
				)
			: Render;

		const FieldResult = Object.assign(Field, {
			getDefaultValue: () =>
				defaultValues
					? ({ [name]: defaultValues } as {
							[key in TFieldName]: DefaultValues<TFieldsShape>;
						})
					: undefined,
			schemaShape: { [name]: schema } as {
				[key in TFieldName]: TSchema;
			},
		});

		return FieldResult;
	};
}
