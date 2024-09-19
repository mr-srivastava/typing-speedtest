import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

```
/**
 * Combines and merges CSS class names using clsx and tailwind-merge
 * @param {...ClassValue[]} inputs - An array of class values to be combined
 * @returns {string} A string of merged and deduplicated CSS class names
 */
```
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
