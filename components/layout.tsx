"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home, ListTodo, Menu, UserRoundCog, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserMenu } from "@/components/user"
import { cn } from "@/lib/utils"

import { logout, verifyAdmin } from "@/lib/login"

interface TaskManagementLayoutProps {
  titulo: string,
  mensaje: string,
  children: React.ReactNode
}

const baseNavItems = [
  {
    name: "Inicio",
    href: "/home",
    icon: <Home className="h-5 w-5" />,
  },
  {
    name: "Tareas",
    href: "/tasks",
    icon: <ListTodo className="h-5 w-5" />,
  },
]

export default function TaskManagementLayout({ titulo, mensaje, children }: TaskManagementLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [navItems, setNavItems] = useState(baseNavItems)
  const pathname = usePathname()

  useEffect(() => {
    verifyAdmin()
    .then((res) => {
      if (res?.mensaje == "Es admin") {
        setNavItems([
          ... navItems,
          {
            name: "Administrar equipo",
            href: "/users",
            icon: <UserRoundCog className="h-5 w-5" />,
          },
          {
            name: "Resumen",
            href: "/resumen",
            icon: <FileText className="h-5 w-5" />,
          },
        ]);
      }
    })
    .catch((err) => {
      console.error(err);
    });
  }, [])

  const logoutHandler = () => {
    logout()
    .then((_) => {
      window.location.href = "/"
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error)
    })
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 hidden h-full w-64 flex-col border-r bg-background transition-all duration-300 md:flex",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <h2 className="text-lg font-semibold">Task Manager</h2>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <ChevronRight className={cn("h-5 w-5 transition-transform", !sidebarOpen && "rotate-180")} />
          </Button>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-14 items-center border-b px-4">
            <h2 className="text-lg font-semibold">Task Manager</h2>
          </div>
          <nav className="flex-1 overflow-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    )}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className={cn("flex-1 overflow-auto transition-all duration-300", sidebarOpen ? "md:ml-64" : "md:ml-0")}>
        <div className="container mx-auto p-4 md:p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">{titulo}</h1>
              <p className="text-muted-foreground">{mensaje}</p>
            </div>

            <div className="flex items-center gap-4">
              <UserMenu
                userName="Usuario"
                userImage="/placeholder.svg"
                onProfileClick={() => console.log("Navegando a perfil")}
                onLogoutClick={logoutHandler}
              />
            </div>

            {/* <div className="flex items-center gap-4">
              <Button onClick={logoutHandler} variant="link" className="text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </Button>
            </div> */}
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
