"use client"

import { useState, useMemo, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

interface TaskDotProps {
  task: Task
  onHover: (taskId: Task | null) => void
}

// function parseLocalDate(isoDateString: string): Date {
//   const fechaUTC = new Date(isoDateString);
//   const offsetMinutos = fechaUTC.getTimezoneOffset();
//   return new Date(fechaUTC.getTime() + offsetMinutos * 60 * 1000);
// }

const TaskDot = ({ task, onHover }: TaskDotProps) => {
  const priorityColors = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => onHover(task)}
      onMouseLeave={() => onHover(null)}
    >
      <div
        className={`cursor-pointer w-3 h-3 rounded-full ${priorityColors[task.priority]}`}
      >
      </div>
    </div>
  )
}

export default function Calendar({tasks=[]}: { tasks: Task[] }) {
  // const [hoverDay, setHoverDay] = useState<Date | null>(null)
  // const dayRef = useRef<HTMLDivElement | null>(null)
  const [hoveredTask, setHoveredTask] = useState<Task | null>(null)

  // Datos de ejemplo de tareas
  // const tasks: Task[] = [
  //   { id: "1", title: "Reunión con cliente", date: "2025-06-16", priority: "alta" },
  //   { id: "2", title: "Revisar propuesta", date: "2025-06-16", priority: "media" },
  //   { id: "3", title: "Llamada de seguimiento", date: "2025-06-16", priority: "baja" },
  //   { id: "4", title: "Presentación proyecto", date: "2025-06-17", priority: "alta" },
  //   { id: "5", title: "Entrega de documentos", date: "2025-06-18", priority: "alta" },
  //   { id: "6", title: "Revisión de código", date: "2025-06-19", priority: "media" },
  //   { id: "7", title: "Planificación sprint", date: "2025-06-20", priority: "media" },
  //   { id: "8", title: "Testing aplicación", date: "2025-06-20", priority: "baja" },
  //   { id: "9", title: "Reunión equipo", date: "2025-06-23", priority: "media" },
  //   { id: "10", title: "Backup sistemas", date: "2025-06-24", priority: "baja" },
  //   { id: "11", title: "Análisis métricas", date: "2025-07-02", priority: "media" },
  //   { id: "12", title: "Actualizar documentación", date: "2025-07-03", priority: "baja" },
  //   { id: "13", title: "Reunión stakeholders", date: "2025-06-05", priority: "alta" },
  //   { id: "14", title: "Deploy producción", date: "2025-06-09", priority: "alta" },
  //   { id: "15", title: "Capacitación usuario", date: "2025-06-10", priority: "media" },
  // ]

  // Calcular el rango de fechas (2 semanas pasadas + 2 semanas futuras)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - 14) // 2 semanas atrás

  const endDate = new Date(today)
  endDate.setDate(today.getDate() + 14) // 2 semanas adelante

  // Generar array de fechas para 4 semanas
//   const dateRange = useMemo(() => {
//     console.log("Generando rango de fechas desde", startDate, "hasta", endDate);
//     const dates = []
//     const current = new Date(startDate)

//     while (current <= endDate) {
//       dates.push(new Date(current.getTime()))
//       current.setDate(current.getDate() + 1)
//     }

//     return dates
//   }, [startDate, endDate])

  const dateRange = (() => {
    const dates = []
    const current = new Date(startDate)

    while (current <= endDate) {
      dates.push(new Date(current.getTime()))
      current.setDate(current.getDate() + 1)
    }

    return dates
  })()

  // Agrupar tareas por fecha
  const tasksByDate = useMemo(() => {
    const grouped: { [key: string]: Task[] } = {}

    tasks.forEach((task) => {
      if (!grouped[task.dueDate.toLocaleDateString()]) {
        grouped[task.dueDate.toLocaleDateString()] = []
      }
      grouped[task.dueDate.toLocaleDateString()].push(task)
    })

    return grouped
  }, [tasks])

  function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }

  // Formatear fecha para mostrar
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    })
  }

  // Obtener nombre del día
  const getDayName = (date: Date) => {
    return date.toLocaleDateString("es-ES", { weekday: "short" })
  }

  // Verificar si es hoy
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  // Verificar si es fin de semana
  const isWeekend = (date: Date) => {
    const day = date.getDay()
    return day === 0 || day === 6
  }

  // Verificar si es una fecha pasada
  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const compareDate = new Date(date)
    compareDate.setHours(0, 0, 0, 0)
    return compareDate < today
  }

  const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-green-100 text-green-800 border-green-200",
  }

  const styles = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in {
    animation: fade-in 0.2s ease-in-out;
  }
