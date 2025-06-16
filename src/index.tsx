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
  TProps extends object = {},
>(
  options: DefineFieldOptions<
    TSchema,
    TFieldName,
    TGetDefaultValuesArgs,
    React.ReactNode,
    TProps
  >,
): DefineFieldResult<
  TSchema,
  TFieldName,
  TGetDefaultValuesArgs,
  React.ReactNode,
  TProps
> {
  const { name, schema, render, getDefaultValues, fallback } = options;

  const FieldContent = (props: TProps): React.ReactNode => {
    const { name: parentFieldName } = useContext(FieldNameContext);
    const baseName = parentFieldName ?? name;

    const context = useMemo<
      DefineFieldRenderContext<TSchema, TFieldName>
    >(() => {
      const getFieldName = ((path?: string) =>
        [baseName, path].filter(Boolean).join('.')) as FieldNameHelper<
        TFieldName,
        StandardSchemaV1.InferOutput<TSchema>
      >;

      return { name, schema, getFieldName } satisfies DefineFieldRenderContext<
        TSchema,
        TFieldName
      >;
    }, [baseName]);

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
    getDefaultValues: (...args: TGetDefaultValuesArgs) =>
      getDefaultValues ? { [name]: getDefaultValues(...args) } : undefined,
    fieldShape: { [name]: schema },
    extends: (extendsOptions: Partial<typeof options>) =>
      defineField({ ...options, ...extendsOptions }),
  });

  return FieldResult as DefineFieldResult<
    TSchema,
    TFieldName,
    TGetDefaultValuesArgs,
    React.ReactNode,
    TProps
  >;
}

export type { InferFieldShape, InferFieldSchema } from './types';
