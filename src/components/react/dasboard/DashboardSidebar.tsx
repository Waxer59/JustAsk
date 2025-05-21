import { getUiTranslations } from '@/i18n/utils'
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  Sidebar,
  SidebarGroupLabel,
  SidebarTrigger
} from '@/ui/sidebar'
import { getRelativeLocaleUrl } from 'astro:i18n'
import { Book, NotebookPen, UsersRound } from 'lucide-react'

const { t, lang } = getUiTranslations()

const items = [
  {
    title: t('dasboard.sidebar.surveys'),
    url: getRelativeLocaleUrl(lang, '/dashboard'),
    icon: NotebookPen
  },
  {
    title: t('dashboard.sidebar.study'),
    url: getRelativeLocaleUrl(lang, '/dashboard/study'),
    icon: Book
  },
  {
    title: t('dashboard.sidebar.agents'),
    url: getRelativeLocaleUrl(lang, '/dashboard/agents'),
    icon: UsersRound
  }
]

export const DashboardSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarTrigger
          className="mx-auto mt-4 p-5 [&_svg]:size-6 w-[90%] px-4 sm:hidden md:flex"
          size="lg"
        />
        <SidebarGroup>
          <SidebarGroupLabel>{t('dashboard.sidebar.label')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
