"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

import { login } from "@/lib/login"

// Pendientes
// - Poner una imagen real del proyecto en la pagina de inicio
// - agregar un indicador de tareas fuera de la fecha limite en la pagina de home
// - modificar el sistema de roles en la pagina de tareas, para que los administradores puedan editar todas las tareas, y los usuarios solo las propias
// - Implementar sistema para los iconos con las iniciales del nombre
// - eliminar y modificar secciones en la pagina de resumen
// - mejorar colores en la pagina de resumen
// - destacar las tareas fuera de limite en la pagina de resumen

export default function LandingPage() {
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica de autenticación
    login(email, password)
    .then((res) => {
      if (res) { window.location.href = "/home" }
    })
    .catch((error) => {
      console.error("Error de inicio de sesión:", error)
      window.alert("Error de inicio de sesión")
      // Manejar el error de inicio de sesión aquí
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-black text-white rounded-full p-2 mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-mountain-snow"
            >
              <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
              <path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19" />
            </svg>
          </div>
          <span className="font-bold text-xl">CallampinesUP</span>
        </div>
        <Button
          className="bg-white text-black border-black border hover:bg-gray-100"
          onClick={() => setShowLoginForm(true)}
        >
          Iniciar sesión
        </Button>
      </header>
      <div className="container mx-auto px-4 py-4 flex justify-center items-center">
        <h2 className="font-bold bg-yellow-500 text-white px-2 py-1 rounded">Pagina temporal, agregar imagen de ejemplo y cambiar nobre de la app</h2>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Text Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">La plataforma integral para proyectos</h1>
          <p className="text-lg text-gray-700">
            CallampinesUP es una plataforma la cual facilita el trabajo en equipo, mostrando las tareas de cada
            integrante en tiempo real y mucho más conectivos. Así, los proyectos son más eficientes y rápidos. Ahorra tu
            tiempo y consigue más tiempo libre.
          </p>
          <ul className="space-y-2 list-disc list-inside text-gray-700">
            <li>Buenas prácticas de gestión de proyectos coherentes y a escala.</li>
            <li>Visualiza y gestiona tus tareas asignadas en tiempo real.</li>
            <li>Deja comentarios y registra detalles importantes dentro de cada tarea.</li>
            <li>Crea cuentas, asigna roles y controla el acceso del equipo.</li>
            <li>Contacta fácilmente con otros miembros o soporte técnico.</li>
          </ul>
          <div className="pt-4">
            <Button asChild size="lg" className="mr-4">
              <Link href="/home">Comenzar ahora</Link>
            </Button>
          </div>
        </div>

        {/* Right Column - Dashboard Preview */}
        <div className="bg-gradient-to-br from-green-50 to-transparent p-6 rounded-xl shadow-sm">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Mock Navigation */}
            <div className="border-b p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="font-semibold">Task Manager</span>
                <span className="text-gray-400">›</span>
              </div>
            </div>

            {/* Mock Dashboard */}
            <div className="p-6">
              <h2 className="text-xl font-bold mb-1">Mi Resumen</h2>
              <p className="text-sm text-gray-500 mb-4">Resumen de mis tareas</p>

              {/* Task Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">Tareas asignadas</p>
                        <p className="text-2xl font-bold">1</p>
                        <p className="text-xs text-gray-500">1 completada</p>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <path d="M8 3H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1" />
                        <path d="M12 17v.01" />
                        <path d="M12 14v-4" />
                        <path d="M16 3h-8a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">Tareas pendientes</p>
                        <p className="text-2xl font-bold">2</p>
                        <p className="text-xs text-gray-500">1 en progreso</p>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">Alta prioridad</p>
                        <p className="text-2xl font-bold">2</p>
                        <p className="text-xs text-gray-500">Requiere atención inmediata</p>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-red-500"
                      >
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <path d="M12 9v4" />
                        <path d="M12 17h.01" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">Próximos a vencer</p>
                        <p className="text-2xl font-bold">2</p>
                        <p className="text-xs text-gray-500">Tareas que vencen esta semana</p>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Task List */}
              <div>
                <h3 className="text-md font-semibold mb-3">Mis tareas</h3>
                <p className="text-xs text-gray-500 mb-4">Tareas que están asignadas</p>

                <div className="space-y-3">
                  {/* High Priority Task */}
                  <div className="bg-red-50 border-l-4 border-red-500 rounded-md p-3">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">Crear boceto de las prendas</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span>Día 22</span>
                          <span className="mx-2">•</span>
                          <span>John Doe</span>
                        </div>
                      </div>
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">ALTA</span>
                    </div>
                  </div>

                  {/* Another High Priority Task */}
                  <div className="bg-red-50 border-l-4 border-red-500 rounded-md p-3">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">Crear boceto de las prendas</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span>Día 22</span>
                          <span className="mx-2">•</span>
                          <span>John Doe</span>
                        </div>
                      </div>
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">ALTA</span>
                    </div>
                  </div>

                  {/* Medium Priority Task */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-md p-3">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">Crear boceto de las prendas</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span>Día 22</span>
                          <span className="mx-2">•</span>
                          <span>John Doe</span>
                        </div>
                      </div>
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">MEDIA</span>
                    </div>
                  </div>

                  {/* Low Priority Task */}
                  <div className="bg-green-50 border-l-4 border-green-500 rounded-md p-3">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">Crear boceto de las prendas</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span>Día 22</span>
                          <span className="mx-2">•</span>
                          <span>John Doe</span>
                        </div>
                      </div>
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">BAJA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Login Popup */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => setShowLoginForm(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <h2 className="text-2xl font-bold mb-6">Iniciar sesión</h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Iniciar sesión
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
