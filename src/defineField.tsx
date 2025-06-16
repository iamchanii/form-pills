import type { StandardSchemaV1 } from '@standard-schema/spec';
import type React from 'react';
import { Suspense, useMemo } from 'react';
import { FieldNameProvider, useFieldName } from './fieldName';
import type {
  FieldNameHelper,
  FieldOptions,
  FieldRenderCtx,
  FieldResult,
} from './types';

export function defineField<
  TName extends string,
  TSchema extends StandardSchemaV1,
  TArgs extends unknown[] = [],
  TResult = React.ReactNode,
  TProps extends object = {},
>(
  options: FieldOptions<TSchema, TName, TArgs, TResult, TProps>,
): FieldResult<TSchema, TName, TArgs, TResult, TProps> {
  const { name, schema, render, getDefaultValues, fallback } = options;

  const FieldContent: React.FC<TProps> = (props) => {
    const parent = useFieldName();
    const base = parent || name;

    const ctx: FieldRenderCtx<TSchema, TName> = useMemo(() => {
      const helper: FieldNameHelper<
        TName,
        StandardSchemaV1.InferOutput<TSchema>
      > = ((p?: string) => [base, p].filter(Boolean).join('.')) as any;
      return { name, schema, getFieldName: helper };
    }, [base]);

    return <>{render(ctx, props) as React.ReactNode}</>;
  };

  const Field: React.FC<TProps> = (props) => {
    const body = (
      <FieldNameProvider name={name}>
        <FieldContent {...props} />
      </FieldNameProvider>
    );
    return fallback ? (
      <Suspense fallback={fallback as React.ReactNode}>{body}</Suspense>
    ) : (
      body
    );
  };

  return Object.assign(Field, {
    fieldShape: { [name]: schema } as const,
    getDefaultValues: (...a: TArgs) =>
      getDefaultValues ? { [name]: getDefaultValues(...a) } : undefined,
    extends: (extra: Partial<typeof options>) =>
      defineField({ ...options, ...extra }),
  }) as unknown as FieldResult<TSchema, TName, TArgs, TResult, TProps>;
}
