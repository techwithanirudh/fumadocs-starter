'use client'
import { useThemeManagement } from '@/hooks/use-theme-management'
import { type FetchedTheme, extractThemeColors } from '@/lib/theme/utils'
import { cn } from '@/lib/cn'
import {
  CheckCircle,
  LoaderIcon,
  MoonIcon,
  PaintBucketIcon,
  PlusIcon,
  Search,
  ShuffleIcon,
  SunIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ResponsivePopover,
  ResponsivePopoverContent,
  ResponsivePopoverTrigger,
} from '@/components/ui/responsive-popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ImportThemeDialog } from './import-theme-dialog'
import { useTheme } from 'next-themes'

type ThemeButtonProps = {
  theme: FetchedTheme
  isSelected: boolean
  onSelect: (theme: FetchedTheme) => void
  currentMode: 'light' | 'dark'
}

function ThemeButton({
  theme,
  isSelected,
  onSelect,
  currentMode,
}: ThemeButtonProps) {
  const colors =
    'error' in theme && theme.error
      ? []
      : 'preset' in theme
        ? extractThemeColors(theme.preset, currentMode)
        : []

  return (
    <button
      type='button'
      key={theme.url}
      onClick={() => onSelect(theme)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(theme)
        }
      }}
      className={cn(
        'w-full cursor-pointer overflow-hidden rounded-lg border transition-all duration-200 hover:scale-[1.02] hover:shadow-md',
        isSelected
          ? 'border-primary shadow-sm ring-2 ring-primary/20'
          : 'border-border hover:border-primary/50',
        'error' in theme &&
          theme.error &&
          'cursor-not-allowed opacity-50 hover:scale-100'
      )}
      disabled={'error' in theme && !!theme.error}
    >
      <div className='flex items-center justify-between p-3'>
        <div className='text-left'>
          <div className='font-medium text-sm'>{theme.name}</div>
          {isSelected && (
            <div className='text-muted-foreground text-xs'>
              Currently active
            </div>
          )}
        </div>
        {isSelected && (
          <div className='flex h-5 w-5 shrink-0 items-center justify-center'>
            <CheckCircle className='size-4 text-primary' />
          </div>
        )}
      </div>
      {colors.length > 0 && (
        <div className='flex h-2'>
          {colors.map((color, index) => (
            <div
              key={index}
              className='flex-1'
              style={{
                backgroundColor: color,
              }}
            />
          ))}
        </div>
      )}
      {'error' in theme && theme.error && (
        <div className='p-3 pt-2 text-destructive text-xs'>
          Error: {theme.error}
        </div>
      )}
    </button>
  )
}

export function ThemeSwitcher() {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

  const { resolvedTheme } = useTheme()
  const currentMode = resolvedTheme === 'dark' ? 'dark' : 'light'
  const {
    searchQuery,
    setSearchQuery,
    selectedThemeUrl,
    isLoadingThemes,
    filteredThemes,
    handleThemeImported,
    handleThemeSelect,
    randomizeTheme,
  } = useThemeManagement()

  return (
    <>
      <ImportThemeDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onThemeImported={handleThemeImported}
      />
      <div className='flex items-center gap-2'>
        <ResponsivePopover modal={false}>
          <ResponsivePopoverTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              className='flex size-8 items-center rounded-md'
            >
              <PaintBucketIcon className='h-3.5 w-3.5' />
            </Button>
          </ResponsivePopoverTrigger>

          <ResponsivePopoverContent
            align='end'
            className='w-full p-0 md:w-80'
            title='Theme Selector'
            description='Choose a theme for your interface'
          >
            {/* Note: Title and description are already in ResponsivePopoverContent */}
            <Separator className='hidden md:block' />

            {/* Search Input */}
            <div className='hidden p-2 md:block'>
              <div className='relative'>
                <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground' />
                <Input
                  placeholder='Search themes...'
                  className='h-9 rounded-none border-none bg-popover pl-10 shadow-none dark:bg-popover'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Separator />

            {/* Theme Count and Controls */}
            <div className='flex items-center justify-between px-3 py-2'>
              <div className='text-muted-foreground text-sm'>
                {isLoadingThemes
                  ? 'Loading...'
                  : `${filteredThemes.length} themes`}
              </div>
              <div className='flex items-center gap-1'>
                {/* Randomizer */}
                <Button
                  variant='ghost'
                  size='icon'
                  className='size-7'
                  onClick={randomizeTheme}
                  disabled={isLoadingThemes || filteredThemes.length === 0}
                  title='Random theme'
                >
                  <ShuffleIcon className='h-3.5 w-3.5' />
                  <span className='sr-only'>Random theme</span>
                </Button>

                {/* Import Button */}
                <Button
                  variant='secondary'
                  size='sm'
                  className='h-7 text-xs'
                  onClick={(e) => {
                    e.preventDefault()
                    setIsImportDialogOpen(true)
                  }}
                >
                  <PlusIcon className='h-3.5 w-3.5' />
                  Import
                </Button>
              </div>
            </div>
            <Separator />

            {/* Themes List */}
            <ScrollArea className='h-80'>
              <div className='p-3'>
                {isLoadingThemes ? (
                  <div className='flex items-center justify-center gap-2 py-8 text-muted-foreground'>
                    <LoaderIcon className='size-4 animate-spin' />
                    Loading themes...
                  </div>
                ) : (
                  <>
                    {filteredThemes.filter((theme) => theme.type === 'custom')
                      .length > 0 && (
                      <div className='mt-2 mb-6'>
                        <h4 className='mb-1 text-muted-foreground text-xs'>
                          My Themes
                        </h4>
                        <div className='mt-1 grid grid-cols-1 gap-2'>
                          {filteredThemes
                            .filter((theme) => theme.type === 'custom')
                            .map((theme) => (
                              <ThemeButton
                                key={theme.url}
                                theme={theme}
                                isSelected={selectedThemeUrl === theme.url}
                                onSelect={handleThemeSelect}
                                currentMode={currentMode}
                              />
                            ))}
                        </div>
                      </div>
                    )}
                    <div className='mb-2'>
                      <h4 className='mb-1 text-muted-foreground text-xs'>
                        Built-in Themes
                      </h4>
                      <div className='mt-1 grid grid-cols-1 gap-2'>
                        {filteredThemes
                          .filter((theme) => theme.type === 'built-in')
                          .map((theme) => (
                            <ThemeButton
                              key={theme.url}
                              theme={theme}
                              isSelected={selectedThemeUrl === theme.url}
                              onSelect={handleThemeSelect}
                              currentMode={currentMode}
                            />
                          ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </ResponsivePopoverContent>
        </ResponsivePopover>
      </div>
    </>
  )
}
