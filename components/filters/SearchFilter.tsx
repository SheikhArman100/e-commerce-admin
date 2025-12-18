
'use client'

import React, { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import useDebounce from '@/hooks/useDebounce'


interface SearchFilterProps {
  paramName?: string
  placeholder?: string
  className?: string
  debounceMs?: number
}

export default function SearchFilter({
  paramName = 'searchTerm',
  placeholder = 'Search applications...',
  className = '',
  debounceMs = 300,
}: SearchFilterProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Decode search parameter from URL
  const searchParam = searchParams.get(paramName)
  const [searchValue, setSearchValue] = useState(
    searchParam ? decodeURIComponent(searchParam) : ''
  )

  // Use the existing useDebounce hook
  const debouncedValue = useDebounce(searchValue, debounceMs)

  // Update URL when debounced value changes
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (debouncedValue.trim()) {
      params.set(paramName, encodeURIComponent(debouncedValue.trim()))
      params.delete('page') // Reset pagination when searching
    } else {
      params.delete(paramName)
      params.delete('page')
    }

    router.push(`${pathname}?${params.toString()}`)
  }, [debouncedValue, paramName, pathname, router])

  const handleClear = () => {
    setSearchValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  const hasActiveSearch = searchParam && searchParam.trim() !== ''

  return (
    <div className={`flex items-center  gap-2 ${className}`}>
      {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Search className="w-4 h-4" />
        <span>Search:</span>
      </div> */}

      <div className="relative w-full">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "min-w-[250px] pl-9 pr-9",
            hasActiveSearch && "border-blue-500 focus:border-blue-500"
          )}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />

        {hasActiveSearch && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>


    </div>
  )
}
