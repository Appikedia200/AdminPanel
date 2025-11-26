'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { cn } from '@/shared/utils/cn'
import { Button } from '@/presentation/components/ui/button'
import { Calendar } from '@/presentation/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/presentation/components/ui/popover'

interface DateRangePickerProps {
  onDateChange: (range: { from?: string; to?: string }) => void
  className?: string
}

export function DateRangePicker({ onDateChange, className }: DateRangePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>()

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate)
    onDateChange({
      from: newDate?.from ? format(newDate.from, 'yyyy-MM-dd') : undefined,
      to: newDate?.to ? format(newDate.to, 'yyyy-MM-dd') : undefined,
    })
  }

  const handleReset = () => {
    setDate(undefined)
    onDateChange({ from: undefined, to: undefined })
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
          {date && (
            <div className="p-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="w-full"
              >
                Clear Selection
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

