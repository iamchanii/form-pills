import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type InferFieldShape, defineField } from 'form-pills';
import * as v from 'valibot';

export const EmailField = defineField()({
  name: 'email',
  schema: v.pipe(v.string(), v.email('Invalid email address')),
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
