'use client'

import React, { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterOption {
  value: string
  label: string
  color?: string
  count?: number
}

interface StatusFilterProps {
  filters: FilterOption[]
  paramName?: string
  placeholder?: string
  className?: string
  showCounts?: boolean
}

export default function StatusFilter({
  filters,
  paramName = 'status',
  placeholder = 'Filter by status',
  className = '',
  showCounts = false
}: StatusFilterProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Decode the current value from URL params (handle special characters)
  const currentValue = searchParams.get(paramName)
    ? decodeURIComponent(searchParams.get(paramName)!)
    : 'all'

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === 'all') {
      params.delete(paramName)
      // Also reset page when changing filters
      params.delete('page')
    } else {
      // Encode the value to handle special characters like &, /, etc.
      params.set(paramName, encodeURIComponent(value))
      // Reset page when changing filters
      params.delete('page')
    }

    router.push(`${pathname}?${params.toString()}`)
    setOpen(false)
  }

  const getSelectedFilter = () => {
    if (currentValue === 'all') return null
    return filters.find(filter => filter.value === currentValue)
  }

  const selectedFilter = getSelectedFilter()

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[180px] w-full justify-between"
          >
            {selectedFilter ? (
              <div className="flex items-center gap-2">
                {selectedFilter.color && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: selectedFilter.color }}
                  />
                )}
                <span>{selectedFilter.label}</span>
                {showCounts && selectedFilter.count !== undefined && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedFilter.count}
                  </Badge>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search options..." />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="all"
                  onSelect={() => handleValueChange('all')}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      currentValue === 'all' ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <span>All Options</span>
                    {showCounts && (
                      <Badge variant="outline" className="text-xs">
                        {filters.reduce((sum, filter) => sum + (filter.count || 0), 0)}
                      </Badge>
                    )}
                  </div>
                </CommandItem>
                {filters.map((filter) => (
                  <CommandItem
                    key={filter.value}
                    value={filter.label}
                    onSelect={() => handleValueChange(filter.value)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        currentValue === filter.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex items-center gap-2">
                      {filter.color && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: filter.color }}
                        />
                      )}
                      <span>{filter.label}</span>
                      {showCounts && filter.count !== undefined && (
                        <Badge variant="secondary" className="text-xs">
                          {filter.count}
                        </Badge>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}