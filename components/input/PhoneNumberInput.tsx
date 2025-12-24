'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PhoneNumberInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function PhoneNumberInput({
  value = '',
  onChange,
  placeholder = '1xxxxxxxxx',
  className = '',
  disabled = false
}: PhoneNumberInputProps) {
  const [phoneNumber, setPhoneNumber] = React.useState('');

  // Initialize with provided value - extract just the phone number part (remove +880 if present)
  React.useEffect(() => {
    if (value) {
      // Remove +880 prefix if present, keep only the phone number part
      const cleanValue = value.replace(/^\+?880/, '');
      setPhoneNumber(cleanValue);
    }
  }, [value]);

  // Handle phone number input change
  const handlePhoneChange = (inputValue: string) => {
    // Remove any non-digit characters
    const cleanValue = inputValue.replace(/[^\d]/g, '');

    // Limit to 10 digits (Bangladeshi mobile format)
    const limitedValue = cleanValue.slice(0, 10);

    setPhoneNumber(limitedValue);

    // Always prepend +880 for the full number
    const fullNumber = limitedValue ? `+880${limitedValue}` : '';
    onChange?.(fullNumber);
  };

  return (
    <div className={cn("flex items-center w-full", className)}>
      {/* Fixed Bangladesh Country Code */}
      <div className="flex items-center justify-center w-24 h-10 px-3 border border-r-0 rounded-l-md bg-muted/50">
        <span className="flex items-center gap-1.5">
          <span className="text-sm leading-none">🇧🇩</span>
          <span className="text-xs leading-none font-medium">+880</span>
        </span>
      </div>

      {/* Phone Number Input */}
      <Input
        type="tel"
        placeholder={placeholder}
        value={phoneNumber}
        onChange={(e) => handlePhoneChange(e.target.value)}
        className="rounded-l-none flex-1"
        disabled={disabled}
        maxLength={10}
      />
    </div>
  );
}
