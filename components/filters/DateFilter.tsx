'use client'

import React, { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, Filter, X } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface DateFilterProps {
  paramNameFrom?: string
  paramNameTo?: string
  placeholder?: string
  className?: string
}

export default function DateFilter({
  paramNameFrom = 'dateFrom',
  paramNameTo = 'dateTo',
  placeholder = 'Filter by date range',
  className = '',
}: DateFilterProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Decode date parameters from URL
  const dateFromParam = searchParams.get(paramNameFrom)
  const dateToParam = searchParams.get(paramNameTo)

  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    dateFromParam ? new Date(decodeURIComponent(dateFromParam)) : undefined
  )
  const [dateTo, setDateTo] = useState<Date | undefined>(
    dateToParam ? new Date(decodeURIComponent(dateToParam)) : undefined
  )
  const [isOpen, setIsOpen] = useState(false)

  const handleApplyFilter = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Clear existing date params
    params.delete(paramNameFrom)
    params.delete(paramNameTo)
    params.delete('page') // Reset pagination

    // Set new date params if they exist (store as YYYY-MM-DD strings)
    if (dateFrom) {
      const year = dateFrom.getFullYear()
      const month = String(dateFrom.getMonth() + 1).padStart(2, '0')
      const day = String(dateFrom.getDate()).padStart(2, '0')
      const dateString = `${year}-${month}-${day}`
      params.set(paramNameFrom, encodeURIComponent(dateString))
    }
    if (dateTo) {
      const year = dateTo.getFullYear()
      const month = String(dateTo.getMonth() + 1).padStart(2, '0')
      const day = String(dateTo.getDate()).padStart(2, '0')
      const dateString = `${year}-${month}-${day}`
      params.set(paramNameTo, encodeURIComponent(dateString))
    }

    router.push(`${pathname}?${params.toString()}`)
    setIsOpen(false)
  }

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(paramNameFrom)
    params.delete(paramNameTo)
    params.delete('page')

    router.push(`${pathname}?${params.toString()}`)
    setDateFrom(undefined)
    setDateTo(undefined)
    setIsOpen(false)
  }

  const hasActiveFilter = dateFromParam || dateToParam

  const getFilterDisplay = () => {
    if (!hasActiveFilter) return placeholder

    const from = dateFromParam ? format(new Date(decodeURIComponent(dateFromParam)), 'MMM dd, yyyy') : null
    const to = dateToParam ? format(new Date(decodeURIComponent(dateToParam)), 'MMM dd, yyyy') : null

    if (from && to) {
      return `${from} - ${to}`
    } else if (from) {
      return `From ${from}`
    } else if (to) {
      return `To ${to}`
    }

    return placeholder
  }

  return (
    <div className={`flex items-center gap-2 ${className} `}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full min-w-[240px] justify-start text-left font-normal",
              !hasActiveFilter && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getFilterDisplay()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date-from">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-from"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-to">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-to"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
