'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFlavors } from '@/hooks/useFlavors';
import useDebounce from '@/hooks/useDebounce';

interface FlavorItem {
  id: number;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface FlavorSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function FlavorSelect({
  value = '',
  onChange,
  placeholder = 'Select a flavor',
  className = '',
  disabled = false
}: FlavorSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce the search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch flavors when dropdown is open OR when there's a selected value (for update forms)
  const { data, isLoading } = useFlavors({
    page: 1,
    limit: 20, // Always show 20 flavors
    searchTerm: debouncedSearchTerm || undefined, // Send search term to backend when user types
    isActive: "true", // Only fetch active flavors
  }, {
    enabled: open || !!value, // Fetch when dropdown is open OR when there's a selected value
  });

  const flavors: FlavorItem[] = data?.data || [];

  const handleValueChange = (selectedValue: number) => {
    onChange?.(String(selectedValue));
    setOpen(false);
  };

  const getSelectedFlavor = () => {
    if (!value) return null;
    return flavors.find(flavor => flavor.id === Number(value));
  };

  const selectedFlavor = getSelectedFlavor();

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
            {selectedFlavor ? (
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: selectedFlavor.color }}
                />
                <span>{selectedFlavor.name}</span>
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
              placeholder="Search flavors..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading flavors...
                </div>
              ) : (
                <>
                  <CommandEmpty>No flavors found.</CommandEmpty>
                  <CommandGroup>
                    {flavors.length === 20 && (
                      <div className="px-2 py-1.5 text-xs text-muted-foreground border-b">
                        Showing top results. Refine your search for more options.
                      </div>
                    )}
                    {flavors.map((flavor) => (
                      <CommandItem
                        key={flavor.id}
                        value={flavor.name}
                        onSelect={() => handleValueChange(flavor.id)}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === String(flavor.id) ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className="w-full flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{ backgroundColor: flavor.color }}
                          />
                          <span>{flavor.name}</span>
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
