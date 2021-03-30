import type { PrimitiveType } from 'intl-messageformat';
import { useIntl } from 'react-intl';

export function useCardFormatMessage<T = Record<string, string>>(
  type: string
): (id: keyof T, values?: Record<string, PrimitiveType>) => string {
  const intl = useIntl();
  return (id, values) =>
    intl.formatMessage({ id: `cards.${type}.${id}` }, values);
}
