import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type InferFieldShape, defineField, useFieldName } from 'form-pills';
import { z } from 'zod';

export const EmailField = defineField()({
  name: 'email',
  schema: z.string().email('Invalid email address'),
  getDefaultValues: () => 'john@example.com',
  render: (context) => {
    type FieldShape = InferFieldShape<typeof context>;
    const name = useFieldName(context);

    return (
      <FormField<FieldShape, 'email'>
        name={name()}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
});
