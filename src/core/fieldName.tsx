import { createContext, useContext } from 'react';
import type { FieldNameProviderProps } from './types';

export const FieldNameContext: React.Context<{ name?: string }> =
  createContext<{ name?: string }>({});

export const useFieldName = (): string =>
  useContext(FieldNameContext).name ?? '';

export const FieldNameProvider = ({
  name,
  children,
}: FieldNameProviderProps): React.ReactElement => {
  const parent = useFieldName();

  return (
    <FieldNameContext.Provider
      value={{ name: [parent, name].filter(Boolean).join('.') }}
    >
      {children}
    </FieldNameContext.Provider>
  );
};
