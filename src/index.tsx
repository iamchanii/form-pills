import type { StandardSchemaV1 } from '@standard-schema/spec';
import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import type {
  DefaultValues,
  DefineFieldOptions,
  DefineFieldRenderContext,
  DefineFieldResult,
  FieldNameHelper,
} from './types';

const FieldNameContext = createContext<{ name?: string }>({});

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
    render,
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
    const Field = (props: TProps): React.ReactNode => {
      const { name: parentFieldName } = useContext(FieldNameContext);

      const context = useMemo<DefineFieldRenderContext<TSchema, TFieldName>>(
        () => ({ parentFieldName, name, schema }),
        [parentFieldName, name, schema],
      );

      const Render = () => render(context, props);

      const RenderResult = () => (
        <FieldNameContext.Provider
          value={{
            name: parentFieldName ? `${parentFieldName}.${name}` : name,
          }}
        >
          <Render />
        </FieldNameContext.Provider>
      );

      if (fallback) {
        return (
          <Suspense fallback={fallback}>
            <RenderResult />
          </Suspense>
        );
      }

      return <RenderResult />;
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

export function useFieldName<
  TDefineFieldRenderContext extends DefineFieldRenderContext<any, any>,
>(context: TDefineFieldRenderContext) {
  const { name: parentFieldName } = useContext(FieldNameContext);

  return useCallback(
    // @ts-expect-error
    (fieldName) =>
      [parentFieldName, context.name, fieldName].filter(Boolean).join('.'),
    [parentFieldName, context],
  ) as TDefineFieldRenderContext extends DefineFieldRenderContext<
    infer Schema,
    infer FieldName
  >
    ? FieldNameHelper<FieldName, StandardSchemaV1.InferOutput<Schema>>
    : never;
}

export type { InferFieldShape, InferParentFieldShape } from './types';
