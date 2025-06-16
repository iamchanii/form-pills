import type { StandardSchemaV1 } from '@standard-schema/spec';
import type React from 'react';
import { Suspense, useMemo } from 'react';
import { FieldNameProvider, useFieldName } from './fieldName';
import type {
  DefineFieldOptions,
  DefineFieldRenderContext,
  DefineFieldResult,
  FieldNameHelper,
} from './types';

export function defineField<
  TName extends string,
  TSchema extends StandardSchemaV1,
  TArgs extends unknown[] = [],
  TResult extends React.ReactNode = React.ReactNode,
  TProps extends object = {},
>(
  options: DefineFieldOptions<TSchema, TName, TArgs, TResult, TProps>,
): DefineFieldResult<TSchema, TName, TArgs, TResult, TProps> {
  const { name, schema, render, getDefaultValues, fallback } = options;

  const FieldContent = (props: TProps): React.ReactNode => {
    const parent = useFieldName();
    const base = parent || name;

    const context = useMemo<DefineFieldRenderContext<TSchema, TName>>(() => {
      const getFieldName = ((path?: string) =>
        [base, path].filter(Boolean).join('.')) as FieldNameHelper<
        TName,
        StandardSchemaV1.InferOutput<TSchema>
      >;

      return { name, schema, getFieldName };
    }, [base]);

    return <>{render(context, props)}</>;
  };

  const Field = (props: TProps): React.ReactNode => {
    const body = (
      <FieldNameProvider name={name}>
        <FieldContent {...props} />
      </FieldNameProvider>
    );

    return fallback ? <Suspense fallback={fallback}>{body}</Suspense> : body;
  };

  return Object.assign(Field, {
    fieldShape: { [name]: schema } as const,
    getDefaultValues: (...args: TArgs) =>
      getDefaultValues ? { [name]: getDefaultValues(...args) } : undefined,
    extends: (extra: Partial<typeof options>) =>
      defineField({ ...options, ...extra }),
  }) as DefineFieldResult<TSchema, TName, TArgs, TResult, TProps>;
}
