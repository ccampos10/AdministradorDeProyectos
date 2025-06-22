"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, Send, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TechnicalSupport() {
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus({ type: null, message: "" })

    try {
      const response = await fetch("http://localhost:3030/api/email", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correoUsuario: formData.email,
          asunto: formData.subject,
          mensaje: formData.message,
        }),
      })

      if (response.ok) {
        setStatus({
          type: "success",
          message:
            "Tu mensaje ha sido enviado exitosamente. Nuestro equipo de soporte se pondrá en contacto contigo pronto.",
        })
        setFormData({ email: "", subject: "", message: "" })
      } else {
        throw new Error("Error al enviar el mensaje")
      }
    } catch (error) {
      setStatus({
        type: "error",
        message:
          "Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente o contacta directamente por teléfono.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">

      <div className="grid md:grid-cols-2 gap-6">
        {/* Información de Contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Información de Contacto
            </CardTitle>
            <CardDescription>Puedes contactarnos directamente a través de estos medios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Teléfono de Soporte</p>
                <p className="text-sm text-muted-foreground">+56 9 55558103</p>
                <p className="text-xs text-muted-foreground">Lunes a Viernes, 9:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Correo de Soporte</p>
                <p className="text-sm text-muted-foreground">ccampos.pisis10@gmail.com</p>
                <p className="text-xs text-muted-foreground">Respuesta en 24 horas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulario de Contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Enviar Mensaje
            </CardTitle>
            <CardDescription>Envíanos tu consulta y te responderemos lo antes posible</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Tu Correo Electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu-email@ejemplo.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Asunto</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Describe brevemente tu consulta"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensaje</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Describe detalladamente tu problema o consulta..."
                  className="min-h-[120px]"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {status.type && (
                <Alert
                  className={status.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}
                >
                  {status.type === "success" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={status.type === "success" ? "text-green-800" : "text-red-800"}>
                    {status.message}
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Mensaje
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Información Adicional */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold">¿Necesitas ayuda urgente?</h3>
            <p className="text-sm text-muted-foreground">
              Para problemas críticos que requieren atención inmediata, llama directamente a nuestro número de soporte.
              Nuestro equipo está disponible para asistirte durante el horario laboral.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
