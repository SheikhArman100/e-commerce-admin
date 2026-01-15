'use client'

import React, { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Filter } from 'lucide-react'

interface AmountRangeFilterProps {
  paramNameMin?: string
  paramNameMax?: string
  placeholder?: string
  className?: string
}

export default function AmountRangeFilter({
  paramNameMin = 'minAmount',
  paramNameMax = 'maxAmount',
  placeholder = 'Filter by amount range',
  className = '',
}: AmountRangeFilterProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Decode amount parameters from URL
  const minAmountParam = searchParams.get(paramNameMin)
  const maxAmountParam = searchParams.get(paramNameMax)

  const [minAmount, setMinAmount] = useState(
    minAmountParam ? decodeURIComponent(minAmountParam) : ''
  )
  const [maxAmount, setMaxAmount] = useState(
    maxAmountParam ? decodeURIComponent(maxAmountParam) : ''
  )
  const [isOpen, setIsOpen] = useState(false)

  const handleApplyFilter = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Clear existing amount params
    params.delete(paramNameMin)
    params.delete(paramNameMax)
    params.delete('page') // Reset pagination

    // Set new amount params if they exist and are valid numbers
    if (minAmount.trim() && !isNaN(Number(minAmount))) {
      params.set(paramNameMin, encodeURIComponent(minAmount.trim()))
    }
    if (maxAmount.trim() && !isNaN(Number(maxAmount))) {
      params.set(paramNameMax, encodeURIComponent(maxAmount.trim()))
    }

    router.push(`${pathname}?${params.toString()}`)
    setIsOpen(false)
  }

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(paramNameMin)
    params.delete(paramNameMax)
    params.delete('page')

    router.push(`${pathname}?${params.toString()}`)
    setMinAmount('')
    setMaxAmount('')
    setIsOpen(false)
  }

  const hasActiveFilter = minAmountParam || maxAmountParam

  const getFilterDisplay = () => {
    if (!hasActiveFilter) return placeholder

    const min = minAmountParam ? `$${decodeURIComponent(minAmountParam)}` : null
    const max = maxAmountParam ? `$${decodeURIComponent(maxAmountParam)}` : null

    if (min && max) {
      return `${min} - ${max}`
    } else if (min) {
      return `Min ${min}`
    } else if (max) {
      return `Max ${max}`
    }

    return placeholder
  }

  return (
    <div className={`flex items-center gap-2 ${className} `}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full min-w-[200px] justify-start text-left font-normal ${
              !hasActiveFilter && "text-muted-foreground"
            }`}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            {getFilterDisplay()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="min-amount">Minimum Amount ($)</Label>
              <Input
                id="min-amount"
                type="number"
                placeholder="0.00"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-amount">Maximum Amount ($)</Label>
              <Input
                id="max-amount"
                type="number"
                placeholder="No limit"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleApplyFilter} className="flex-1">
                Apply Filter
              </Button>
              <Button variant="outline" onClick={handleClearFilter}>
                Clear
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
