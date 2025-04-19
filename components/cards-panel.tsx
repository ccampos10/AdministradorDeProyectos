// import * as React from "react"

// import { TaskCard } from "@/components/task-card"
// import { getTareas } from "@/lib/data"

// export async function CardsPanel() {
//   let res = await getTareas()
//   return (
//     <div>
//       {res.map((task: any) => (
//         <TaskCard
//           key={task.id}
//           title={task.titulo}
//           description={task.descripcion}
//           dueDate={task.fecha_vencimiento}
//           assignee={task.encargado}
//           priority={task.prioridad}
//           status={task.estado}
//         />
//       ))}
//     </div>
//   )
// }