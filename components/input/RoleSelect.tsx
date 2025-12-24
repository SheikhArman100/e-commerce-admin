'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ENUM_USER_ROLE } from '@/types/auth.types';

interface RoleSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function RoleSelect({
  value,
  onChange,
  placeholder = "Select a role",
  disabled = false,
  className = '',
}: RoleSelectProps) {
  const roles = [
    {
      value: ENUM_USER_ROLE.USER,
      label: 'User',
      description: 'Standard user permissions',
    },
    {
      value: ENUM_USER_ROLE.ADMIN,
      label: 'Admin',
      description: 'Full system access',
    },
  ];

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role.value} value={role.value}>
            <div className="flex flex-col">
              <span className="font-medium">{role.label}</span>
              {/* <span className="text-xs text-muted-foreground">{role.description}</span> */}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
