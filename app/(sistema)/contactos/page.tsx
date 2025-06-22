"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MessageCircle, Phone, Mail } from "lucide-react"
import { useState, useEffect } from "react"

import { LoadingPage } from "@/components/loading-screen"
import { getUsers } from "@/lib/login"

interface User {
  name: string
  email: string
  iniciales: string
}

// Datos de ejemplo
// const mockUsers: User[] = [
//   {
//     id: "1",
//     name: "Ana García",
//     email: "ana.garcia@example.com",
//   },
//   {
//     id: "2",
//     name: "Carlos Rodríguez",
//     email: "carlos.rodriguez@example.com",
//   },
//   {
//     id: "3",
//     name: "María López",
//     email: "maria.lopez@example.com",
//   },
//   {
//     id: "4",
//     name: "Juan Martínez",
//     email: "juan.martinez@example.com",
//   },
//   {
//     id: "5",
//     name: "Laura Fernández",
//     email: "laura.fernandez@example.com",
//   },
//   {
//     id: "6",
//     name: "Diego Sánchez",
//     email: "diego.sanchez@example.com",
//   },
// ]

// function getInitials(name: string): string {
//   return name
//     .split(" ")
//     .map((word) => word.charAt(0))
//     .join("")
//     .toUpperCase()
//     .slice(0, 2)
// }

// function getStatusColor(status?: string): string {
//   switch (status) {
//     case "online":
//       return "bg-green-500"
//     case "away":
//       return "bg-yellow-500"
//     case "offline":
//       return "bg-gray-400"
//     default:
//       return "bg-gray-400"
//   }
// }

export default function UserContacts() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true);
    // Obtener usuarios
    getUsers()
    .then((res) => {
      console.log("Usuarios obtenidos:", res);
      setLoading(false);
      setUsers(res);
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      window.location.href = "/";
    });
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const copyEmailToClipboard = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiedEmail(email)
      setTimeout(() => setCopiedEmail(null), 2000)
    } catch (err) {
      console.error("Failed to copy email: ", err)
    }
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto p-6 space-y-6">
      {isLoading && <LoadingPage message="Cargando usuarios..." />}

      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar usuarios por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de contactos */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <Card key="no-users">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No se encontraron usuarios que coincidan con tu búsqueda</p>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.email} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Avatar con iniciales */}
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        {/* <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} /> */}
                        {/* <AvatarFallback className="bg-primary text-primary-foreground font-semibold"> */}
                        {/* </AvatarFallback> */}
                        <div className="absolute h-full w-full flex flex-col items-center justify-center bg-primary/10 text-lg font-semibold text-primary">
                            {user.iniciales}
                        </div>
                      </Avatar>
                    </div>

                    {/* Información del usuario */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{user.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Copiar email"
                        onClick={() => copyEmailToClipboard(user.email)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      {copiedEmail === user.email && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                          ¡Copiado!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}