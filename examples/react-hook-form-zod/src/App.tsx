import { Button } from '@/components/ui/button';
import { AddressField, EmailField, UsernameField } from '@/fields';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	...UsernameField.schemaShape,
	...EmailField.schemaShape,
	...AddressField.schemaShape,
});

type FormSchemaType = z.infer<typeof formSchema>;

export function App() {
	const form = useForm<FormSchemaType>({
		resolver: standardSchemaResolver(formSchema),
		mode: 'onChange',
		defaultValues: {
			...UsernameField.getDefaultValues(),
			...EmailField.getDefaultValues(),
			...AddressField.getDefaultValues(),
		},
	});

	const onSubmit = form.handleSubmit((values) => {
		console.log(values);
	});

	return (
		<div className="flex justify-center items-center h-screen">
			<FormProvider {...form}>
				<form onSubmit={onSubmit} className="space-y-4 w-90">
					<UsernameField label="Username" />
					<EmailField />
					<AddressField />

					<Button type="submit" size="lg" className="w-full">
						Submit
					</Button>
				</form>
			</FormProvider>
		</div>
	);
}
