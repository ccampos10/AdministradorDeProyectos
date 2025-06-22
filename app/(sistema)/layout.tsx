'use client';

import { useState, useEffect } from "react"
import { usePathname } from 'next/navigation';

import TaskManagementLayout from "@/components/layout"

export default function OptionsLayout({ children }: { children: React.ReactNode }) {
  const [titulo, setTitulo] = useState("Administrador de tareas");
  const [mensaje, setMensaje] = useState("Sistema de gestión de tareas");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/home")) {
      setTitulo("Dashboard");
      setMensaje("Resumen de tareas y actividades");
    } else if (pathname.startsWith("/tasks")) {
      setTitulo("Gestión de tareas");
      setMensaje("Administra todas las tareas del equipo");
    } else if (pathname.startsWith("/users")) {
      setTitulo("Administración del equipo");
      setMensaje("Gestiona todos los usuarios registrados en la plataforma");
    } else if (pathname.startsWith("/resumen")) {
      setTitulo("Resumen de Tareas");
      setMensaje("Resumen general del estado de tus tareas - "+new Date().toLocaleDateString("es-ES"));
    } else if (pathname.startsWith("/support")) {
      setTitulo("Soporte Técnico");
      setMensaje("Estamos aquí para ayudarte. Contáctanos a través de cualquiera de estos medios.");
    }else if (pathname.startsWith("/contactos")) {
      setTitulo("Contactos de usuarios");
      setMensaje("Conecta con otros usuarios de la plataforma.");
    }
  }, [pathname]);

  return(
    <TaskManagementLayout titulo={titulo} mensaje={mensaje}>
      {children}
    </TaskManagementLayout>
  )
}