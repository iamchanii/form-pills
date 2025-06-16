import type { StandardSchemaV1 } from '@standard-schema/spec';
import type React from 'react';
import { Suspense, useMemo } from 'react';
import { FieldNameProvider, useFieldName } from './core/fieldName';
import type {
  FieldNameHelper,
  FieldOptions,
  FieldRenderCtx,
  FieldResult,
} from './core/types';

export function defineField<
  N extends string,
  S extends StandardSchemaV1,
  Args extends unknown[] = [],
  Res = React.ReactNode,
  Props extends object = {},
>(
  options: FieldOptions<S, N, Args, Res, Props>,
): FieldResult<S, N, Args, Res, Props> {
  const { name, schema, render, getDefaultValues, fallback } = options;

  const FieldContent: React.FC<Props> = (props) => {
    const parent = useFieldName();
    const base = parent || name;

    const ctx: FieldRenderCtx<S, N> = useMemo(() => {
      const helper: FieldNameHelper<N, StandardSchemaV1.InferOutput<S>> = ((
        p?: string,
      ) => [base, p].filter(Boolean).join('.')) as any;
      return { name, schema, getFieldName: helper };
    }, [base]);

    return <>{render(ctx, props) as React.ReactNode}</>;
  };

  const Field: React.FC<Props> = (props) => {
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
    getDefaultValues: (...a: Args) =>
      getDefaultValues ? { [name]: getDefaultValues(...a) } : undefined,
    extends: (extra: Partial<typeof options>) =>
      defineField({ ...options, ...extra }),
  }) as unknown as FieldResult<S, N, Args, Res, Props>;
}
