import { Button } from '@/components/ui/button';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { FormProvider, useForm } from 'react-hook-form';
import * as v from 'valibot';
import { AddressField } from './fields/address-field';
import { EmailField } from './fields/email-field';
import { UsernameField } from './fields/username-field';

const formSchema = v.object({
  ...UsernameField.fieldShape,
  ...EmailField.fieldShape,
  ...AddressField.fieldShape,
});

type FormSchemaType = v.InferOutput<typeof formSchema>;

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
        <form onSubmit={onSubmit} className="space-y-4 w-72">
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
