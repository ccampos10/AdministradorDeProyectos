import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Administrador de Proyectos',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
