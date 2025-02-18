# form-pills

💊 Encapsulates form fields like a pill!

## Features

- Define a field's name, validation schema, default values, and UI all in one place.
- Easily build complex forms by nesting field definitions with providers and dynamic name generation.
- Leverage TypeScript and [Standard Schema](https://github.com/standard-schema/standard-schema) for automatic type inference and data validation.
- Create self-contained, reusable field components that reduce code duplication.
- Seamlessly integrate with libraries like react-hook-form and Zod for efficient form state management and validation.
- Enjoy a clear, straightforward API.
- Lightweight bundle size (brotli < 1.4kB).

## Installation

```
$ npm i form-pills
$ yarn add form-pills
$ pnpm add form-pills
```

## Quick Start

```tsx
import { defineField, useFieldName, type InferParentFieldShape } from 'form-pills';

const UsernameField = defineField()({
  name: 'username',

  // You can use any schema validation library that supports Standard Schema!
  // Zod:
  schema: z.string().min(1),
  // Valibot:
  schema: v.pipe(v.string(), v.nonEmpty()),

  getDefaultValues: () => 'John',

  render: (context) => {
    type ParentFieldShape = InferParentFieldShape<typeof context>
    // ^? { username: string }

    const name = useFieldName();
    // name() === 'username'

    // Here you can write integrated with form library UI code
  },
})
```

## Examples

- [React Hook Form + Zod](./examples/react-hook-form-zod/)

## License

MIT
