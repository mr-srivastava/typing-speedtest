'use client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Button } from '@/shared/ui/button';
import {
  TIME_PRESETS,
  WORD_COUNT_PRESETS,
  type LanguageCode,
  type TestConfig,
  type TestMode,
} from '@/modules/typing-test';
import { cn } from '@/shared/lib/cn';

const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  english: 'English',
};

const LANGUAGES = Object.keys(LANGUAGE_LABELS) as LanguageCode[];

interface TestSettingsBarProps {
  config: TestConfig;
  onConfigChange: (next: TestConfig) => void;
  /** Settings shouldn't change mid-test — disable (not hide) once a test has started. */
  disabled: boolean;
  className?: string;
}

interface ToggleButtonProps {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ToggleButton({ active, disabled, onClick, children }: ToggleButtonProps) {
  return (
    <Button
      variant={active ? 'default' : 'outline'}
      size="sm"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={active}
    >
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
  const valueLabel = config.mode === 'time' ? `${currentValue}s` : `${currentValue} words`;

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
        'flex flex-wrap items-center gap-2 border-b border-border px-4 py-2 md:px-6',
        className,
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={disabled}>
            {config.mode === 'time' ? 'Time' : 'Words'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup
            value={config.mode}
            onValueChange={(value) => setMode(value as TestMode)}
          >
            <DropdownMenuRadioItem value="time">Time</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="words">Words</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={disabled}>
            {valueLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup
            value={String(currentValue)}
            onValueChange={(value) => setValue(Number(value))}
          >
            {valuePresets.map((preset) => (
              <DropdownMenuRadioItem key={preset} value={String(preset)}>
                {preset}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ToggleButton
        active={config.punctuationEnabled}
        disabled={disabled}
        onClick={() =>
          onConfigChange({ ...config, punctuationEnabled: !config.punctuationEnabled })
        }
      >
        punctuation
      </ToggleButton>

      <ToggleButton
        active={config.numbersEnabled}
        disabled={disabled}
        onClick={() => onConfigChange({ ...config, numbersEnabled: !config.numbersEnabled })}
      >
        numbers
      </ToggleButton>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={disabled}>
            {LANGUAGE_LABELS[config.language]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup
            value={config.language}
            onValueChange={(value) =>
              onConfigChange({ ...config, language: value as LanguageCode })
            }
          >
            {LANGUAGES.map((language) => (
              <DropdownMenuRadioItem key={language} value={language}>
                {LANGUAGE_LABELS[language]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TestSettingsBar;
