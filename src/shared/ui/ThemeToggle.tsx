'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/cn';
import {
  DEFAULT_THEME,
  lightThemeOption,
  darkThemeOption,
  THEME_OPTIONS,
} from '@/shared/lib/theme-config';
import { size } from '@/shared/lib/tokens';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant='outline'
        size='icon'
        className={className}
        disabled
        aria-label='Toggle theme'
      >
        <lightThemeOption.icon className={size.icon} />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className={cn('relative', className)}
          aria-label='Toggle theme'
        >
          <lightThemeOption.icon
            className={`${size.icon} opacity-100 transition-opacity duration-ui ease-out dark:opacity-0`}
          />
          <darkThemeOption.icon
            className={`absolute ${size.icon} opacity-0 transition-opacity duration-ui ease-out dark:opacity-100`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuRadioGroup
          value={theme ?? DEFAULT_THEME}
          onValueChange={setTheme}
        >
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value} className='gap-2'>
              <Icon className={size.icon} />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
