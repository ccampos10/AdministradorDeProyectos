"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  TrendingUp,
  Users,
  CheckCheck,
  AlertTriangle,
} from "lucide-react"

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { LoadingPage } from "@/components/loading-screen"
import { getTareas } from "@/lib/data"
import { getUsersAdmin } from "@/lib/login"

type Priority = "high" | "medium" | "low"
type Status = "pending" | "in-progress" | "completed"

interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  dueDate: Date
  assignee: string
  status: Status
  createdAt: Date
  notes: string
//   category: string
}

interface TeamMember {
  name: string
  email: string
  avatar: string
  role: string
}

export default function ResumenPage() {
  const componentRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [estaGeneradoPDF, setGenerarPDF] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])

  useEffect(() => {

    getTareas()
    .then((res) => {
        setTasks(res);
        setLoading(false);
    })
    .catch((err) => {
        console.log(err);
        window.location.href = "/home";
    });

    getUsersAdmin()
    .then((res: TeamMember[]) => {
        res = res.map((user) => {
            return {... user, avatar: "GG"}
        });
        setTeamMembers(res);
    })
    .catch((err) => {
        console.log(err);
        window.location.href = "/home";
    });

    // Simular datos de tareas
    // const mockTasks: Task[] = [
    //   {
    //     id: "1",
    //     title: "Diseñar interfaz de usuario",
    //     description: "Crear mockups para la nueva aplicación",
    //     priority: "high",
    //     status: "completed",
    //     dueDate: "2024-01-15",
    //     category: "Diseño",
    //     assignedTo: "Ana García",
    //   },
    //   {
    //     id: "2",
    //     title: "Implementar autenticación",
    //     description: "Configurar sistema de login y registro",
    //     priority: "alta",
    //     status: "en-progreso",
    //     dueDate: "2024-01-20",
    //     category: "Desarrollo",
    //     assignedTo: "Ana García",
    //   },
    //   {
    //     id: "3",
    //     title: "Escribir documentación",
    //     description: "Documentar APIs y componentes",
    //     priority: "media",
    //     status: "pendiente",
    //     dueDate: "2024-01-25",
    //     category: "Documentación",
    //     assignedTo: "María Rodríguez",
    //   },
    //   {
    //     id: "4",
    //     title: "Pruebas unitarias",
    //     description: "Crear tests para componentes principales",
    //     priority: "media",
    //     status: "completada",
    //     dueDate: "2024-01-18",
    //     category: "Testing",
    //     assignedTo: "Carlos López",
    //   },
    //   {
    //     id: "5",
    //     title: "Optimizar rendimiento",
    //     description: "Mejorar velocidad de carga",
    //     priority: "baja",
    //     status: "pendiente",
    //     dueDate: "2024-01-30",
    //     category: "Optimización",
    //     assignedTo: "Ana García",
    //   },
    //   {
    //     id: "6",
    //     title: "Configurar CI/CD",
    //     description: "Implementar pipeline de despliegue automático",
    //     priority: "alta",
    //     status: "en-progreso",
    //     dueDate: "2024-01-22",
    //     category: "DevOps",
    //     assignedTo: "David Martín",
    //   },
    //   {
    //     id: "7",
    //     title: "Diseño de base de datos",
    //     description: "Modelar esquema de la base de datos",
    //     priority: "alta",
    //     status: "completada",
    //     dueDate: "2024-01-12",
    //     category: "Desarrollo",
    //     assignedTo: "Ana García",
    //   },
    //   {
    //     id: "8",
    //     title: "Revisión de código",
    //     description: "Code review de los últimos commits",
    //     priority: "media",
    //     status: "pendiente",
    //     dueDate: "2024-01-28",
    //     category: "Desarrollo",
    //     assignedTo: "Ana García",
    //   },
    // ]

    // const mockTeamMembers: TeamMember[] = [
    //   {
    //     id: "1",
    //     name: "Ana García",
    //     avatar: "AG",
    //     role: "UI/UX Designer",
    //   },
    //   {
    //     id: "2",
    //     name: "Carlos López",
    //     avatar: "CL",
    //     role: "Frontend Developer",
    //   },
    //   {
    //     id: "3",
    //     name: "María Rodríguez",
    //     avatar: "MR",
    //     role: "Backend Developer",
    //   },
    //   {
    //     id: "4",
    //     name: "David Martín",
    //     avatar: "DM",
    //     role: "DevOps Engineer",
    //   },
    // ]
    // setTasks(mockTasks)
    // setTeamMembers(mockTeamMembers)
  }, [])

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length
  const pendingTasks = tasks.filter((task) => task.status === "pending").length

  const highPriorityTasks = tasks.filter((task) => task.priority === "high").length
  const mediumPriorityTasks = tasks.filter((task) => task.priority === "medium").length
  const lowPriorityTasks = tasks.filter((task) => task.priority === "low").length

  const currentDate = new Date()
  const overdueTasks = tasks.filter(
    (task) => task.status !== "completed" && new Date(task.dueDate) < currentDate,
  ).length

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Agrupar tareas por categoría
//   const tasksByCategory = tasks.reduce(
//     (acc, task) => {
//       if (!acc[task.category]) {
//         acc[task.category] = []
//       }
//       acc[task.category].push(task)
//       return acc
//     },
//     {} as Record<string, Task[]>,
//   )

  // Agrupar tareas por miembro del equipo
  const tasksByMember = tasks.reduce(
    (acc, task) => {
      if (!acc[task.assignee]) {
        acc[task.assignee] = []
      }
      acc[task.assignee].push(task)
      return acc
    },
    {} as Record<string, Task[]>,
  )

  // Calcular carga de trabajo por miembro
  const workloadByMember = teamMembers.map((member) => {
    const memberTasks = tasksByMember[member.name] || []
    const totalTasks = memberTasks.length
    const completedTasks = memberTasks.filter((t) => t.status === "completed").length
    const inProgressTasks = memberTasks.filter((t) => t.status === "in-progress").length
    const pendingTasks = memberTasks.filter((t) => t.status === "pending").length
    const highPriorityTasks = memberTasks.filter((t) => t.priority === "high").length
    const overdueTasks = memberTasks.filter(
      (t) => t.status !== "completed" && new Date(t.dueDate) < currentDate,
    ).length

    return {
      ...member,
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      highPriorityTasks,
      overdueTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    }
  })

  const maxTasks = Math.max(...workloadByMember.map((member) => member.totalTasks), 1)

  const downloadResumen = () => {
    console.log("resumen 1");
    setGenerarPDF(true);
    
    const page = componentRef.current;  
    if (!page) { setGenerarPDF(false); return; }
    html2canvas(page).then((canvas) => {
        console.log("resumen 2");
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 0;
        let index = 0;
        console.log("resumen 3");
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
        console.log("resumen 4");
        
        while (heightLeft > 0) {
            index += 1;
            if (index >= 100) { break; }
            console.log("resumen 5");
            position -= pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }
        console.log("resumen 6");

        setGenerarPDF(false);
        pdf.save('componente.pdf');
    })

    // const resumenData = {
    //   fecha: new Date().toLocaleDateString("es-ES"),
    //   estadisticas: {
    //     total: totalTasks,
    //     completadas: completedTasks,
    //     enProgreso: inProgressTasks,
    //     pendientes: pendingTasks,
    //     fueraDePlazo: overdueTasks,
    //     tasaCompletitud: `${completionRate}%`,
    //   },
    //   prioridades: {
    //     alta: highPriorityTasks,
    //     media: mediumPriorityTasks,
    //     baja: lowPriorityTasks,
    //   },
    // //   categorias: Object.keys(tasksByCategory).map((category) => ({
    // //     nombre: category,
    // //     total: tasksByCategory[category].length,
    // //     completadas: tasksByCategory[category].filter((t) => t.status === "completada").length,
    // //   })),
    //   equipoDeTrabajo: workloadByMember.map((member) => ({
    //     nombre: member.name,
    //     rol: member.role,
    //     totalTareas: member.totalTasks,
    //     completadas: member.completedTasks,
    //     enProgreso: member.inProgressTasks,
    //     pendientes: member.pendingTasks,
    //     altaPrioridad: member.highPriorityTasks,
    //     tasaCompletitud: `${member.completionRate}%`,
    //   })),
    //   tareas: tasks,
    // }

    // const dataStr = JSON.stringify(resumenData, null, 2)
    // const dataBlob = new Blob([dataStr], { type: "application/json" })
    // const url = URL.createObjectURL(dataBlob)
    // const link = document.createElement("a")
    // link.href = url
    // link.download = `resumen-tareas-${new Date().toISOString().split("T")[0]}.json`
    // document.body.appendChild(link)
    // link.click()
    // document.body.removeChild(link)
    // URL.revokeObjectURL(url)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-red-100 text-red-800 border-red-200"
      case "media":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "baja":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completada":
        return "bg-green-100 text-green-800 border-green-200"
      case "en-progreso":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pendiente":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Función para generar el gráfico circular SVG
  const generateDonutChart = (completed: number, inProgress: number, pending: number, size = 80) => {
    const total = completed + inProgress + pending
    if (total === 0) return null

    const radius = size / 2
    const strokeWidth = size / 8
    const normalizedRadius = radius - strokeWidth / 2
    const circumference = normalizedRadius * 2 * Math.PI

    const completedPercentage = completed / total
    const inProgressPercentage = inProgress / total
    const pendingPercentage = pending / total

    const completedOffset = circumference * (1 - completedPercentage)
    const inProgressOffset = circumference * (1 - inProgressPercentage - completedPercentage)

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Fondo del gráfico */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="transparent"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />

        {/* Completadas (verde) */}
        {completed > 0 && (
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="transparent"
            stroke="#22c55e"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={0}
            strokeLinecap="round"
          />
        )}

        {/* En progreso (azul) */}
        {inProgress > 0 && (
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="transparent"
            stroke="#3b82f6"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={completedOffset}
            strokeLinecap="round"
          />
        )}

        {/* Pendientes (gris) */}
        {pending > 0 && (
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="transparent"
            stroke="#9ca3af"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={inProgressOffset}
            strokeLinecap="round"
          />
        )}

        {/* Círculo central */}
        <circle cx={radius} cy={radius} r={normalizedRadius - strokeWidth} fill="white" />
      </svg>
    )
  }

  // Función para determinar el nivel de carga de trabajo
  const getWorkloadLevel = (taskCount: number) => {
    if (taskCount <= 2) return { level: "Baja", color: "green" }
    if (taskCount <= 4) return { level: "Media", color: "yellow" }
    return { level: "Alta", color: "red" }
  }

  return (
    <div className="container relative mx-auto p-6 space-y-6" ref={componentRef}>
      {isLoading && <LoadingPage message="Cargando datos..." />}
      {estaGeneradoPDF && <LoadingPage message="Generando pdf..." total={true}/>}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resumen de Tareas</h1>
          <p className="text-muted-foreground">
            Resumen general del estado de tus tareas - {new Date().toLocaleDateString("es-ES")}
          </p>
        </div>
        <Button onClick={downloadResumen} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Descargar Resumen
        </Button>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tareas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">Tareas registradas en el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">{completionRate}% del total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">Tareas activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground">Por iniciar</p>
          </CardContent>
        </Card>
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}
      <div>
        {/* Estado y Prioridad de Tareas - Rediseñado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Estado y Prioridad de Tareas
            </CardTitle>
            <CardDescription>Distribución de tareas según prioridad y estado de vencimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Prioridades */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Por Prioridad</h3>

                {/* Alta Prioridad */}
                <div className="relative overflow-hidden rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-red-100/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500">
                        <AlertCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-red-900">Alta Prioridad</p>
                        <p className="text-sm text-red-700">Requiere atención inmediata</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-900">{highPriorityTasks}</div>
                      <div className="text-xs text-red-700">
                        {totalTasks > 0 ? Math.round((highPriorityTasks / totalTasks) * 100) : 0}% del total
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-red-200">
                    <div
                      className="h-full bg-red-500 transition-all duration-500 ease-out"
                      style={{ width: `${totalTasks > 0 ? (highPriorityTasks / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Media Prioridad */}
                <div className="relative overflow-hidden rounded-lg border border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-yellow-900">Media Prioridad</p>
                        <p className="text-sm text-yellow-700">Importante pero no urgente</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-900">{mediumPriorityTasks}</div>
                      <div className="text-xs text-yellow-700">
                        {totalTasks > 0 ? Math.round((mediumPriorityTasks / totalTasks) * 100) : 0}% del total
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-yellow-200">
                    <div
                      className="h-full bg-yellow-500 transition-all duration-500 ease-out"
                      style={{ width: `${totalTasks > 0 ? (mediumPriorityTasks / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Baja Prioridad */}
                <div className="relative overflow-hidden rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-green-100/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-900">Baja Prioridad</p>
                        <p className="text-sm text-green-700">Puede realizarse más tarde</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-900">{lowPriorityTasks}</div>
                      <div className="text-xs text-green-700">
                        {totalTasks > 0 ? Math.round((lowPriorityTasks / totalTasks) * 100) : 0}% del total
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-green-200">
                    <div
                      className="h-full bg-green-500 transition-all duration-500 ease-out"
                      style={{ width: `${totalTasks > 0 ? (lowPriorityTasks / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Estado de Vencimiento */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Estado de Vencimiento
                </h3>

                {/* Tareas Fuera de Plazo */}
                <div
                  className={`relative overflow-hidden rounded-lg border p-4 ${
                    overdueTasks > 0
                      ? "border-red-300 bg-gradient-to-r from-red-100 to-red-200/50"
                      : "border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          overdueTasks > 0 ? "bg-red-600" : "bg-gray-400"
                        }`}
                      >
                        <AlertCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className={`font-semibold ${overdueTasks > 0 ? "text-red-900" : "text-gray-700"}`}>
                          Fuera de Plazo
                        </p>
                        <p className={`text-sm ${overdueTasks > 0 ? "text-red-700" : "text-gray-600"}`}>
                          {overdueTasks > 0 ? "Requieren atención urgente" : "Todo al día"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${overdueTasks > 0 ? "text-red-900" : "text-gray-700"}`}>
                        {overdueTasks}
                      </div>
                      <div className={`text-xs ${overdueTasks > 0 ? "text-red-700" : "text-gray-600"}`}>
                        {totalTasks > 0 ? Math.round((overdueTasks / totalTasks) * 100) : 0}% del total
                      </div>
                    </div>
                  </div>
                  <div
                    className={`mt-3 h-2 w-full overflow-hidden rounded-full ${
                      overdueTasks > 0 ? "bg-red-300" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`h-full transition-all duration-500 ease-out ${
                        overdueTasks > 0 ? "bg-red-600" : "bg-gray-400"
                      }`}
                      style={{ width: `${totalTasks > 0 ? (overdueTasks / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Resumen de Estado */}
                <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100/50 p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Resumen General</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{completedTasks}</div>
                        <div className="text-xs text-blue-700">Completadas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{inProgressTasks}</div>
                        <div className="text-xs text-blue-700">En Progreso</div>
                      </div>
                    </div>

                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-blue-700 mb-1">
                        <span>Progreso Total</span>
                        <span>{completionRate}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-blue-200">
                        <div
                          className="h-full bg-blue-500 transition-all duration-500 ease-out"
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mensaje de Estado */}
                <div
                  className={`rounded-lg border p-3 text-center ${
                    overdueTasks > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
                  }`}
                >
                  {overdueTasks > 0 ? (
                    <div className="flex items-center justify-center gap-2 text-red-700">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {overdueTasks} tarea{overdueTasks !== 1 ? "s" : ""} necesita{overdueTasks === 1 ? "" : "n"}{" "}
                        atención urgente
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">¡Excelente! Todas las tareas están al día</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen por Categorías */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Resumen por Categorías</CardTitle>
            <CardDescription>Estado de las tareas agrupadas por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.keys(tasksByCategory).map((category) => {
                const categoryTasks = tasksByCategory[category]
                const completedInCategory = categoryTasks.filter((t) => t.status === "completada").length
                const completionPercentage = Math.round((completedInCategory / categoryTasks.length) * 100)

                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category}</span>
                      <span className="text-sm text-muted-foreground">
                        {completedInCategory}/{categoryTasks.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground">{completionPercentage}% completado</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Carga de Trabajo por Miembro del Equipo - REDISEÑADO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Carga de Trabajo por Miembro del Equipo
          </CardTitle>
          <CardDescription>Distribución de tareas y progreso por cada miembro del equipo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workloadByMember.map((member) => {
              const workload = getWorkloadLevel(member.totalTasks)
              const workloadColorClass =
                workload.color === "green"
                  ? "from-green-50 to-green-100/50 border-green-200"
                  : workload.color === "yellow"
                    ? "from-yellow-50 to-yellow-100/50 border-yellow-200"
                    : "from-red-50 to-red-100/50 border-red-200"

              const workloadTextClass =
                workload.color === "green"
                  ? "text-green-700"
                  : workload.color === "yellow"
                    ? "text-yellow-700"
                    : "text-red-700"

              const workloadBgClass =
                workload.color === "green"
                  ? "bg-green-500"
                  : workload.color === "yellow"
                    ? "bg-yellow-500"
                    : "bg-red-500"

              return (
                <div
                  key={member.email}
                  className={`rounded-lg border bg-gradient-to-r ${workloadColorClass} p-5 transition-all duration-300 hover:shadow-md`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                        {member.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge
                        variant="outline"
                        className={`
                          ${
                            workload.color === "green"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : workload.color === "yellow"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : "bg-red-100 text-red-800 border-red-200"
                          }
                        `}
                      >
                        Carga {workload.level}
                      </Badge>
                      <span className="text-sm text-muted-foreground mt-1">{member.completionRate}% completado</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Gráfico de distribución */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative">
                        {generateDonutChart(member.completedTasks, member.inProgressTasks, member.pendingTasks)}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold">{member.totalTasks}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Total de tareas</p>
                    </div>

                    {/* Distribución numérica */}
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-sm">Completadas</span>
                        </div>
                        <span className="font-semibold text-green-700">{member.completedTasks}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm">En Progreso</span>
                        </div>
                        <span className="font-semibold text-blue-700">{member.inProgressTasks}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                          <span className="text-sm">Pendientes</span>
                        </div>
                        <span className="font-semibold text-gray-700">{member.pendingTasks}</span>
                      </div>
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progreso general</span>
                      <span>{member.completionRate}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-green-500 transition-all duration-500 ease-out"
                        style={{ width: `${member.completionRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Alertas y métricas importantes */}
                  <div className="space-y-2">
                    {member.highPriorityTasks > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-red-700">
                          {member.highPriorityTasks} tarea{member.highPriorityTasks !== 1 ? "s" : ""} de alta prioridad
                        </span>
                      </div>
                    )}

                    {member.overdueTasks > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-700">
                          {member.overdueTasks} tarea{member.overdueTasks !== 1 ? "s" : ""} fuera de plazo
                        </span>
                      </div>
                    )}

                    {member.highPriorityTasks === 0 && member.overdueTasks === 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCheck className="h-4 w-4 text-green-500" />
                        <span className="text-green-700">Sin tareas críticas pendientes</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lista Detallada de Tareas */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Tareas</CardTitle>
          <CardDescription>Lista completa de todas las tareas con su estado actual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <div key={task.id}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border bg-card">
                  <div className="space-y-2 flex-1">
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(task.status)}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </Badge>
                      {/* <Badge variant="outline">{task.category}</Badge> */}
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                        {task.assignee}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Vence: {new Date(task.dueDate).toLocaleDateString("es-ES")}
                  </div>
                </div>
                {index < tasks.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
