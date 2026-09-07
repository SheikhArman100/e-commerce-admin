'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUsers } from '@/hooks/useUsers';
import useDebounce from '@/hooks/useDebounce';

interface UserSelectProps {
  value?: number[];
  onChange?: (value: number[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Multi-select customer picker (cmdk combobox) — admin searches users by
 * name/email and toggles them into the target list. Selected users render
 * as removable badges. Mirrors the SizeSelect interaction pattern.
 */
export default function UserMultiSelect({
  value = [],
  onChange,
  placeholder = 'Select customers',
  className = '',
  disabled = false,
}: UserSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch users when the dropdown is open (search-as-you-type)
  const { data, isLoading } = useUsers({
    page: 1,
    limit: 20,
    searchTerm: debouncedSearchTerm || undefined,
    isActive: 'true',
  }, {
    enabled: open,
  });

  const users: { id: number; name: string; email: string }[] = data?.data || [];

  const toggleUser = (userId: number) => {
    const next = value.includes(userId)
      ? value.filter((id) => id !== userId)
      : [...value, userId];
    onChange?.(next);
  };

  const removeUser = (userId: number) => {
    onChange?.(value.filter((id) => id !== userId));
  };

  // Resolve a selected id to a display name when the user is in the current
  // page; otherwise fall back to "User #<id>" (still a valid target).
  const getDisplayName = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.name} (#${user.id})` : `User #${userId}`;
  };

  const hasSelection = value.length > 0;

  return (
    <div className={`space-y-2 ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
            disabled={disabled}
          >
            {hasSelection ? (
              <span>{value.length} customer{value.length > 1 ? 's' : ''} selected</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading customers...
                </div>
              ) : (
                <>
                  <CommandEmpty>No customers found.</CommandEmpty>
                  <CommandGroup>
                    {users.length === 20 && (
                      <div className="px-2 py-1.5 text-xs text-muted-foreground border-b">
                        Showing top results. Refine your search for more options.
                      </div>
                    )}
                    {users.map((user) => {
                      const selected = value.includes(user.id);
                      return (
                        <CommandItem
                          key={user.id}
                          value={String(user.id)}
                          onSelect={() => toggleUser(user.id)}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selected ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          <div className="w-full flex flex-col">
                            <span>{user.name}</span>
                            <span className="text-xs text-muted-foreground">
                              #{user.id} · {user.email}
                            </span>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected customers as removable badges */}
      {hasSelection && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((userId) => (
            <Badge key={userId} variant="outline" className="gap-1 pr-1">
              {getDisplayName(userId)}
              <button
                type="button"
                onClick={() => removeUser(userId)}
                className="rounded-full hover:bg-muted p-0.5"
                aria-label={`Remove user ${userId}`}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}