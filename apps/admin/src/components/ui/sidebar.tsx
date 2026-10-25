import { useState, type ReactNode } from 'react'
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Tags,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type SidebarProps = {
  activeItem?: string
}

const navigation = [
  { label: 'Overview', icon: LayoutDashboard, href: '/analysis' },
  { label: 'Analytics', icon: BarChart3, href: '/analysis' },
  { label: 'Content', icon: FileText, href: '#content' },
  { label: 'Audience', icon: Users, href: '#audience' },
  { label: 'Topics', icon: Tags, href: '/topics' },
]

function Sidebar({ activeItem = 'Analytics' }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'group relative flex w-full shrink-0 flex-col border-b bg-card p-4 transition-[width] duration-200 md:sticky md:top-0 md:h-svh md:overflow-y-auto md:border-b-0 md:border-r md:p-5',
        isCollapsed ? 'md:w-20' : 'md:w-64',
      )}
    >
      <div className="mb-8 flex items-center">
        <Link
          className={cn(
            'flex items-center gap-2 text-lg font-semibold tracking-tight',
            isCollapsed && 'justify-center',
          )}
          to="/analysis"
          title={isCollapsed ? 'Publish.com' : undefined}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
            P
          </span>
          {!isCollapsed && <span>Publish.com</span>}
        </Link>
      </div>

      <nav className="grid grid-cols-2 gap-1 md:block md:space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = item.label === activeItem

          return (
            <Link
              key={item.label}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isCollapsed && 'md:justify-center md:px-0',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
              to={item.href}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="size-4 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="mt-4 border-t pt-4 md:mt-auto">
        <Link
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
            isCollapsed && 'md:justify-center md:px-0',
          )}
          to="#settings"
          title={isCollapsed ? 'Settings' : undefined}
        >
          <Settings className="size-4 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </Link>
        <Link
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
            isCollapsed && 'md:justify-center md:px-0',
          )}
          to="/"
          title={isCollapsed ? 'Sign out' : undefined}
        >
          <LogOut className="size-4 shrink-0" />
          {!isCollapsed && <span>Sign out</span>}
        </Link>
        <div className={cn('mt-4 flex items-center gap-3 border-t px-2 pt-4', isCollapsed && 'md:justify-center md:px-0')}>
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
            AM
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Alex Morgan</p>
              <p className="truncate text-xs text-muted-foreground">admin@publish.com</p>
            </div>
          )}
        </div>
        <Button
          className={cn(
            'mt-4 hidden text-muted-foreground hover:text-foreground md:inline-flex',
            isCollapsed ? 'size-8 w-8' : 'w-full justify-start',
          )}
          type="button"
          variant="outline"
          size={isCollapsed ? 'icon' : 'sm'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setIsCollapsed((collapsed) => !collapsed)}
        >
          {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          {!isCollapsed && <span>Collapse sidebar</span>}
        </Button>
      </div>
    </aside>
  )
}

type SidebarLayoutProps = {
  children: ReactNode
}

function SidebarLayout({ children }: SidebarLayoutProps) {
  return <div className="flex min-h-svh flex-col overflow-x-hidden bg-muted/30 md:h-svh md:flex-row md:overflow-hidden">{children}</div>
}

export { Sidebar, SidebarLayout }
