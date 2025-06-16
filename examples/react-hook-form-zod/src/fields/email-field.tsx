import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type InferFieldShape, defineField } from 'form-pills';
import { z } from 'zod';

export const EmailField = defineField({
  name: 'email',
  schema: z.string().email('Invalid email address'),
  getDefaultValues: () => 'john@example.com',
  render: (context) => {
    type FieldShape = InferFieldShape<typeof context>;

    return (
      <FormField<FieldShape, 'email'>
        name={context.getFieldName()}
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
