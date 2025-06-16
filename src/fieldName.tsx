import { createContext, useContext, useMemo } from 'react';
import type { FieldNameProviderProps } from './types';

export const FieldNameContext: React.Context<{ name?: string }> = createContext(
  {},
);

export const useFieldName = (): string =>
  useContext(FieldNameContext).name ?? '';

export const FieldNameProvider = ({
  name,
  children,
}: FieldNameProviderProps): React.ReactNode => {
  const parent = useFieldName();

  const value = useMemo(
    () => ({ name: [parent, name].filter(Boolean).join('.') }),
    [parent, name],
  );

  return (
    <FieldNameContext.Provider value={value}>
      {children}
    </FieldNameContext.Provider>
  );
};
