import { logWarning } from '@/shared/lib/log';
import { mergeTestRecord } from '../record-test';
import type { SessionStore } from '../session-store';
import type { EnhancedStoredData } from '../types';
import { validateStoredData } from '../validate';

export const SESSION_STORAGE_KEY = 'octane-type-last-session';

function readFromStorage(key: string): EnhancedStoredData | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const parsed = JSON.parse(item);
    if (validateStoredData(parsed)) {
      return parsed;
    }

    localStorage.removeItem(key);
    return null;
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {
      // Even removal might fail in some environments
    }
    return null;
  }
}

function writeToStorage(key: string, data: EnhancedStoredData): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    logWarning(`Failed to save ${key} to localStorage:`, error);
  }
}

function removeFromStorage(key: string): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    logWarning(`Failed to remove ${key} from localStorage:`, error);
  }
}

export function createLocalStorageSessionStore(
  key: string = SESSION_STORAGE_KEY,
): SessionStore {
  let cache: EnhancedStoredData | null | undefined;

  return {
    load() {
      if (cache === undefined) {
        cache = readFromStorage(key);
      }
      return cache;
    },

    recordTest(test) {
      const updated = mergeTestRecord(this.load(), test);
      cache = updated;
      writeToStorage(key, updated);
      return updated;
    },

    clear() {
      cache = null;
      removeFromStorage(key);
    },
  };
}
