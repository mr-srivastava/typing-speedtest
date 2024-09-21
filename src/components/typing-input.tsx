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
      className="w-full rounded-lg min-h-[250px] overflow-hidden px-3 py-3 resize-none mt-2 bg-grey-100/20"
      placeholder="Start typing for the test to begin"
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      onPaste={handlePaste}
    />
  );
}
