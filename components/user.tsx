"use client"
import { User, LogOut, UserCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface UserMenuProps {
  userName?: string
  userImage?: string
  onProfileClick?: () => void
  onLogoutClick?: () => void
}

export function UserMenu({
  userName = "Usuario",
  userImage,
  onProfileClick = () => console.log("Navegando a perfil"),
  onLogoutClick = () => console.log("Cerrando sesión"),
}: UserMenuProps) {
  return (
    // <div className="fixed top-4 right-4 z-50">
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              {/* <AvatarImage src={userImage || "/placeholder.svg"} alt={userName} /> */}
              {/* <User className="mr-2 h-10 w-10" /> */}
              <AvatarFallback className="bg-primary/10">
                <UserCircle className="h-6 w-6 text-primary" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">{userName}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onProfileClick} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Mi perfil</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogoutClick} className="cursor-pointer text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
