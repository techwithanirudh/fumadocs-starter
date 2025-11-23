'use client'
import { type UIMessage, type UseChatHelpers, useChat } from '@ai-sdk/react'
import { Presence } from '@radix-ui/react-presence'
import { DefaultChatTransport } from 'ai'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import {
  ArrowUpIcon,
  MessageCircleIcon,
  TrashIcon,
  RotateCcw,
  SquareIcon,
  X,
  LoaderCircleIcon,
} from 'lucide-react'
import {
  type ComponentProps,
  createContext,
  type SyntheticEvent,
  use,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { MyUIMessage } from '@/app/api/chat/types'
import { cn } from '@/lib/cn'
import { Markdown } from './markdown'
import { MessageMetadata } from './message-metadata'

const Context = createContext<{
  open: boolean
  setOpen: (open: boolean) => void
  chat: UseChatHelpers<UIMessage>
} | null>(null)

function useChatContext() {
  return use(Context)!.chat
}

function Header() {
  const { setOpen, chat } = use(Context)!

  return (
    <div className='sticky top-0 flex items-start gap-2'>
      <div className='flex-1 flex justify-between items-center rounded-xl bg-fd-card py-2 px-3 text-fd-card-foreground'>
        <p className='font-medium text-sm'>Ask AI</p>
        <div className='flex items-center gap-1.5'>
          <button
            type='button'
            className={cn(
              buttonVariants({
                color: 'secondary',
                size: 'icon-xs',
                className: '[&_svg]:size-3.5',
              })
            )}
            onClick={() => chat.setMessages([])}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
      <button
        type='button'
        aria-label='Close'
        tabIndex={-1}
        className={cn(
          buttonVariants({
            size: 'icon-sm',
            color: 'secondary',
            className: 'rounded-full',
          })
        )}
        onClick={() => setOpen(false)}
      >
        <X />
      </button>
    </div>
  )
}

function SearchAIActions() {
  const { messages, status, regenerate } = useChatContext()
  const isLoading = status === 'streaming'

  if (messages.length === 0) return null

  return (
    <button
      type='button'
      className={cn(
        buttonVariants({
          color: 'secondary',
          size: 'icon-sm',
          className: 'gap-1.5 rounded-t-md rounded-bl-lg rounded-br-md [&_svg]:size-4 transition-opacity duration-200',
        }),
        !isLoading && messages.at(-1)?.role === 'assistant' ? 'opacity-100' : 'opacity-0'
      )}
      onClick={() => regenerate()}
    >
      <RotateCcw />
    </button>
  )
}

const StorageKeyInput = '__ai_search_input'
function SearchAIInput(props: ComponentProps<'form'>) {
  const { status, sendMessage, stop } = useChatContext()
  const [input, setInput] = useState(
    () => localStorage.getItem(StorageKeyInput) ?? ''
  )
  const isLoading = status === 'streaming' || status === 'submitted'
  const onStart = (e?: SyntheticEvent) => {
    e?.preventDefault()
    void sendMessage({ text: input })
    setInput('')
  }

  localStorage.setItem(StorageKeyInput, input)

  useEffect(() => {
    if (isLoading) document.getElementById('nd-ai-input')?.focus()
  }, [isLoading])

  return (
    <form
      {...props}
      className={cn('flex items-start pe-2', props.className)}
      onSubmit={onStart}
    >
      <Input
        value={input}
        placeholder={isLoading ? 'Generating...' : 'Ask a question'}
        autoFocus
        className={cn('p-3', isLoading && 'text-fd-muted-foreground')}
        disabled={status === 'streaming' || status === 'submitted'}
        onChange={(e) => {
          setInput(e.target.value)
        }}
        onKeyDown={(event) => {
          if (!event.shiftKey && event.key === 'Enter') {
            onStart(event)
          }
        }}
      />
      {isLoading ? (
        <button
          key='bn'
          type='button'
          className={cn(
            buttonVariants({
              color: 'secondary',
              size: 'icon-sm',
              className: 'mt-2 rounded-b-md rounded-tr-lg rounded-tl-md transition-all [&_svg]:size-3.5',
            })
          )}
          onClick={stop}
        >
          <SquareIcon className='fill-fd-foreground' />
        </button>
      ) : (
        <button
          key='bn'
          type='submit'
          className={cn(
            buttonVariants({
              color: 'secondary',
              size: 'icon-sm',
              className: 'mt-2 rounded-b-md rounded-tr-lg rounded-tl-md transition-all [&_svg]:size-4',
            })
          )}
          disabled={input.length === 0}
        >
          <ArrowUpIcon />
        </button>
      )}
    </form>
  )
}

function List(props: Omit<ComponentProps<'div'>, 'dir'>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({ lastHeight: 0, isUserScrolled: false })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function handleResize() {
      if (!container) return
      const currentHeight = container.scrollHeight
      const scrollTop = container.scrollTop
      const clientHeight = container.clientHeight
      const isNearBottom = scrollTop + clientHeight >= currentHeight - 100
      const heightIncreased = currentHeight > stateRef.current.lastHeight

      if (
        heightIncreased &&
        (isNearBottom || !stateRef.current.isUserScrolled)
      ) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'instant' })
      }

      stateRef.current.lastHeight = currentHeight
    }

    function handleScroll() {
      if (!container) return
      const scrollTop = container.scrollTop
      const clientHeight = container.clientHeight
      const scrollHeight = container.scrollHeight
      stateRef.current.isUserScrolled =
        scrollTop + clientHeight < scrollHeight - 100
    }

    const observer = new ResizeObserver(handleResize)
    observer.observe(container.firstElementChild ?? container)
    handleResize()

    container.addEventListener('scroll', handleScroll)

    return () => {
      observer.disconnect()
      container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      {...props}
      className={cn(
        'fd-scroll-container flex min-w-0 flex-col overflow-y-auto',
        props.className
      )}
    >
      {props.children}
    </div>
  )
}

