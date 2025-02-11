import './App.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFields } from 'form-pills';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const NestedObjectFields = createFields<{ color: string }>()({
	name: 'nestedObject',
	schema: z.object({
		username: z.string(),
		starCount: z.number(),
	}),
	defaultValues: {
		username: '',
		starCount: 0,
	},
	render: ({ color, value, onChange }) => {
		return (
			<div>
				<p>color: {color}</p>

				<input
					type="text"
					value={value?.username}
					onChange={(e) => onChange?.({ ...value, username: e.target.value })}
				/>

				<input
					type="number"
					inputMode="numeric"
					value={value?.starCount}
					onChange={(e) =>
						onChange?.({ ...value, starCount: e.target.valueAsNumber })
					}
				/>
			</div>
		);
	},
});

const formSchema = z.object({
	...NestedObjectFields.schemaShape,
});

type FormSchemaType = z.infer<typeof formSchema>;

function App() {
	const form = useForm<FormSchemaType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			...NestedObjectFields.getDefaultValue(),
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
				render={({ field }) => <NestedObjectFields color="red" {...field} />}
			/>

			<button type="submit">Submit</button>
		</form>
	);
}

export default App;
