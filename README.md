# form-pills

![](https://badgen.net/npm/v/form-pills)
![](https://badgen.net/npm/dt/form-pills)
![](https://badgen.net/bundlephobia/minzip/form-pills) 
![](https://badgen.net/npm/license/form-pills)

💊 Encapsulates form fields like a pill!

## Features

- **All-in-One Definition**: Define a field's name, validation schema, default values, and UI in a single, unified declaration.
- **Modular Complexity**: Effortlessly build complex forms by nesting field definitions with providers and dynamic name generation.
- **Smart Type Inference**: Harness the power of TypeScript and Standard Schema for automatic type inference and robust data validation.
- **Reusable Components**: Create self-contained field components that encapsulate logic and minimize code duplication.
- **Seamless Integration**: Easily integrate with popular libraries like react-hook-form and Zod for efficient form state management and validation.
- **Intuitive API**: Enjoy a clear, straightforward API that makes form development a breeze.
- **Ultra-Lightweight**: Benefit from an exceptionally small bundle size, ensuring fast load times and minimal overhead.

## Installation

```
$ npm i form-pills
$ yarn add form-pills
$ pnpm add form-pills
```

## Quick Start

```tsx
import { defineField, type InferFieldShape } from 'form-pills';

const UsernameField = defineField()({
  name: 'username',

  // You can use any schema validation library that supports Standard Schema!
  // Zod:
  schema: z.string().min(1),
  // Valibot:
  schema: v.pipe(v.string(), v.nonEmpty()),

  getDefaultValues: () => 'John',

  render: (context) => {
    type FieldShape = InferFieldShape<typeof context>
    // ^? { username: string }

    const name = context.getFieldName();
    // name() === 'username'

    // Here you can write integrated with form and library UI code
  },
})
```

## API References

### Function

#### `defineField`

`defineField` is a generic function used to create a field component by specifying its name, validation schema, default values,
and UI render function—all in one place. It returns a function that not only renders the field component but also exposes:

- A `fieldShape` property representing the field's schema.
- A `getDefaultValues` function to retrieve the default values for the field.
- An `extends` method to extend or override parts of the field configuration.

**Example:**

```tsx
const MyField = defineField<{ label: string }>()({
  name: 'myField', // If you don't provide a name, this field will never affect the chain of field names.
  schema: mySchema,
  getDefaultValues: () => defaultValue,
  render: (context, props /* { label: string } */) => {
    // Your rendering logic here
  },
});

<MyField label="Hello!" /> // Render as a Component
MyField.fieldShape // { "myField": mySchema }
MyField.getDefaultValue() // Return default value
MyField.extends({ /* ... */ }) // Extend or override parts of the field
```


### Context

#### `getFieldName()`

The `context.getFieldName` method provides a helper function to generate full field names. This is particularly useful when working with nested fields, as it dynamically constructs field names by combining a prefix with the specific field identifier.

**Example:**

```tsx
const MyField = defineField()({
  name: 'myField',
  // ...
  render: (context, props) => {
    const fieldName = context.getFieldName();
    invariant(fieldName() === 'myField')
    invariant(fieldName('subField') === 'myField.subField')
  },
});
```

### Types

#### `InferFieldShape<T>`

`InferFieldShape<T>` is a utility type that infers the shape of a field from either a defined field result or a render context. It produces an object type where the key is the field's name and the value is the type derived from the field's validation schema.

**Example:**

```tsx
const MyField = defineField()({
  name: 'myField',
  schema: z.string(),
  render: (context, props) => {
    type FieldShape = InferFieldShape<typeof context>
    // ^? { myField: string }
  },
});

type FieldShape = InferFieldShape<typeof MyField>
// ^? { myField: string }
```

#### `InferFieldSchema<T>`

`InferFieldSchema<T>` is a utility type that infers the schema of a field from either a defined field result or a render context. It returns the type that is derived from the field's validation schema, helping ensure that your form components remain type-safe.

**Example:**

```tsx
const MyField = defineField()({
  name: 'myField',
  schema: z.string(),
  render: (context, props) => {
    type FieldSchema = InferFieldSchema<typeof context>
    // ^? string
  },
});

type FieldSchema = InferFieldSchema<typeof MyField>
// ^? string
```

### Components

#### `FieldNameProvider`

The `FieldNameProvider` component sets a field name prefix for nested fields. By wrapping nested field components, it dynamically composes their names based on the provided prefix, ensuring unique and context-aware naming across your form.

**Props:**

- **name** (`string`): The prefix to apply to all nested field names.

**Example:**

```tsx
<FieldNameProvider name="address">
  <CityField />
  <ZipField />
</FieldNameProvider>
```

In this example, `CityField` and `ZipField` will have their field names automatically prefixed, resulting in names like `address.city` and `address.zip`. This is useful when working with array fields.

## Examples

- [React Hook Form + Zod](./examples/react-hook-form-zod/) [(Open in StackBlitz)](https://stackblitz.com/github.com/iamchanii/form-pills/tree/main/examples/react-hook-form-zod)
- [React Hook Form + Valibot](./examples/react-hook-form-valibot/) [(Open in StackBlitz)](https://stackblitz.com/github.com/iamchanii/form-pills/tree/main/examples/react-hook-form-valibot)


## License

MIT
