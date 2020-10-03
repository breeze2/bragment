import { v4 as UUID4 } from 'uuid';

export function generateUUID(prefix = '') {
  return UUID4();
}
