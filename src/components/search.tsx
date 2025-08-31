'use client'
import { useDocsSearch } from 'fumadocs-core/search/client'
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search'
import { I18nLabel, useI18n } from 'fumadocs-ui/contexts/i18n'
import { MessageCircle } from 'lucide-react'
import { AISearchTrigger } from './fumadocs/ai'
import { buttonVariants } from './ui/button'

const Empty = () => (
  <div className='flex flex-col items-center justify-between gap-2 px-2 py-12 text-center text-sm'>
    <p className='text-fd-muted-foreground text-sm'>
      <I18nLabel label='searchNoResult' />
    </p>
    <AISearchTrigger
      className={buttonVariants({
        variant: 'ghost',
        size: 'sm',
        className: '!px-1 h-auto py-0.5',
      })}
    >
      <MessageCircle className='size-4' />
      Ask AI?
    </AISearchTrigger>
  </div>
)

export default function DefaultSearchDialog(props: SharedProps) {
  const { locale } = useI18n() // (optional) for i18n
  const { search, setSearch, query } = useDocsSearch({
    type: 'fetch',
    locale,
  })

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList
          items={query.data !== 'empty' ? query.data : null}
          Empty={Empty}
        />
      </SearchDialogContent>
    </SearchDialog>
  )
}
