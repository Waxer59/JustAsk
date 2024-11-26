import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/ui/dropdown-menu'
import { UserIcon } from 'lucide-react'

export const ProfileButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 transition-colors duration-200 hover:bg-zinc-900 rounded-md">
        <UserIcon size={24} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