function Input(props: ComponentProps<'textarea'>) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  const shared = cn('col-start-1 row-start-1', props.className)

  return (
    <div className='grid flex-1'>
      <textarea
        id={id}
        {...props}
        className={cn(
          'resize-none bg-transparent placeholder:text-fd-muted-foreground focus-visible:outline-none',
          shared
        )}
      />
      <div ref={ref} className={cn(shared, 'invisible break-all')}>
        {`${props.value?.toString() ?? ''}\n`}
      </div>
    </div>
  )
}

const roleName: Record<string, string> = {
  user: 'you',
  assistant: 'assistant',
}

function Message({
  message,
  isInProgress,
  ...props
}: {
  message: MyUIMessage
  isInProgress: boolean
} & ComponentProps<'div'>) {
  const parts = (message.parts ?? []) as MyUIMessage['parts']

  return (
    <div {...props}>
      <p
        className={cn(
          'mb-1 font-medium text-fd-muted-foreground text-sm',
          message.role === 'assistant' && 'text-fd-primary'
        )}
      >
        {roleName[message.role] ?? 'unknown'}
      </p>
      <div className='flex flex-col gap-2'>
        <MessageMetadata inProgress={isInProgress} parts={parts} />
        {parts.map((part, idx) => {
          if (part.type !== 'text') return null
          return (
            <div key={`${message.id}-text-${idx}`} className='prose text-sm'>
              <Markdown text={part.text} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function AISearchTrigger() {
  const [open, setOpen] = useState(false)
  const chat = useChat({
    id: 'search',
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      setOpen(false)
      e.preventDefault()
    }

    if (e.key === '/' && (e.metaKey || e.ctrlKey) && !open) {
      setOpen(true)
      e.preventDefault()
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: biome doesn't understand the effect
  useEffect(() => {
    const listener = (e: KeyboardEvent) => onKeyPress(e)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  return (
    <Context value={useMemo(() => ({ chat, open, setOpen }), [chat, open])}>
      <style>
        {`
        @keyframes ask-ai-open {
          from {
            translate: 100% 0;
          }
        }
        
        @keyframes ask-ai-close {
          to {
            translate: 100% 0;
            opacity: 0;
          }
        }`}
      </style>
      <Presence present={open}>
        <div
          className={cn(
            'fixed inset-y-2 z-30 flex flex-col rounded-2xl border bg-fd-popover p-2 text-fd-popover-foreground shadow-lg max-sm:inset-x-2 sm:end-2 sm:w-[460px]',
            open
              ? 'animate-[ask-ai-open_300ms]'
              : 'animate-[ask-ai-close_300ms]'
          )}
        >
          <Header />
          <List
            className='flex-1 overscroll-contain px-3 py-4'
            style={{
              maskImage:
                'linear-gradient(to bottom, transparent, white 1rem, white calc(100% - 1rem), transparent 100%)',
            }}
          >
            <div className='flex flex-col gap-4'>
              {chat.messages
                .filter((msg) => msg.role !== 'system')
                .map((item, idx) => (
                  <Message
                    key={item.id}
                    message={item as MyUIMessage}
                    isInProgress={
                      chat.messages.length - 1 === idx &&
                      (chat.status === 'streaming' ||
                        chat.status === 'submitted')
                    }
                  />
                ))}
            </div>
            {(chat.status === 'streaming' || chat.status === 'submitted') && (
              <LoaderCircleIcon className='size-4 animate-spin text-fd-muted-foreground' />
            )}
          </List>
          <div className='rounded-xl border bg-fd-card text-fd-card-foreground has-focus-visible:ring-2 has-focus-visible:ring-fd-ring'>
            <SearchAIInput />
            <div className='flex items-center gap-1.5 p-2'>
              <SearchAIActions />
            </div>
          </div>
        </div>
      </Presence>
      <button
        className={cn(
          'fixed bottom-4 z-20 flex h-10 w-24 items-center gap-2 gap-3 rounded-2xl border bg-fd-secondary px-2 font-medium text-fd-muted-foreground text-sm shadow-lg transition-[translate,opacity]',
          'end-[calc(var(--removed-body-scroll-bar-size,0px)+var(--fd-layout-offset)+1rem)]',
          open && 'translate-y-10 opacity-0'
        )}
        onClick={() => setOpen(true)}
        type='button'
      >
        <MessageCircleIcon className='size-4.5' />
        Ask AI
      </button>
    </Context>
  )
}
