import { cva } from 'class-variance-authority';
import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type CalloutProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'title' | 'type' | 'icon'
> & {
  title?: ReactNode;
  /**
   * @defaultValue info
   */
  type?: 'info' | 'warn' | 'error' | 'success' | 'warning';

  /**
   * Force an icon
   */
  icon?: ReactNode;
};

const calloutVariants = cva(
  'my-4 flex gap-2 rounded-lg border border-s-2 bg-fd-card p-3 text-sm text-fd-card-foreground shadow-md',
  {
    variants: {
      type: {
        info: 'border-s-blue-500/50',
        warn: 'border-s-amber-500/50',
        error: 'border-s-red-500/50',
        success: 'border-s-green-500/50',
      },
    },
  },
);

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, children, title, type = 'info', icon, ...props }, ref) => {
    if (type === 'warning') type = 'warn';

    return (
      <div
        ref={ref}
        className={cn(
          calloutVariants({
            type: type,
          }),
          className,
        )}
        {...props}
      >
        {icon ??
          {
            info: <Info className='size-5 fill-blue-500 text-fd-card' />,
            warn: (
              <TriangleAlert className='size-5 fill-amber-500 text-fd-card' />
            ),
            error: <CircleX className='size-5 fill-red-500 text-fd-card' />,
            success: (
              <CircleCheck className='size-5 fill-green-500 text-fd-card' />
            ),
          }[type]}
        <div className='flex min-w-0 flex-1 flex-col gap-2'>
          {title ? <p className='!my-0 font-medium'>{title}</p> : null}
          <div className='prose-no-margin text-fd-muted-foreground empty:hidden'>
            {children}
          </div>
        </div>
      </div>
    );
  },
);

Callout.displayName = 'Callout';
