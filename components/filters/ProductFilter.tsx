'use client'

import React, { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProducts } from '@/hooks/useProducts'
import useDebounce from '@/hooks/useDebounce'
import { IProduct } from '@/types/product.types'

interface ProductFilterProps {
  paramName?: string
  placeholder?: string
  className?: string
  showCounts?: boolean
}

export default function ProductFilter({
  paramName = 'productId',
  placeholder = 'Filter by product',
  className = '',
  showCounts = false
}: ProductFilterProps) {
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
  const { data, isLoading } = useProducts({
    page: 1,
    limit: 20, // Always show 20 products
    searchTerm: debouncedSearchTerm || undefined, // Send search term to backend when user types
    isActive: 'true', // Only fetch active products
  }, { enabled: open })

  const products: IProduct[] = data?.data || []

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

  const getSelectedProduct = () => {
    if (currentValue === 'all') return null
    return products.find(product => product.id.toString() === currentValue)
  }

  const selectedProduct = getSelectedProduct()

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
            {selectedProduct ? (
              <div className="flex items-center gap-2">
                <span>{selectedProduct.title}</span>
                {/* <Badge variant="outline" className="text-xs">
                  {selectedProduct.category.name}
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
              placeholder="Search products..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading products...
                </div>
              ) : (
                <>
                  <CommandEmpty>No products found.</CommandEmpty>
                  <CommandGroup>
                {products.length === 20 && (
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
                    <span>All Products</span>
                    {/* {showCounts && (
                      <Badge variant="outline" className="text-xs">
                        {products.length}
                      </Badge>
                    )} */}
                  </div>
                </CommandItem>
                {products.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.title}
                    onSelect={() => handleValueChange(product.id.toString())}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        currentValue === product.id.toString() ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <span className="truncate">{product.title}</span>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {product.category.name}
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
  )
}