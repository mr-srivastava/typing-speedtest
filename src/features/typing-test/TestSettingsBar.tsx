'use client';
import React from 'react';
import { ClockIcon, GlobeIcon, QuoteIcon, TextIcon, ValueIcon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Button } from '@/shared/ui/button';
import {
  LANGUAGES,
  TIME_PRESETS,
  WORD_COUNT_PRESETS,
  type TestConfig,
  type TestMode,
} from '@/modules/typing-test';
import { cn } from '@/shared/lib/cn';

const MODE_TABS: { value: TestMode; label: string; icon: typeof ClockIcon }[] = [
  { value: 'time', label: 'time', icon: ClockIcon },
  { value: 'words', label: 'words', icon: TextIcon },
];

interface TestSettingsBarProps {
  config: TestConfig;
  onConfigChange: (next: TestConfig) => void;
  /** Settings lock after typing begins. */
  disabled: boolean;
  className?: string;
}

interface ToggleButtonProps {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  icon: typeof ClockIcon;
  children: React.ReactNode;
}

function ToggleButton({ active, disabled, onClick, icon: Icon, children }: ToggleButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'gap-1.5 font-normal hover:bg-transparent',
        active ? 'text-primary hover:text-primary' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </Button>
  );
}

interface TabItemProps {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  icon?: typeof ClockIcon;
  children: React.ReactNode;
}

/** Flat, borderless tab used for mode/value selectors — no dropdown chrome. */
function TabItem({ active, disabled, onClick, icon: Icon, children }: TabItemProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'gap-1.5 font-normal hover:bg-transparent',
        active
          ? 'font-semibold text-primary hover:text-primary'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      {children}
    </Button>
  );
}

const TestSettingsBar: React.FC<TestSettingsBarProps> = ({
  config,
  onConfigChange,
  disabled,
  className = '',
}) => {
  const valuePresets = config.mode === 'time' ? TIME_PRESETS : WORD_COUNT_PRESETS;
  const currentValue = config.mode === 'time' ? config.timeSeconds : config.wordCount;

  function setMode(mode: TestMode) {
    onConfigChange({ ...config, mode });
  }

  function setValue(value: number) {
    onConfigChange(
      config.mode === 'time' ? { ...config, timeSeconds: value } : { ...config, wordCount: value },
    );
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-x-1 gap-y-3 px-1 py-4 sm:gap-x-2',
        className,
      )}
    >
      <ToggleButton
        icon={QuoteIcon}
        active={config.punctuationEnabled}
        disabled={disabled}
        onClick={() =>
          onConfigChange({ ...config, punctuationEnabled: !config.punctuationEnabled })
        }
      >
        punctuation
      </ToggleButton>

      <ToggleButton
        icon={ValueIcon}
        active={config.numbersEnabled}
        disabled={disabled}
        onClick={() => onConfigChange({ ...config, numbersEnabled: !config.numbersEnabled })}
      >
        numbers
      </ToggleButton>

      <span className="mx-3 hidden h-4 w-px bg-border sm:block" aria-hidden />

      {MODE_TABS.map((tab) => (
        <TabItem
          key={tab.value}
          icon={tab.icon}
          active={config.mode === tab.value}
          disabled={disabled}
          onClick={() => setMode(tab.value)}
        >
          {tab.label}
        </TabItem>
      ))}

      <span className="mx-3 hidden h-4 w-px bg-border sm:block" aria-hidden />

      {valuePresets.map((preset) => (
        <TabItem
          key={preset}
          active={currentValue === preset}
          disabled={disabled}
          onClick={() => setValue(preset)}
        >
          {preset}
        </TabItem>
      ))}

      <span className="mx-3 hidden h-4 w-px bg-border sm:block" aria-hidden />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            className="gap-1.5 font-normal text-muted-foreground hover:text-foreground"
          >
            <GlobeIcon className="h-3.5 w-3.5" />
            {LANGUAGES.find(({ code }) => code === config.language)?.label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup
            value={config.language}
            onValueChange={(value) =>
              onConfigChange({ ...config, language: value as TestConfig['language'] })
            }
          >
            {LANGUAGES.map((language) => (
              <DropdownMenuRadioItem key={language.code} value={language.code}>
                {language.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TestSettingsBar;
