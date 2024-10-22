import logger from '@/lib/core/logger';
import { hasPageBeenMounted } from '@/lib/core/utils';

export enum LocalStorageKey {
  accessToken,
  refreshToken,
  language,
}

const handlePageHasNotBeenMounted = (key: LocalStorageKey) =>
  logger.warn(`Page has not been mounted. Cannot access ${key} in localStorage.`);

export function setLocalStorageItem<T>(key: LocalStorageKey, value: T): void {
  if (hasPageBeenMounted()) {
    localStorage.setItem(JSON.stringify(key), JSON.stringify(value));
  } else {
    handlePageHasNotBeenMounted(key);
  }
}

export function getLocalStorageItem<T, V>(key: LocalStorageKey, fallbackValue: V) {
  if (hasPageBeenMounted()) {
    const item = localStorage.getItem(JSON.stringify(key));

    if (item !== null) {
      return JSON.parse(item) as T;
    }
  } else {
    handlePageHasNotBeenMounted(key);
  }
  return fallbackValue;
}

export const removeLocalStorageItem = (key: LocalStorageKey): void => {
  localStorage.removeItem(JSON.stringify(key));
};
