import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type InferFieldShape, defineField, useFieldName } from 'form-pills';
import * as v from 'valibot';

export const ZipcodeField = defineField()({
  name: 'zipcode',
  schema: v.pipe(
    v.string(),
    v.minLength(5, 'Zip code must be at least 5 characters'),
  ),
  getDefaultValues: () => '10001',
  render: (context) => {
    type FieldShape = InferFieldShape<typeof context>;
    const name = useFieldName(context);

    return (
      <FormField<FieldShape, 'zipcode'>
        name={name()}
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
