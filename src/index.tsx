import type { StandardSchemaV1 } from '@standard-schema/spec';
import type React from 'react';
import { Suspense, createContext, useContext, useMemo } from 'react';
import type {
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

  const value = useMemo(
    () => ({ name: [parentFieldName, props.name].filter(Boolean).join('.') }),
    [parentFieldName, props.name],
  );

  return (
    <FieldNameContext.Provider value={value}>
      {props.children}
    </FieldNameContext.Provider>
  );
}

export function defineField<
  TFieldName extends string,
  TSchema extends StandardSchemaV1,
  TGetDefaultValuesArgs extends unknown[] = [],
  TResult extends React.ReactNode = React.ReactNode,
  TProps extends object = {},
>(
  options: DefineFieldOptions<
    TSchema,
    TFieldName,
    TGetDefaultValuesArgs,
    TResult,
    TProps
  >,
): DefineFieldResult<
  TSchema,
  TFieldName,
  TGetDefaultValuesArgs,
  TResult,
  TProps
> {
  const { name, schema, render, getDefaultValues, fallback } = options;

  const FieldContent = (props: TProps): React.ReactNode => {
    const { name: parentFieldName } = useContext(FieldNameContext);
    const base = parentFieldName ?? name;

    const context = useMemo<
      DefineFieldRenderContext<TSchema, TFieldName>
    >(() => {
      const getFieldName = ((path?: string) =>
        [base, path].filter(Boolean).join('.')) as FieldNameHelper<
        TFieldName,
        StandardSchemaV1.InferOutput<TSchema>
      >;

      return { name, schema, getFieldName } satisfies DefineFieldRenderContext<
        TSchema,
        TFieldName
      >;
    }, [base]);

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
    fieldShape: { [name]: schema } as const,
    getDefaultValues: (...args: TGetDefaultValuesArgs) =>
      getDefaultValues ? { [name]: getDefaultValues(...args) } : undefined,
    extends: (extra: Partial<typeof options>) =>
      defineField({ ...options, ...extra }),
  });

  return FieldResult as DefineFieldResult<
    TSchema,
    TFieldName,
    TGetDefaultValuesArgs,
    TResult,
    TProps
  >;
}

export type { InferFieldShape, InferFieldSchema } from './types';
