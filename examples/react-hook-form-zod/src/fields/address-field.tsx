import { defineField } from 'form-pills';
import { z } from 'zod';
import { CityField } from './city-field';
import { ZipcodeField } from './zipcode-field';

export const AddressField = defineField({
  name: 'address',
  schema: z.object({
    ...CityField.fieldShape,
    ...ZipcodeField.fieldShape,
  }),
  getDefaultValues: () => ({
    ...CityField.getDefaultValues(),
    ...ZipcodeField.getDefaultValues(),
  }),
  render: () => {
    return (
      <>
        <CityField />
        <ZipcodeField />
      </>
    );
  },
});
