import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const CityField = defineField()({
  name: 'city',
  schema: z.string().min(1, 'City is required'),
  getDefaultValues: () => 'New York',
  render: (context) => {
    type FieldShape = InferFieldShape<typeof context>;
    const name = useFieldName(context);

    return (
      <FormField<FieldShape, 'city'>
        name={name()}
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

export const AddressField = defineField()({
  name: 'address',
  schema: z.object({
    ...CityField.fieldShape,
    zip: z.string().min(5, 'Zip code must be at least 5 characters'),
  }),
  getDefaultValues: () => ({
    ...CityField.getDefaultValues(),
    zip: '10001',
  }),
  render: (context) => {
    type FieldShape = InferFieldShape<typeof context>;
    const name = useFieldName(context);

    return (
      <>
        <CityField />

        <FormField<FieldShape, 'address.zip'>
          name={name('zip')}
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
      </>
    );
  },
});
