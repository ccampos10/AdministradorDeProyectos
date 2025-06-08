"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, CheckCircle2, Clock, ListTodo, User, LogOut } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LoadingPage } from "@/components/loading-screen"

import { getMisTareas } from "@/lib/data"
import { logout } from "@/lib/login"

type Priority = "high" | "medium" | "low"
type Status = "pending" | "in-progress" | "completed"

export type Task = {
  id: string
  title: string
  description: string
  priority: Priority
  dueDate: Date
  assignee: string
  status: Status
  createdAt: Date
  notes: string
}

type Person = {
  name: string
  email: string
}

// Priority color mapping
const priorityColors: Record<Priority, string> = {
  high: "bg-red-100 border-red-500 text-red-700",
  medium: "bg-yellow-100 border-yellow-500 text-yellow-700",
  low: "bg-green-100 border-green-500 text-green-700",
}

const priorityBadgeColors: Record<Priority, string> = {
  high: "bg-red-500 hover:bg-red-600",
  medium: "bg-yellow-500 hover:bg-yellow-600",
  low: "bg-green-500 hover:bg-green-600",
}

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0,
    dueSoon: 0,
  })


  useEffect(() => {
    getMisTareas()
    .then((data) => {
      setTasks(data)

      // Calculate stats
      const today = new Date()
      const nextWeek = new Date()
      nextWeek.setDate(today.getDate() + 7)

      setStats({
        total: data.length,
        pending: data.filter((t) => t.status === "pending").length,
        inProgress: data.filter((t) => t.status === "in-progress").length,
        completed: data.filter((t) => t.status === "completed").length,
        highPriority: data.filter((t) => t.priority === "high" && t.status !== "completed").length,
        dueSoon: data.filter((t) => t.status !== "completed" && t.dueDate >= today && t.dueDate <= nextWeek).length,
      })
      setLoading(false)
    })
    .catch((error) => {
      console.error("Error al obtener las tareas:", error);
      window.location.href = "/";
    })
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
    <div className="relative flex-1">
      {isLoading && <LoadingPage message="Cargando datos..." />}
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tareas Totales</CardTitle>
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">{stats.completed} completadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">{stats.inProgress} en progreso</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Alta Prioridad</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-red-500"
              >
                <path d="M12 2v20M12 2l-8 8M12 2l8 8" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.highPriority}</div>
              <p className="text-xs text-muted-foreground">Requieren atención inmediata</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Próximos Vencimientos</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.dueSoon}</div>
              <p className="text-xs text-muted-foreground">Tareas que vencen esta semana</p>
            </CardContent>
          </Card>
        </div>

        {/* <div className="grid gap-4 md:grid-cols-2"> */}
        <div>
          {/* <Card className="col-span-1"> */}
          <Card>
            <CardHeader>
              <CardTitle>Tareas Pendientes</CardTitle>
              <CardDescription>Tareas que requieren atención</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tasks
                  .filter((task) => task.status !== "completed")
                  .sort((a, b) => {
                    // Sort by priority first (high > medium > low)
                    const priorityOrder = { high: 0, medium: 1, low: 2 }
                    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                      return priorityOrder[a.priority] - priorityOrder[b.priority]
                    }
                    // Then sort by due date
                    return a.dueDate.getTime() - b.dueDate.getTime()
                  })
                  .slice(0, 5)
                  .map((task) => (
                    <div key={task.id} className={`${priorityColors[task.priority]} border-l-4 p-3 rounded-md`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-sm">{task.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <CalendarIcon className="h-3 w-3" />
                            <span className="text-xs">{format(task.dueDate, "MMM dd")}</span>
                            <User className="h-3 w-3 ml-2" />
                            <span className="text-xs">{task.assignee}</span>
                          </div>
                        </div>
                        <Badge className={priorityBadgeColors[task.priority]}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}

                {tasks.filter((task) => task.status !== "completed").length === 0 && (
                  <div className="text-center py-6">
                    <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                    <p className="mt-2 text-sm text-muted-foreground">No hay tareas pendientes</p>
                  </div>
                )}

                <div className="mt-4 text-center">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/tasks">Ver todas las tareas</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
