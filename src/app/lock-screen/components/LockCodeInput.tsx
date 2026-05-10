'use client';

import React, { useRef, useEffect, useCallback } from 'react';

interface Props {
  value: string;
  onChange: (code: string) => void;
  length: number;
  hasError: boolean;
  isSuccess: boolean;
}

export default function LockCodeInput({ value, onChange, length, hasError, isSuccess }: Props) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (value === '') {
      inputsRef.current[0]?.focus();
    }
  }, [value]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (value.length > 0) {
        const newCode = value.slice(0, -1);
        onChange(newCode);
        const prevIndex = Math.max(0, value.length - 1);
        inputsRef.current[prevIndex]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }, [value, onChange, length]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const char = e.target.value.slice(-1).toUpperCase();
    if (!char || !/[A-Z0-9]/.test(char)) return;
    const newCode = value.slice(0, index) + char + value.slice(index + 1);
    const trimmed = newCode.slice(0, length);
    onChange(trimmed);
    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }, [value, onChange, length]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, length);
    onChange(pasted);
    const nextIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[nextIndex]?.focus();
  }, [onChange, length]);

  return (
    <div className="flex gap-1.5 sm:gap-2 justify-center" role="group" aria-label="Code secret">
      {Array.from({ length }).map((_, i) => {
        const isFilled = i < value.length;
        const isFocused = i === value.length;
        const char = value[i] || '';

        return (
          <input
            key={`code-box-${i + 1}`}
            ref={(el) => { inputsRef.current[i] = el; }}
            type="text"
            inputMode="text"
            maxLength={2}
            value={char}
            onChange={(e) => handleInput(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            aria-label={`Caractère ${i + 1}`}
            className={`w-8 h-10 sm:w-10 sm:h-12 text-center text-sm sm:text-base font-800 rounded-lg sm:rounded-xl border-2 outline-none transition-all duration-200 tracking-widest uppercase cursor-text ${
              isSuccess
                ? 'border-green-500/60 bg-green-500/10 text-green-400'
                : hasError
                ? 'border-red-500/60 bg-red-500/8 text-red-400'
                : isFilled
                ? 'bg-white border-primary text-primary shadow-[0_0_10px_rgba(249,115,22,0.3)]'
                : isFocused
                ? 'bg-white border-primary/60 ring-2 ring-primary/20 text-primary'
                : 'bg-white border-border text-foreground'
            }`}
          />
        );
      })}
    </div>
  );
}