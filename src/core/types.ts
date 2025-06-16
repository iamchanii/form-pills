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

type Join<K extends string | number, P extends string | number> = P extends
  | ''
  | never
  ? `${K}`
  : `${K}.${P}`;

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
export interface FieldRenderCtx<S extends StandardSchemaV1, N extends string> {
  name: N;
  schema: S;
  getFieldName: FieldNameHelper<N, StandardSchemaV1.InferOutput<S>>;
}

export interface FieldOptions<
  S extends StandardSchemaV1,
  N extends string,
  Args extends unknown[],
  Result,
  Props,
> {
  name: N;
  schema: S;
  getDefaultValues?: (...args: Args) => StandardSchemaV1.InferOutput<S>;
  render: (ctx: FieldRenderCtx<S, N>, props: Props) => Result;
  fallback?: Result;
}

export interface FieldResult<
  S extends StandardSchemaV1,
  N extends string,
  Args extends unknown[],
  Result,
  Props,
> {
  (props: Props): Result;
  fieldShape: { [K in N]: S };
  getDefaultValues: (...args: Args) => {
    [K in N]: StandardSchemaV1.InferOutput<S>;
  };
  extends: (
    opt: Partial<FieldOptions<S, N, Args, Result, Props>>,
  ) => FieldResult<S, N, Args, Result, Props>;
}

export type InferFieldSchema<T> = T extends FieldResult<
  infer S extends StandardSchemaV1,
  any,
  any,
  any,
  any
>
  ? NonNullable<StandardSchemaV1.InferOutput<S>>
  : T extends FieldRenderCtx<infer S extends StandardSchemaV1, any>
    ? NonNullable<StandardSchemaV1.InferOutput<S>>
    : never;

export type InferFieldShape<T> = T extends FieldResult<
  infer S extends StandardSchemaV1,
  infer N,
  any,
  any,
  any
>
  ? { [K in N]: NonNullable<StandardSchemaV1.InferOutput<S>> }
  : T extends FieldRenderCtx<infer S extends StandardSchemaV1, infer N>
    ? { [K in N]: NonNullable<StandardSchemaV1.InferOutput<S>> }
    : never;

export type FieldNameProviderProps = {
  name: string;
  children: any;
};
