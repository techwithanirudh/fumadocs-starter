'use client'

import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/cn'

export type UpdatesProps = {
  children: ReactNode
  className?: string
}

export type UpdateProps = {
  children: ReactNode
  label: string
  id?: string
  className?: string
}

export function Updates({ children, className }: UpdatesProps) {
  return (
    <div className={cn('fd-updates flex flex-col', className)}>{children}</div>
  )
}

export function Update({ children, label, id, className }: UpdateProps) {
  const updateId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div
      className={cn(
        'fd-update relative flex w-full flex-col items-start gap-2 py-8 lg:flex-row lg:gap-6',
        className
      )}
      id={updateId}
    >
      <div className='group top-[112px] flex w-full flex-shrink-0 flex-col items-start justify-start lg:sticky lg:w-[160px]'>
        <Badge
          className='h-fit flex-grow-0 rounded-lg px-2 py-1 text-sm'
          variant='secondary'
        >
          {label}
        </Badge>
      </div>
      <div className='prose prose-gray dark:prose-invert max-w-full flex-1 overflow-hidden px-0.5'>
        {children}
      </div>
    </div>
  )
}
