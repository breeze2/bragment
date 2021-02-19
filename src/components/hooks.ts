import type { PrimitiveType } from 'intl-messageformat';
import { Reducer, useEffect, useReducer, useRef } from 'react';
import { useIntl } from 'react-intl';
import type { ILocalMessages } from '../i18n/messages';

export function useFormatMessage(): (
  id: keyof ILocalMessages,
  values?: Record<string, PrimitiveType>
) => string {
  const intl = useIntl();
  return (id, values) => intl.formatMessage({ id }, values);
}

export function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useMultipleState<T>(initializer: T) {
  return useReducer<Reducer<T, Partial<T>>>((current, next) => {
    let flag = false;
    for (const key in current) {
      if (key in next && current[key] !== next[key]) {
        flag = true;
        break;
      }
    }
    return flag ? { ...current, ...next } : current;
  }, initializer);
}
