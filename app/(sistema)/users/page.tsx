"use client"

import { useEffect, useState } from "react"
import { PlusCircle, Search, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { LoadingPage } from "@/components/loading-screen"
import { getUsersAdmin, addUser, editUser, deleteUser } from "@/lib/login"

type usuario = {
  id: number,
  name: string,
  email: string,
  role: string,
}

type usuarioEdit = {
  id: number,
  name: string,
  email: string,
  emailOld: string,
  role: string,
  password: string,
}

const emptyUser: usuarioEdit = {
  id: 0,
  name: "",
  email: "",
  emailOld: "",
  role: "",
  password: "",
}

// Datos de ejemplo para usuarios
// const initialUsers: usuario[] = [
//   {
//     id: 1,
//     name: "Carlos Rodríguez",
//     email: "carlos@ejemplo.com",
//     role: "Admin",
//     status: "Activo",
//     lastLogin: "2023-05-12T10:30:00",
//     createdAt: "2023-01-15T08:45:00",
//   },
//   {
//     id: 2,
//     name: "María López",
//     email: "maria@ejemplo.com",
//     role: "Usuario",
//     status: "Activo",
//     lastLogin: "2023-05-10T14:20:00",
//     createdAt: "2023-02-20T11:30:00",
//   },
//   {
//     id: 3,
//     name: "Juan Pérez",
//     email: "juan@ejemplo.com",
//     role: "Editor",
//     status: "Inactivo",
//     lastLogin: "2023-04-28T09:15:00",
//     createdAt: "2023-03-05T16:45:00",
//   },
//   {
//     id: 4,
//     name: "Ana Martínez",
//     email: "ana@ejemplo.com",
//     role: "Usuario",
//     status: "Activo",
//     lastLogin: "2023-05-11T16:40:00",
//     createdAt: "2023-03-10T10:20:00",
//   },
//   {
//     id: 5,
//     name: "Roberto Sánchez",
//     email: "roberto@ejemplo.com",
//     role: "Usuario",
//     status: "Suspendido",
//     lastLogin: "2023-04-15T11:25:00",
//     createdAt: "2023-04-01T09:10:00",
//   },
// ]

export default function AdminUsersPage() {
  const [isLoading, setLoading] = useState(true);
  const [users, setUsers] = useState<usuario[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("Todos")
  // const [statusFilter, setStatusFilter] = useState("Todos")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<usuarioEdit>(emptyUser)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Trabajador",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    getUsersAdmin()
    .then((res) => {
      setUsers(res);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error al obtener los usuarios:", error);
      window.location.href = "/";
    })
  }, [])

  // Filtrar usuarios basado en búsqueda y filtros
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "Todos" || user.role === roleFilter
    // const matchesStatus = statusFilter === "Todos" || user.status === statusFilter

    return matchesSearch && matchesRole// && matchesStatus
  })

  // Manejar la adición de un nuevo usuario
  const handleAddUser = () => {
    if (newUser.name == "" || newUser.email == "" || newUser.password == "" || newUser.confirmPassword == "") {
      alert("Datos faltantes")
      return
    }

    if (!newUser.email.includes("@")) {
      alert("Ingrese un correo valido")
      return
    }

    if (newUser.password !== newUser.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    addUser(newUser.name, newUser.email, newUser.password, newUser.role)
    .then((res) => {
      setUsers([... users, res])
    })
    .catch((err) => {
      console.error(err);
    });

    setNewUser({
      name: "",
      email: "",
      role: "Trabajador",
      password: "",
      confirmPassword: "",
    })

    setIsAddUserOpen(false)
  }

  // Manejar la edición de un usuario
  const handleEditUser = () => {
    const user = users.filter((user) => user.email == currentUser.emailOld)[0];
    editUser(
      currentUser.name == user.name ? "" : currentUser.name,
      currentUser.email == user.email ? "" : currentUser.email,
      currentUser.emailOld,
      currentUser.password,
      currentUser.role == user.role ? "" : currentUser.role
    )
    .then((res) => {
      setUsers([...users.filter((user) => user.email != currentUser.emailOld), res])
    })
    .catch((err) => {
      console.error(err)
    })

    setIsEditUserOpen(false)
  }

  // Manejar la eliminación de un usuario
  const handleDeleteUser = () => {
    deleteUser(currentUser.email)
    .then((_) => {
      setUsers(users.filter((user) => user.email != currentUser.email))
    })
    .catch((err) => {
      console.log(err)
    })
    setIsDeleteUserOpen(false)
  }

  // Preparar para editar un usuario
  const prepareEditUser = (user: usuario) => {
    setCurrentUser({... user, emailOld: user.email, password: ""})
    setIsEditUserOpen(true)
  }

  // Preparar para eliminar un usuario
  const prepareDeleteUser = (user: usuario) => {
    setCurrentUser({... user, emailOld: user.email, password: ""})
    setIsDeleteUserOpen(true)
  }

  return (
    <div className="container relative mx-auto py-8 px-4">
      {isLoading && <LoadingPage message="Cargando datos..." />}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <CardTitle>Usuarios</CardTitle>
              <CardDescription>Lista de todos los usuarios registrados en la plataforma.</CardDescription>
            </div>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 md:mt-0">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Agregar Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
                  <DialogDescription>Completa el formulario para crear un nuevo usuario en el sistema.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input
                        id="name"
                        placeholder="Tu Nombre"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@correo.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rol</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Trabajador">Trabajador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={newUser.confirmPassword}
                      onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddUser}>Guardar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 py-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por nombre o email..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos los roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Trabajador">Trabajador</SelectItem>
              </SelectContent>
            </Select>
            {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos los estados</SelectItem>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
                <SelectItem value="Suspendido">Suspendido</SelectItem>
              </SelectContent>
            </Select> */}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  {/* <TableHead>Estado</TableHead>
                  <TableHead>Último acceso</TableHead>
                  <TableHead>Fecha registro</TableHead> */}
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.email}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "Admin" ? "destructive" : user.role === "Editor" ? "outline" : "success"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      {/* <TableCell>
                        <Badge
                          variant={
                            user.status === "Activo"
                              ? "success"
                              : user.status === "Inactivo"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin !== "-" ? formatDate(user.lastLogin) : "-"}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell> */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => prepareEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => prepareDeleteUser(user)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No se encontraron usuarios.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-end">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo para editar usuario */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>Modifica la información del usuario seleccionado.</DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nombre completo</Label>
                  <Input
                    id="edit-name"
                    value={currentUser.name}
                    onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Correo electrónico</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={currentUser.email}
                    onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Rol</Label>
                <Select
                  value={currentUser.role}
                  onValueChange={(value) => setCurrentUser({ ...currentUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Trabajador">Trabajador</SelectItem>
                  </SelectContent>
                </Select>
                {/* <div className="space-y-2">
                  <Label htmlFor="edit-status">Estado</Label>
                  <Select
                    value={currentUser.status}
                    onValueChange={(value) => setCurrentUser({ ...currentUser, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                      <SelectItem value="Suspendido">Suspendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">Nueva contraseña (dejar en blanco para mantener la actual)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar eliminación */}
      <Dialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="py-4">
              <p className="mb-2">
                <strong>Usuario:</strong> {currentUser.name}
              </p>
              <p>
                <strong>Email:</strong> {currentUser.email}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteUserOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
