'use client';

import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

type DateInputProps = {
  label: string;
  name: string;
  control: Control<any>;
  errors?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
};

const DateInput: React.FC<DateInputProps> = ({
  label,
  name,
  control,
  errors,
  className,
  disabled = false,
  placeholder = 'Pick a date',
}) => {
  return (
    <div className={cn('col-span-1 flex flex-col gap-1', className)}>
      <Label htmlFor={name}>{label}</Label>
      
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={name}
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal h-10',
                  !field.value && 'text-muted-foreground',
                  errors && 'border-destructive'
                )}
                disabled={disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? (
                  format(new Date(field.value), 'PPP')
                ) : (
                  <span>{placeholder}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  if (date) {
                    // Set hours to noon to avoid timezone issues when converting to YYYY-MM-DD
                    const adjustedDate = new Date(date);
                    adjustedDate.setHours(12, 0, 0, 0);
                    field.onChange(adjustedDate.toISOString().split('T')[0]);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
      />

      {errors && <p className="text-sm text-destructive">{errors}</p>}
    </div>
  );
};

export default DateInput;
