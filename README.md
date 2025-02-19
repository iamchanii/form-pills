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
import { defineField, useFieldName, type InferFieldShape } from 'form-pills';

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

    const name = useFieldName();
    // name() === 'username'

    // Here you can write integrated with form and library UI code
  },
})
```

## Examples

- [React Hook Form + Zod](./examples/react-hook-form-zod/)

## License

MIT
