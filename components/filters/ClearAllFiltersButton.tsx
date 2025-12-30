
'use client'

import React, { useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'

export default function ClearAllFiltersButton() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // AUTO CLEAR ON PAGE REFRESH
  useEffect(() => {
    if (typeof window === 'undefined') return

    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

    // If user pressed browser refresh
    if (nav.type === 'reload') {
      const params = new URLSearchParams()
      const page = searchParams.get('page')
      if (page) params.set('page', page)

      router.replace(`${pathname}?${params.toString()}`)
    }
  }, [])

  // Check if any filters are active
  const hasActiveFilters =
    searchParams.get('searchTerm') ||
    searchParams.get('isVerified') ||
    searchParams.get('role')||
    searchParams.get('isActive')||
    searchParams.get('inStock')||
    searchParams.get('categoryId')

  const handleClearAll = () => {
    const params = new URLSearchParams()
    const currentPage = searchParams.get('page')
    if (currentPage) params.set('page', currentPage)

    router.push(`${pathname}?${params.toString()}`)
  }

  if (!hasActiveFilters) return null

  return (
    <Button
      variant="destructive"
      appearance="ghost"
      size="sm"
      onClick={handleClearAll}
      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
    >
      <RotateCcw className="w-4 h-4 mr-2" />
      Clear All Filters
    </Button>
  )
}
