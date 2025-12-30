'use client'

import React, { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCategories } from '@/hooks/useCategories'
import useDebounce from '@/hooks/useDebounce'
import { ICategory } from '@/types/category.types'

interface CategoryFilterProps {
  paramName?: string
  placeholder?: string
  className?: string
  showCounts?: boolean
}

export default function CategoryFilter({
  paramName = 'categoryId',
  placeholder = 'Filter by category',
  className = '',
  showCounts = false
}: CategoryFilterProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Decode the current value from URL params (handle special characters)
  const currentValue = searchParams.get(paramName)
    ? decodeURIComponent(searchParams.get(paramName)!)
    : 'all'

  // Debounce the search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Only fetch data when the popover is open
  const { data, isLoading } = useCategories({
    page: 1,
    limit: 20, // Always show 20 categories
    searchTerm: debouncedSearchTerm || undefined, // Send search term to backend when user types
  }, { enabled: open })

  const categories: ICategory[] = data?.data || []

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

    // Clear flavor filter when category changes
    params.delete('flavorId')

    router.push(`${pathname}?${params.toString()}`)
    setOpen(false)
  }

  const getSelectedCategory = () => {
    if (currentValue === 'all') return null
    return categories.find(category => category.id.toString() === currentValue)
  }

  const selectedCategory = getSelectedCategory()

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[200px] w-full justify-between"
          >
            {selectedCategory ? (
              <div className="flex items-center gap-2">
                <span>{selectedCategory.name}</span>
                {/* <Badge variant="outline" className="text-xs">
                  {selectedCategory.status}
                </Badge> */}

              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
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
                    <span>All Categories</span>
                    {/* {showCounts && (
                      <Badge variant="outline" className="text-xs">
                        {categories.length}
                      </Badge>
                    )} */}
                  </div>
                </CommandItem>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => handleValueChange(category.id.toString())}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        currentValue === category.id.toString() ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <span>{category.name}</span>
                      {/* <Badge variant="outline" className="text-xs">
                        {category.status}
                      </Badge> */}

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
  )
}
