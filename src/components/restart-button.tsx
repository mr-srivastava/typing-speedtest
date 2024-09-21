import React from "react";
import { Button } from "@/components/ui/button";
import { ResetIcon } from "@radix-ui/react-icons";

interface RestartButtonProps {
  onRestart: () => void;
  disabled: boolean;
}

export default function RestartButton({
  onRestart,
  disabled,
}: RestartButtonProps) {
  return (
    <div className="flex w-full justify-end mt-5">
      <Button
        variant="outline"
        className="rounded-lg"
        size="icon"
        onClick={onRestart}
        disabled={disabled}
      >
        <ResetIcon />
      </Button>
    </div>
  );
}
