'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSizes } from '@/hooks/useSizes';
import useDebounce from '@/hooks/useDebounce';

interface SizeItem {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface SizeSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function SizeSelect({
  value = '',
  onChange,
  placeholder = 'Select a size',
  className = '',
  disabled = false
}: SizeSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce the search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch sizes when dropdown is open OR when there's a selected value (for update forms)
  const { data, isLoading } = useSizes({
    page: 1,
    limit: 20, // Always show 20 sizes
    searchTerm: debouncedSearchTerm || undefined, // Send search term to backend when user types
    isActive: "true", // Only fetch active sizes
  }, {
    enabled: open || !!value, // Fetch when dropdown is open OR when there's a selected value
  });

  const sizes: SizeItem[] = data?.data || [];

  const handleValueChange = (selectedValue: number) => {
    onChange?.(String(selectedValue));
    setOpen(false);
  };

  const getSelectedSize = () => {
    if (!value) return null;
    return sizes.find(size => size.id === Number(value));
  };

  const selectedSize = getSelectedSize();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[200px] w-full justify-between"
            disabled={disabled}
          >
            {selectedSize ? (
              <div className="flex items-center gap-2">
                <span>{selectedSize.name}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search sizes..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading sizes...
                </div>
              ) : (
                <>
                  <CommandEmpty>No sizes found.</CommandEmpty>
                  <CommandGroup>
                    {sizes.length === 20 && (
                      <div className="px-2 py-1.5 text-xs text-muted-foreground border-b">
                        Showing top results. Refine your search for more options.
                      </div>
                    )}
                    {sizes.map((size) => (
                      <CommandItem
                        key={size.id}
                        value={size.name}
                        onSelect={() => handleValueChange(size.id)}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === String(size.id) ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className="w-full flex items-center justify-between gap-2">
                          <span>{size.name}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
