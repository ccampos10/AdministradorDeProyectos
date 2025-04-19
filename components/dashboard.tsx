"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, CheckCircle2, Clock, ListTodo, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Priority = "high" | "medium" | "low"
type Status = "pending" | "in-progress" | "completed"

type Task = {
  id: string
  title: string
  description: string
  priority: Priority
  dueDate: Date
  assignee: string
  status: Status
  createdAt: Date
}

type Person = {
  id: string
  name: string
}

// Sample team members
const teamMembers: Person[] = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Alex Johnson" },
  { id: "4", name: "Sarah Williams" },
  { id: "5", name: "Michael Brown" },
]

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
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0,
    dueSoon: 0,
  })

  // Initialize with sample tasks
  useEffect(() => {
    const sampleTasks: Task[] = [
      {
        id: "1",
        title: "Design new landing page",
        description: "Create wireframes and mockups for the new product landing page",
        priority: "high",
        dueDate: new Date(2023, 11, 25),
        assignee: "1",
        status: "in-progress",
        createdAt: new Date(2023, 10, 15),
      },
      {
        id: "2",
        title: "Implement authentication system",
        description: "Set up user authentication with JWT and role-based access control",
        priority: "medium",
        dueDate: new Date(2023, 11, 30),
        assignee: "3",
        status: "pending",
        createdAt: new Date(2023, 10, 18),
      },
      {
        id: "3",
        title: "Write API documentation",
        description: "Document all API endpoints with examples and response schemas",
        priority: "low",
        dueDate: new Date(2023, 12, 5),
        assignee: "2",
        status: "pending",
        createdAt: new Date(2023, 10, 20),
      },
      {
        id: "4",
        title: "Fix navigation bug",
        description: "Address the navigation issue on mobile devices",
        priority: "high",
        dueDate: new Date(2023, 11, 22),
        assignee: "4",
        status: "pending",
        createdAt: new Date(2023, 10, 21),
      },
      {
        id: "5",
        title: "Update user profile page",
        description: "Redesign the user profile page with new layout",
        priority: "medium",
        dueDate: new Date(2023, 11, 28),
        assignee: "5",
        status: "completed",
        createdAt: new Date(2023, 10, 10),
      },
    ]
    setTasks(sampleTasks)

    // Calculate stats
    const today = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(today.getDate() + 7)

    setStats({
      total: sampleTasks.length,
      pending: sampleTasks.filter((t) => t.status === "pending").length,
      inProgress: sampleTasks.filter((t) => t.status === "in-progress").length,
      completed: sampleTasks.filter((t) => t.status === "completed").length,
      highPriority: sampleTasks.filter((t) => t.priority === "high" && t.status !== "completed").length,
      dueSoon: sampleTasks.filter((t) => t.status !== "completed" && t.dueDate >= today && t.dueDate <= nextWeek)
        .length,
    })
  }, [])

  const getAssigneeName = (id: string) => {
    const person = teamMembers.find((member) => member.id === id)
    return person ? person.name : "Unassigned"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen de tareas y actividades</p>
      </div>

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

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
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
                          <span className="text-xs">{getAssigneeName(task.assignee)}</span>
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

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribución de Tareas</CardTitle>
            <CardDescription>Asignación de tareas por miembro del equipo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => {
                const memberTasks = tasks.filter((task) => task.assignee === member.id)
                const pendingTasks = memberTasks.filter((task) => task.status !== "completed").length
                const completedTasks = memberTasks.filter((task) => task.status === "completed").length
                const totalTasks = memberTasks.length
                const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

                return (
                  <div key={member.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">{member.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {pendingTasks} pendientes / {completedTasks} completadas
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
