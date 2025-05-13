"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, PlusCircle, Edit, Trash2, User, Filter, X, PenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { getTareas, createTarea, deleteTarea, updateTarea } from "@/lib/data"

type Priority = "high" | "medium" | "low"
type Role = "worker" | "manager"
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

const statusBadgeColors: Record<Status, string> = {
  pending: "bg-blue-500 hover:bg-blue-600",
  "in-progress": "bg-purple-500 hover:bg-purple-600",
  completed: "bg-gray-500 hover:bg-gray-600",
}

export default function TaskManagementSystem() {
  const [role, setRole] = useState<Role>("worker")
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all")
  const [filterAssignee, setFilterAssignee] = useState<string | "all">("all")
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all")
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false)
  const [taskNotes, setTaskNotes] = useState("")

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [dueDate, setDueDate] = useState<Date>(new Date())
  const [assignee, setAssignee] = useState("")
  const [status, setStatus] = useState<Status>("pending")

  // let data = await getTareas()

  // Initialize with sample tasks
  useEffect(() => {
    getTareas().then((res) => { setTasks(res); setFilteredTasks(res); });
    setTasks([])
    setFilteredTasks([])
  }, [])

  // Apply filters
  useEffect(() => {
    let result = [...tasks]

    if (filterPriority !== "all") {
      result = result.filter((task) => task.priority === filterPriority)
    }

    if (filterAssignee !== "all") {
      result = result.filter((task) => task.assignee === filterAssignee)
    }

    if (filterStatus !== "all") {
      result = result.filter((task) => task.status === filterStatus)
    }

    setFilteredTasks(result)
  }, [tasks, filterPriority, filterAssignee, filterStatus])

  const resetFilters = () => {
    setFilterPriority("all")
    setFilterAssignee("all")
    setFilterStatus("all")
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setPriority("medium")
    setDueDate(new Date())
    setAssignee("")
    setStatus("pending")
    setCurrentTask(null)
    setIsEditMode(false)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (task: Task) => {
    setCurrentTask(task)
    setTitle(task.title)
    setDescription(task.description)
    setPriority(task.priority)
    setDueDate(task.dueDate)
    setAssignee(task.assignee)
    setStatus(task.status)
    setIsEditMode(true)
    setIsDialogOpen(true)
  }

  const openNotesDialog = (task: Task) => {
    setCurrentTask(task)
    setTaskNotes(task.notes || "")
    setIsNotesDialogOpen(true)
  }

  const handleCreateTask = () => {
    if (!title || !assignee) return

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      priority,
      dueDate,
      assignee,
      status,
      createdAt: new Date(),
      notes: "",
    }

    createTarea(newTask)
    .then((res) => {
      setTasks([...tasks, res]);
    })

    // setTasks([...tasks, newTask])
    setIsDialogOpen(false)
    resetForm()
  }

  const handleUpdateTask = () => {
    if (!currentTask || !title || !assignee) return

    const updatedTask: Task = {
      ...currentTask,
      title,
      description,
      priority,
      dueDate,
      assignee,
      status,
    }
    updateTarea(currentTask.id, updatedTask)
    .then((res) => {
      const updatedTasks = tasks.map((task) =>
        task.id === currentTask.id ? res : task,
      )
      setTasks(updatedTasks)
    })
    
    setIsDialogOpen(false)
    resetForm()
  }

  const handleDeleteTask = (taskId: string) => {
    deleteTarea(taskId)
    .then((fueEliminado) => {
      if (fueEliminado) {
        setTasks(tasks.filter((task) => task.id !== taskId))
      }
    })
  }

  const handleSaveNotes = () => {
    if (!currentTask) return

    const updatedTask: Task = {
      ...currentTask,
      notes: taskNotes,
    }
    updateTarea(currentTask.id, updatedTask)
    .then((res) => {
      const updatedTasks = tasks.map((task) =>
        task.id === currentTask.id ? res : task,
      )
      setTasks(updatedTasks)
    })

    setIsNotesDialogOpen(false)
    setCurrentTask(null)
  }

  const getAssigneeName = (id: string) => {
    const person = teamMembers.find((member) => member.id === id)
    return person ? person.name : "Unassigned"
  }

  const canEditDelete = (task: Task) => {
    return role === "manager" || (role === "worker" && task.assignee === "1") // Assuming user ID 1 is the current worker
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Tareas</h1>
          <p className="text-muted-foreground">Administra todas las tareas del equipo</p>
        </div>

        <div className="flex items-center gap-4">
          <Select value={role} onValueChange={(value: Role) => setRole(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="worker">Trabajador</SelectItem>
              <SelectItem value="manager">Gerente de Proyecto</SelectItem>
            </SelectContent>
          </Select>

          {(role === "manager" || role === "worker") && (
            <Button onClick={openCreateDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Tarea
            </Button>
          )}
        </div>
      </div>

      <div className="bg-muted/40 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Filters</h2>
          <div className="flex flex-wrap gap-2">
            <Select value={filterPriority} onValueChange={(value: Priority | "all") => setFilterPriority(value)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterAssignee} onValueChange={(value) => setFilterAssignee(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={(value: Status | "all") => setFilterStatus(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={resetFilters}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="w-full">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <h3 className="text-xl font-medium text-muted-foreground">No tasks found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or create a new task</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <Card
                  key={task.id}
                  className={`${priorityColors[task.priority]} border-l-4 hover:shadow-md transition-shadow`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
                      {canEditDelete(task) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Filter className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(task)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openNotesDialog(task)}>
                              <PenLine className="mr-2 h-4 w-4" />
                              Añadir notas
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteTask(task.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4 line-clamp-2">{task.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>Due: {format(task.dueDate, "MMM dd, yyyy")}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <User className="mr-2 h-4 w-4" />
                        <span>{getAssigneeName(task.assignee)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between">
                    <Badge className={priorityBadgeColors[task.priority]}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                    <Badge className={statusBadgeColors[task.status]}>
                      {task.status
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="w-full">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <h3 className="text-xl font-medium text-muted-foreground">No tasks found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or create a new task</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`${priorityColors[task.priority]} border-l-4 p-4 rounded-lg flex flex-col md:flex-row justify-between gap-4`}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 md:gap-4">
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      <span>{format(task.dueDate, "MMM dd")}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <User className="mr-1 h-4 w-4" />
                      <span>{getAssigneeName(task.assignee)}</span>
                    </div>
                    <Badge className={priorityBadgeColors[task.priority]}>{task.priority}</Badge>
                    <Badge className={statusBadgeColors[task.status]}>{task.status}</Badge>

                    {canEditDelete(task) && (
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(task)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Task" : "Create New Task"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Make changes to the existing task." : "Fill in the details to create a new task."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value: Status) => setStatus(value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => date && setDueDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={isEditMode ? handleUpdateTask : handleCreateTask}>
              {isEditMode ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Añadir Notas</DialogTitle>
            <DialogDescription>Añade notas adicionales para esta tarea.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={taskNotes}
                onChange={(e) => setTaskNotes(e.target.value)}
                placeholder="Añade notas sobre esta tarea..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotesDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveNotes}>Guardar Notas</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
