export function debounce<F extends (...params: any[]) => void>(
  fn: F,
  delay: number
) {
  let timer: number;
  const wrapper = function (this: any, ...args: any[]) {
    if (!this && !args.length) {
      return;
    }
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn.apply(this, args), delay);
  } as F;
  return wrapper;
}

// pure functions
export function deleteArrayItem<T>(list: T[], index: number) {
  return list.filter((el, i) => i !== index);
}

export function insertArrayItem<T>(list: T[], item: T, index: number) {
  const length = list.length;
  if (index >= length) {
    return [...list, item];
  }
  if (index <= 0) {
    return [item, ...list];
  }
  return new Array<T>(list.length + 1).map((el, i) => {
    if (i < index) {
      return list[i];
    } else if (i === index) {
      return item;
    } else {
      return list[i - 1];
    }
  });
}

export function renew<T>(current: T, next: T): T {
  return { ...current, ...next };
}

// tools
export function checkIfSingleLine(str: string) {
  return str.indexOf('\n') === -1;
}

export function checkIdHttpUrl(str: string) {
  if (str.slice(0, 4) !== 'http') {
    return false;
  }
  try {
    new URL(str);
  } catch (_) {
    return false;
  }
  return true;
}
