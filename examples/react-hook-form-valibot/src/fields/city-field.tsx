import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type InferFieldShape, defineField } from 'form-pills';
import * as v from 'valibot';

export const CityField = defineField()({
  name: 'city',
  schema: v.pipe(v.string(), v.minLength(1, 'City is required')),
  getDefaultValues: () => 'New York',
  render: (context) => {
    type FieldShape = InferFieldShape<typeof context>;

    return (
      <FormField<FieldShape, 'city'>
        name={context.getFieldName()}
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <Select {...field} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {[
                  'New York',
                  'Los Angeles',
                  'Chicago',
                  'Houston',
                  'Phoenix',
                ].map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
});
