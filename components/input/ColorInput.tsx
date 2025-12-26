import React, { useState, useEffect } from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ColorInputProps = {
  label: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  setValue?: UseFormSetValue<any>;
  watch?: UseFormWatch<any>;
  errors?: string;
  className?: string;
  disabled?: boolean;
};

const ColorInput: React.FC<ColorInputProps> = ({
  label,
  placeholder,
  name,
  register,
  setValue,
  watch,
  errors,
  className,
  disabled = false,
}) => {
  const watchedValue = watch ? watch(name) : undefined;
  const [colorValue, setColorValue] = useState('#000000');

  // Update internal state when watched value changes
  useEffect(() => {
    if (watchedValue) {
      setColorValue(watchedValue);
    }
  }, [watchedValue]);

  const handleColorChange = (newColor: string) => {
    setColorValue(newColor);
    if (setValue) {
      setValue(name, newColor, { shouldValidate: true, shouldDirty: true });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColorValue(newColor);
    if (setValue) {
      setValue(name, newColor, { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <div className={twMerge('col-span-1 flex flex-col gap-1', className)}>
      <Label htmlFor={name}>{label}</Label>

      <div className="flex items-center gap-2">
        {/* Color Picker */}
        <input
          type="color"
          value={colorValue}
          onChange={(e) => handleColorChange(e.target.value)}
          disabled={disabled}
          className="w-12 h-10 rounded border border-input cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {/* Text Input */}
        <Input
          id={name}
          {...register(name)}
          type="text"
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 font-mono text-sm"
        />

        {/* Color Preview */}
        <div
          className="w-8 h-8 rounded border-2 border-gray-300 shadow-sm"
          style={{ backgroundColor: colorValue }}
          title={`Selected color: ${colorValue}`}
        />
      </div>

      {errors && <p className="text-sm text-destructive">{errors}</p>}

      <p className="text-xs text-muted-foreground">
        Supports: hex (#FF0000), rgb(255,0,0), rgba(255,0,0,1), hsl(0,100%,50%), hsla(0,100%,50%,1), or named colors (red)
      </p>
    </div>
  );
};

export default ColorInput;
