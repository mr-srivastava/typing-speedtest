import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface TypingInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readOnly: boolean;
  disablePaste?: boolean;
}

export default function TypingInput({
  value,
  onChange,
  readOnly,
  disablePaste = true,
}: TypingInputProps) {
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (disablePaste) {
      e.preventDefault();
    }
  };

  return (
    <Textarea
      className="w-full rounded-lg min-h-[250px] overflow-hidden px-4 py-3 resize-none mt-2 bg-secondary/60 border border-border text-base md:text-lg font-mono caret-[hsl(var(--primary))] focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:border-transparent"
      placeholder="Start typing for the test to begin"
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      onPaste={handlePaste}
    />
  );
}
