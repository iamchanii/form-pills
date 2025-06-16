import type { StandardSchemaV1 } from '@standard-schema/spec';

type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined
  | any[];

type Keys<T> = T extends T ? keyof T : never;

type Join<
  Key extends string | number,
  Path extends string | number,
> = Path extends '' | never ? `${Key}` : `${Key}.${Path}`;

export type Paths<
  T,
  Depth extends ReadonlyArray<never> = [],
> = Depth['length'] extends 10
  ? string
  : T extends Primitive
    ? ''
    : {
        [K in Extract<Keys<T>, string>]: Join<
          K,
          Paths<T[K], [...Depth, never]>
        >;
      }[Extract<Keys<T>, string>];

export interface FieldNameHelper<Prefix extends string, Shape> {
  (): Prefix;
  <P extends Paths<Shape>>(path: P): Prefix extends '' ? P : `${Prefix}.${P}`;
}

// Public APIs
export interface FieldRenderCtx<
  TSchema extends StandardSchemaV1,
  TName extends string,
> {
  name: TName;
  schema: TSchema;
  getFieldName: FieldNameHelper<TName, StandardSchemaV1.InferOutput<TSchema>>;
}

export interface FieldOptions<
  TSchema extends StandardSchemaV1,
  TName extends string,
  Args extends unknown[],
  TResult,
  TProps,
> {
  name: TName;
  schema: TSchema;
  getDefaultValues?: (...args: Args) => StandardSchemaV1.InferOutput<TSchema>;
  render: (ctx: FieldRenderCtx<TSchema, TName>, props: TProps) => TResult;
  fallback?: TResult;
}

export interface FieldResult<
  TSchema extends StandardSchemaV1,
  TName extends string,
  Args extends unknown[],
  TResult,
  TProps,
> {
  (props: TProps): TResult;
  fieldShape: { [K in TName]: TSchema };
  getDefaultValues: (...args: Args) => {
    [K in TName]: StandardSchemaV1.InferOutput<TSchema>;
  };
  extends: (
    opt: Partial<FieldOptions<TSchema, TName, Args, TResult, TProps>>,
  ) => FieldResult<TSchema, TName, Args, TResult, TProps>;
}

export type InferFieldSchema<T> = T extends FieldResult<
  infer TSchema extends StandardSchemaV1,
  any,
  any,
  any,
  any
>
  ? NonNullable<StandardSchemaV1.InferOutput<TSchema>>
  : T extends FieldRenderCtx<infer TSchema extends StandardSchemaV1, any>
    ? NonNullable<StandardSchemaV1.InferOutput<TSchema>>
    : never;

export type InferFieldShape<T> = T extends FieldResult<
  infer TSchema extends StandardSchemaV1,
  infer TName,
  any,
  any,
  any
>
  ? { [K in TName]: NonNullable<StandardSchemaV1.InferOutput<TSchema>> }
  : T extends FieldRenderCtx<
        infer TSchema extends StandardSchemaV1,
        infer TName
      >
    ? { [K in TName]: NonNullable<StandardSchemaV1.InferOutput<TSchema>> }
    : never;

export type FieldNameProviderProps = {
  name: string;
  children: any;
};
