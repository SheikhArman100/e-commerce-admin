'use client';

import { useState } from 'react';
import { FieldError } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface TextInputProps {
  label?: string;
  placeholder?: string;
  name: string;
  type?: string;
  register: any;
  errors?: string | FieldError;
  showPasswordToggle?: boolean;
  className?: string;
  disabled?: boolean;
}

export default function TextInput({
  label,
  placeholder,
  name,
  type = 'text',
  register,
  errors,
  showPasswordToggle = false,
  className,
  disabled = false,
}: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showPasswordToggle && showPassword ? 'text' : type;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          id={name}
          type={inputType}
          placeholder={placeholder}
          {...register(name)}
          disabled={disabled}
          className={cn(
            'h-10 sm:h-11',
            errors && 'border-destructive focus-visible:ring-destructive/20'
          )}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {errors && (
        <p className="text-sm text-destructive">
          {typeof errors === 'string' ? errors : errors.message}
        </p>
      )}
    </div>
  );
}
