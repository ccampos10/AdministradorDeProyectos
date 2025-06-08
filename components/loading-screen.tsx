import { Loader2 } from "lucide-react"

interface LoadingPageProps {
  message?: string,
  total?: boolean
}

export function LoadingPage({ message = "Cargando...", total = false }: LoadingPageProps) {
  return (
    <div className={`${total ? "fixed" : "absolute"} top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50`}>
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
