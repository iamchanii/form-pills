import type { StandardSchemaV1 } from '@standard-schema/spec';
import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';
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
    TGetDefaultValuesArgs extends unknown[],
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
    const { name, schema, getDefaultValues, render, fallback } = options;

    const FieldContent = (props: TProps) => {
      const getFieldName = useFieldName({
        name,
        schema,
      });

      const context: DefineFieldRenderContext<TSchema, TFieldName> = useMemo(
        () => ({
          name,
          schema,
          getFieldName,
        }),
        [getFieldName],
      );

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
      extends: (extendsOptions: any) =>
        defineFieldImpl({ ...options, ...extendsOptions }),
    });

    return FieldResult as DefineFieldResult<
      TSchema,
      TFieldName,
      TGetDefaultValuesArgs,
      React.ReactNode,
      TProps
    >;
  };
}

export function useFieldName<
  TDefineFieldRenderContext extends Omit<
    DefineFieldRenderContext<any, any>,
    'getFieldName'
  >,
>(context: TDefineFieldRenderContext) {
  const { name } = useContext(FieldNameContext);

  return useCallback(
    // @ts-expect-error
    (fieldName) => [name ?? context.name, fieldName].filter(Boolean).join('.'),
    [context, name],
  ) as TDefineFieldRenderContext extends DefineFieldRenderContext<
    infer Schema,
    infer FieldName
  >
    ? FieldNameHelper<FieldName, StandardSchemaV1.InferOutput<Schema>>
    : never;
}

export type { InferFieldShape, InferFieldSchema } from './types';
