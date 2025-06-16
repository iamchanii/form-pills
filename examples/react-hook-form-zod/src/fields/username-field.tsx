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

export const UsernameField = defineField({
  name: 'username',
  schema: z.string().min(1, 'Username is required'),
  getDefaultValues: () => 'John',
  render: (context, props: { label: string }) => {
    type FieldShape = InferFieldShape<typeof context>;

    return (
      <FormField<FieldShape, 'username'>
        name={context.getFieldName()}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{props.label}</FormLabel>
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
