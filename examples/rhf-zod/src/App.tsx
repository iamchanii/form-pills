import './App.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { defineField, type InferFieldShape, useFieldName } from 'form-pills';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const TestField = defineField()({
	name: 'test',
	schema: z.string(),
	getDefaultValues: () => '',
	render: () => {
		const name = useFieldName();

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
	getDefaultValues: (defaultStarCount?: number) => ({
		username: 'a',
		starCount: defaultStarCount,
		...TestField.getDefaultValues(),
	}),
	render: ({ color, value, onChange }) => {
		return (
			<div>
				<p>color: {color}</p>

				<input
					type="text"
					value={value?.username}
					onChange={(e) =>
						onChange?.({
							...value!,
							username: e.target.value,
						})
					}
				/>

				<input
					type="number"
					inputMode="numeric"
					value={value?.starCount}
					onChange={(e) =>
						onChange?.({ ...value!, starCount: e.target.valueAsNumber })
					}
				/>

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
				render={({ field }) => <NestedObjectField color="red" {...field} />}
			/>

			<button type="submit">Submit</button>
		</form>
	);
}

export default App;
