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

export const UsernameField = defineField<{ label: string }>()({
  name: 'username',
  schema: z.string().min(1, 'Username is required'),
  getDefaultValues: () => 'John',
  render: (context, props) => {
    type FieldShape = InferFieldShape<typeof context>;
    const name = useFieldName(context);

    return (
      <FormField<FieldShape, 'username'>
        name={name()}
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
