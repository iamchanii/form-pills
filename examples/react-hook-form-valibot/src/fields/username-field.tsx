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

export const UsernameField = defineField<{ label: string }>()({
  name: 'username',
  schema: v.pipe(v.string(), v.minLength(1, 'Username is required')),
  getDefaultValues: () => 'John',
  render: (context, props) => {
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
