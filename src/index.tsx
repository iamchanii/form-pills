import type { StandardSchemaV1 } from '@standard-schema/spec';
import type {
	CreateFieldsOptions,
	CreateFieldsRenderProps,
	CreateFieldsResult,
	DefaultValues,
} from './types';
import { Suspense } from 'react';

export function createFields<TProps extends object = object>() {
	return function createFieldsImpl<TFieldsShape, TFieldName extends string>({
		name,
		schema,
		defaultValues,
		fallback,
		render: Render,
	}: CreateFieldsOptions<
		TFieldsShape,
		TFieldName,
		TProps,
		React.ReactNode
	>): CreateFieldsResult<TFieldsShape, TFieldName, TProps, React.ReactNode> {
		const Field = fallback
			? (props: CreateFieldsRenderProps<TFieldsShape, TFieldName> & TProps) => (
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
				[key in TFieldName]: StandardSchemaV1<TFieldsShape>;
			},
		});

		return FieldResult;
	};
}
