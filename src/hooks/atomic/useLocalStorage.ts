import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validator?: (value: any) => value is T,
) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);

    const loadFromStorage = () => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);

          // Use validator if provided, otherwise just check if parsed exists
          if (validator ? validator(parsed) : parsed !== null) {
            setStoredValue(parsed);
          } else {
            // Clear invalid data
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        console.warn(`Failed to load ${key} from localStorage:`, error);
        try {
          localStorage.removeItem(key);
        } catch {
          // Even removal might fail in some environments
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadFromStorage();
  }, [key, validator]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Failed to save ${key} to localStorage:`, error);
      }
    },
    [key, storedValue],
  );

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Failed to remove ${key} from localStorage:`, error);
    }
  }, [key, initialValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    isLoading,
    isHydrated,
  };
}
