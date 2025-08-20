'use client'

import * as React from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { cn } from '@/lib/cn'

type Side = 'top' | 'right' | 'bottom' | 'left'

interface ResponsivePopoverProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  modal?: boolean
  /** Single prop: used for Drawer on mobile and Popover on desktop */
  side?: Side
}

interface ResponsivePopoverTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

interface ResponsivePopoverContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof PopoverContent>,
    'children'
  > {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
  /** Same `side` works for both Drawer (mobile) and Popover (desktop) */
  side?: Side
  align?: React.ComponentPropsWithoutRef<typeof PopoverContent>['align']
  alignOffset?: number
  sideOffset?: number
}

const ResponsivePopoverContext = React.createContext<{
  isMobile: boolean
  side: Side
}>({
  isMobile: false,
  side: 'bottom',
})

export function ResponsivePopover({
  open,
  onOpenChange,
  children,
  modal = true,
  side = 'bottom',
}: ResponsivePopoverProps) {
  const isMobile = useIsMobile()

  const contextValue = React.useMemo(
    () => ({ isMobile, side }),
    [isMobile, side]
  )

  if (isMobile) {
    return (
      <ResponsivePopoverContext.Provider value={contextValue}>
        <Drawer
          open={open}
          onOpenChange={onOpenChange}
          modal={modal}
          direction={side}
        >
          {children}
        </Drawer>
      </ResponsivePopoverContext.Provider>
    )
  }

  return (
    <ResponsivePopoverContext.Provider value={contextValue}>
      <Popover open={open} onOpenChange={onOpenChange} modal={modal}>
        {children}
      </Popover>
    </ResponsivePopoverContext.Provider>
  )
}

export function ResponsivePopoverTrigger({
  children,
  asChild = false,
}: ResponsivePopoverTriggerProps) {
  const { isMobile } = React.useContext(ResponsivePopoverContext)

  if (isMobile) {
    return <DrawerTrigger asChild={asChild}>{children}</DrawerTrigger>
  }

  return <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
}

export function ResponsivePopoverContent({
  children,
  className,
  title,
  description,
  side,
  align,
  alignOffset,
  sideOffset,
  ...props
}: ResponsivePopoverContentProps) {
  const { isMobile, side: contextSide } = React.useContext(
    ResponsivePopoverContext
  )

  const effectiveSide = side ?? contextSide

  if (isMobile) {
    return (
      <DrawerContent
        className={cn('max-h-[85dvh] overflow-y-auto bg-popover', className)}
      >
        {(title || description) && (
          <DrawerHeader className='pb-0'>
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
        )}
        <div className={cn(!title && !description && 'mt-4')}>{children}</div>
      </DrawerContent>
    )
  }

  return (
    <PopoverContent
      side={effectiveSide}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn('bg-popover rounded-none md:rounded-md', className)}
      {...props}
    >
      {children}
    </PopoverContent>
  )
}
