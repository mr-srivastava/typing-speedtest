"use client";
import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "./ui/animated-modal";
import TypingStats from "./stats";

interface MetricsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  correctWordCount: number;
  totalWordCount: number;
  timer: number;
  letterAccuracyData: Record<string, { correct: number; total: number }>;
  onRestart: () => void;
}

export function MetricsModal({
  isOpen,
  onOpenChange,
  correctWordCount,
  totalWordCount,
  timer,
  letterAccuracyData,
  onRestart,
}: MetricsModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalBody title="Metrics" className="w-full max-w-4xl mx-auto">
        <ModalContent>
          <TypingStats
            correctWordCount={correctWordCount}
            totalWordCount={totalWordCount}
            timer={timer}
            letterAccuracyData={letterAccuracyData}
          />
        </ModalContent>
        <ModalFooter className="gap-4 justify-end">
          <button
            onClick={onRestart}
            className="bg-black text-white dark:bg-white dark:text-black text-sm px-4 py-2 rounded-md border border-black w-28"
          >
            Restart
          </button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
}
