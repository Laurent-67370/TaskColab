
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  LayoutDashboard, 
  FolderPlus, 
  Calendar,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Projets',
    href: '/projects',
    icon: FolderPlus
  },
  {
    name: 'Mes tâches',
    href: '/tasks',
    icon: Calendar
  },
  {
    name: 'Équipe',
    href: '/team',
    icon: Users
  },
  {
    name: 'Paramètres',
    href: '/settings',
    icon: Settings
  }
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div 
      className={cn(
        "relative flex h-screen flex-col border-r bg-muted/50 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      <div className="flex h-16 items-center border-b px-4">
        {!collapsed && (
          <span className="font-semibold text-foreground">Navigation</span>
        )}
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 py-4">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-10",
                    collapsed ? "px-2" : "px-4"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
                  {!collapsed && <span>{item.name}</span>}
                </Button>
              </Link>
            )
          })}
        </div>
        
        <Separator className="my-4" />
        
        {!collapsed && (
          <div className="py-4">
            <p className="text-xs font-medium text-muted-foreground mb-2 px-4">
              PROJETS RÉCENTS
            </p>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start h-8 px-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm">Site Web</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start h-8 px-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm">App Mobile</span>
              </Button>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
