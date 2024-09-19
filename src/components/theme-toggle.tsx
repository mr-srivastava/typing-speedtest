"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Renders a dropdown menu component for toggling between light, dark, and system themes.
 * @returns {JSX.Element} A DropdownMenu component with theme toggle functionality.
 */
export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        /**
         * Sets the theme to light mode
         * @param {Function} onClick - Event handler function to set the theme to "light"
         /**
          * Sets the theme to dark mode
          * @param {void} - This function doesn't take any parameters
          * @returns {void} This function doesn't return a value
          */
         * @returns {JSX.Element} A dropdown menu item for selecting light theme
         */
        <DropdownMenuItem onClick={() => setTheme("light")}>
          /**
           * Renders a dropdown menu item that sets the theme to "system" when clicked.
           * @param {Function} onClick - The function to call when the menu item is clicked, which sets the theme to "system".
           * @returns {JSX.Element} A DropdownMenuItem component with the specified onClick behavior.
           */
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
