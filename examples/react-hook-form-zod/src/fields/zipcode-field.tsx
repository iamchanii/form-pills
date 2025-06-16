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

export const ZipcodeField = defineField({
  name: 'zipcode',
  schema: z.string().min(5, 'Zip code must be at least 5 characters'),
  getDefaultValues: () => '10001',
  render: (context) => {
    type FieldShape = InferFieldShape<typeof context>;

    return (
      <FormField<FieldShape, 'zipcode'>
        name={context.getFieldName()}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Zip Code</FormLabel>
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
