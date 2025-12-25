import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type TextAreaInputProps = {
  label: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  errors?: string;
  className?: string;
  disabled?: boolean;
  rows?: number;
};

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  label,
  placeholder,
  name,
  register,
  errors,
  className,
  disabled = false,
  rows = 3,
}) => {
  return (
    <div className={twMerge('col-span-1 flex flex-col gap-1', className)}>
      <Label htmlFor={name}>{label}</Label>

      <Textarea
        id={name}
        {...register(name)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className="resize-none"
      />

      {errors && <p className="text-sm text-destructive">{errors}</p>}
    </div>
  );
};

export default TextAreaInput;
