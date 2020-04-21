import { Reducer, useEffect, useReducer, useRef } from 'react';
import { IPartial } from '../api/types';

export function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useMultipleState<T>(initializer: T) {
  return useReducer<Reducer<T, IPartial<T>>>((current, next) => {
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