`

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Calendario de Tareas</CardTitle>
        <div className="flex justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Alta prioridad</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Media prioridad</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Baja prioridad</span>
          </div>
        </div>
      </CardHeader>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <CardContent>
        <div className="relative grid grid-cols-7 gap-2">
          {/* Encabezados de días */}
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <div key={day} className="text-center font-semibold text-sm text-gray-600 p-2">
              {day}
            </div>
          ))}

          {/* Días del calendario */}
          {dateRange.map((date, index) => {
            const dateStr = date.toLocaleDateString()
            const dayTasks = tasksByDate[dateStr] || []
            const dayOfWeek = date.getDay()

            const algunoNoCompletado = dayTasks.some(task => {task.status != "completed"});

            return (
              <div
                key={dateStr}
                className={`min-h-24 p-2 border rounded-lg transition-colors transition-transform hover:scale-110 hover:shadow-md ${
                    isToday(date)
                    ? "bg-blue-100 border-blue-300 hover:bg-blue-200"
                    : isPastDate(date) && algunoNoCompletado && dayTasks.length > 0
                      ? "bg-red-50 border-red-200 hover:bg-red-100"
                      : isWeekend(date)
                        ? "bg-gray-50 hover:bg-gray-100"
                        : "bg-white hover:bg-gray-100"
                } `}
                style={{
                  gridColumnStart: dayOfWeek + 1,
                  minHeight: "150px",
                }}
              >
                <div className={`text-sm font-medium mb-2 ${isToday(date) ? "text-blue-600" : "text-gray-700"}`}>
                  {formatDate(date)}
                </div>

                <div className="space-y-1">
                  {dayTasks.length === 0 && <div className="text-xs text-gray-400">Sin tareas</div>}  

                  {dayTasks.length <= 2 && dayTasks.length >=1 && (
                    <div className="space-y-1">
                      {dayTasks.map((task) => (
                        <Badge
                          key={task.id}
                          variant="outline"
                          className={`text-xs ${priorityColors[task.priority]} w-full justify-start p-2`}
                        >
                          {truncateText(task.title, 14)}
                        </Badge>
                      ))}
                      
                      {isPastDate(date) && algunoNoCompletado ? <div className="text-xs text-red-600 font-semibold">{dayTasks.length} tareas atrasadas</div> :
                        <span className="text-xs text-gray-500 ml-1">{dayTasks.length} tareas</span>
                      }
                    </div>
                  )}

                  {dayTasks.length > 2 && (
                    <div className="space-y-1">
                      <div className="flex flex-wrap gap-1">
                        {dayTasks.map((task) => (
                          <TaskDot
                            key={task.id}
                            task={task}
                            onHover={setHoveredTask}
                          />
                        ))}
                        {hoveredTask && hoveredTask.dueDate.toDateString() == date.toDateString() && (
                          <Badge variant="outline" className={`text-xs ${priorityColors[hoveredTask.priority]} w-full justify-start`}>
                            {hoveredTask.title}
                          </Badge>
                        )}
                      </div>
                      {isPastDate(date) && algunoNoCompletado ? <div className="text-xs text-red-600 font-semibold">{dayTasks.length} tareas atrasadas</div> :
                        <span className="text-xs text-gray-500 ml-1">{dayTasks.length} tareas</span>
                      }
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          {/* {hoverDay && floatingDay()} */}
        </div>
      </CardContent>
    </Card>
  )
}
