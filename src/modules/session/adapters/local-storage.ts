import {
  createInitialCumulativeStats,
  updateCumulativeStats,
} from '../aggregate';
import type { SessionStore } from '../session-store';
import type { EnhancedStoredData, TestSession } from '../types';
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
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
}

function removeFromStorage(key: string): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove ${key} from localStorage:`, error);
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

    recordTest(test: TestSession): EnhancedStoredData {
      const current = this.load();
      let updated: EnhancedStoredData;

      if (current) {
        updated = {
          lastSession: test,
          cumulative: updateCumulativeStats(current.cumulative, test),
        };
      } else {
        updated = {
          lastSession: test,
          cumulative: createInitialCumulativeStats(test),
        };
      }

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
