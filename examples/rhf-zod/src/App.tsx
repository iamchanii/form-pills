import './App.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { defineField, useFieldName } from 'form-pills';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const TestField = defineField()({
  name: 'test',
  schema: z.string(),
  getDefaultValues: () => '',
  render: (context) => {
    const name = useFieldName(context);
    useState(1);
    return <p>{name()}</p>;
  },
});

const NestedObjectField = defineField<{ color: string }>()({
  name: 'nestedObject',
  schema: z.object({
    username: z.string(),
    starCount: z.number(),
    ...TestField.schemaShape,
  }),
  // getDefaultValues: (defaultStarCount?: number) => ({
  // 	username: 'a',
  // 	starCount: defaultStarCount,
  // 	...TestField.getDefaultValues(),
  // }),
  render: (context, { color }) => {
    const name = useFieldName(context);

    name('username');

    // @ts-expect-error
    name('invalidKey');

    return (
      <div>
        <p>color: {color}</p>

        <input type="text" />

        <input type="number" inputMode="numeric" />

        <TestField />
      </div>
    );
  },
});

const formSchema = z.object({
  ...NestedObjectField.schemaShape,
});

type FormSchemaType = z.infer<typeof formSchema>;

function App() {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...NestedObjectField.getDefaultValues(),
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    console.log(values.nestedObject);
  });

  return (
    <form onSubmit={onSubmit}>
      <Controller<FormSchemaType, 'nestedObject'>
        name="nestedObject"
        control={form.control}
        render={({ field }) => <NestedObjectField color="sss" {...field} />}
      />

      <button type="submit">Submit</button>
    </form>
  );
}

export default App;
