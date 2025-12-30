'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks/useCategories';
import useDebounce from '@/hooks/useDebounce';

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  image?: {
    id: number;
    path: string;
    originalName: string;
    modifiedName: string;
    type: string;
  } | null;
}

interface CategorySelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function CategorySelect({
  value = '',
  onChange,
  placeholder = 'Select a category',
  className = '',
  disabled = false
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce the search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch categories when dropdown is open OR when there's a selected value (for update forms)
  const { data, isLoading } = useCategories({
    page: 1,
    limit: 20, // Always show 20 categories
    searchTerm: debouncedSearchTerm || undefined, // Send search term to backend when user types
    isActive: "true", // Only fetch active categories
  }, {
    enabled: open || !!value, // Fetch when dropdown is open OR when there's a selected value
  });

  const categories: CategoryItem[] = data?.data || [];

  const handleValueChange = (selectedValue: number) => {
    onChange?.(String(selectedValue));
    setOpen(false);
  };

  const getSelectedCategory = () => {
    if (!value) return null;
    return categories.find(category => category.id === Number(value));
  };

  const selectedCategory = getSelectedCategory();

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
            {selectedCategory ? (
              <div className="flex items-center gap-2">
                <span>{selectedCategory.name}</span>
                <Badge variant="outline" className="text-xs">
                  {selectedCategory.isActive ? 'Active' : 'Inactive'}
                </Badge>
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
              placeholder="Search categories..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading categories...
                </div>
              ) : (
                <>
                  <CommandEmpty>No categories found.</CommandEmpty>
                  <CommandGroup>
                    {categories.length === 20 && (
                      <div className="px-2 py-1.5 text-xs text-muted-foreground border-b">
                        Showing top results. Refine your search for more options.
                      </div>
                    )}
                    {categories.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.name}
                        onSelect={() => handleValueChange(category.id)}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === String(category.id) ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className="w-full flex items-center justify-between gap-2">
                          <span>{category.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {category.isActive ? 'Active' : 'Inactive'}
                          </Badge>
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
