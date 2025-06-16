import { defineField } from 'form-pills';
import * as v from 'valibot';
import { CityField } from './city-field';
import { ZipcodeField } from './zipcode-field';

export const AddressField = defineField({
  name: 'address',
  schema: v.object({
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
