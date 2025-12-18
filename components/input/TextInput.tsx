import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { UseFormRegister } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { Input, InputAddon, InputGroup } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FormInputProps = {
  label: string;
  placeholder: string;
  name: string;
  type?: string;
  register: UseFormRegister<any>;
  errors?: string;
  className?: string;
  showPasswordToggle?: boolean;
  disabled?: boolean;
};

const TextInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  name,
  type = 'text',
  register,
  errors,
  className,
  showPasswordToggle = false,
  disabled = false,
}) => {
  const [passwordHidden, setPasswordHidden] = useState(true);

  const inputType =
    showPasswordToggle && type === 'password'
      ? passwordHidden
        ? 'password'
        : 'text'
      : type;

  return (
    <div className={twMerge('col-span-1 flex flex-col gap-1', className)}>
      <div className="flex justify-between items-center">
        <Label htmlFor={name}>{label}</Label>
        {label === 'Password' && (
          <Link
            href="/auth/forget-password"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Forgot Password?
          </Link>
        )}
      </div>

      <InputGroup>
        <Input
          id={name}
          {...register(name)}
          placeholder={placeholder}
          type={inputType}
          disabled={disabled}
        />
        {showPasswordToggle && type === 'password' && (
          <InputAddon
            mode="icon"
            onClick={() => setPasswordHidden(!passwordHidden)}
          >
            {passwordHidden ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </InputAddon>
        )}
      </InputGroup>

      {errors && <p className="text-sm text-destructive">{errors}</p>}
    </div>
  );
};

export default TextInput;