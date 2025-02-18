import './App.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { defineField, InferParentFieldShape, useFieldName } from 'form-pills';
import { use, useState } from 'react';
import {
	Controller,
	FormProvider,
	useForm,
	useFormContext,
} from 'react-hook-form';
import { z } from 'zod';

const promise = new Promise((resolve) => setTimeout(resolve, 1000));

const TestField = defineField()({
	name: 'test',
	schema: z.string(),
	getDefaultValues: () => '',
	fallback: 'loading...',
	render: (context) => {
		use(promise);
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
	getDefaultValues: () => ({
		username: 'a',
		starCount: 0,
		...TestField.getDefaultValues(),
	}),
	render: (context) => {
		type ParentFieldShape = InferParentFieldShape<typeof context>;
		const name = useFieldName(context);

		const { register } = useFormContext<ParentFieldShape>();

		return (
			<div>
				<input type="text" {...register(name('username'))} />
				<p>{name('username')}</p>

				<input
					type="number"
					inputMode="numeric"
					{...register(name('starCount'))}
				/>
				<p>{name('starCount')}</p>

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
		console.log(values);
	});

	return (
		<FormProvider {...form}>
			<form onSubmit={onSubmit}>
				<NestedObjectField color="red" />

				<button type="submit">Submit</button>
			</form>
		</FormProvider>
	);
}

export default App;
