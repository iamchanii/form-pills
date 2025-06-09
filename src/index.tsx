import type { StandardSchemaV1 } from '@standard-schema/spec';
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
      const { name: parentFieldName } = useContext(FieldNameContext);
      const baseName = parentFieldName ?? name;

      const context = useMemo(() => {
        const getFieldName: FieldNameHelper<
          TFieldName,
          StandardSchemaV1.InferOutput<TSchema>
        > = (fieldName?: TFieldName) =>
          [baseName, fieldName].filter(Boolean).join('.') as never;

        return {
          name,
          schema,
          getFieldName,
        } satisfies DefineFieldRenderContext<TSchema, TFieldName>;
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
      getDefaultValues: (...args: TGetDefaultValuesArgs) => {
        if (!getDefaultValues) return undefined;

        if (name) {
          return { [name]: getDefaultValues(...args) };
        }

        return getDefaultValues(...args);
      },
      fieldShape: name ? { [name]: schema } : schema,
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

export type { InferFieldShape, InferFieldSchema } from './types';
