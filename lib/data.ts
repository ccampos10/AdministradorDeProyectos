// URL base de la API
export const API_Base = "https://crucial-flea-partially.ngrok-free.app/"; // Tener en cuenta el / al final !!!!!!!
const API_URL = API_Base+"api/tareas/";
import { Task } from "@/components/task-management-system";

export type Tarea = {
    id: string;
    titulo: string;
    descripcion: string;
    fechaCreacion: string;
    encargado: string;
    prioridad: string;
    estado: string;
};

const formatTareas = (tareas: Task[]): Task[] => {
    return tareas.map((tarea: Task) => {
        tarea.dueDate = new Date(tarea.dueDate);
        tarea.createdAt = new Date(tarea.createdAt);
        return tarea;
    })
}

// Función para obtener todos los datos
export const getTareas = async (): Promise<Task[]> => {
    try {
        const response = await fetch(API_URL, { credentials: "include" });
        if (!response.ok) {
            throw new Error(`Error al obtener las tareas: ${response.statusText}`);
        }
        let data = await response.json();
        data = formatTareas(data);
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getMisTareas = async (): Promise<Task[]> => {
    try {
        const response = await fetch(API_URL+"misTareas/", { credentials: "include" });
        if (!response.ok) {
            throw new Error(`Error al obtener las tareas: ${response.statusText}`);
        }
        let data = await response.json();
        data = formatTareas(data);
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Función para obtener un dato por ID
export const getTareaById = async (id: string): Promise<Record<string, any>> => {
    try {
        const response = await fetch(`${API_URL}${id}`, { credentials: "include" });
        if (!response.ok) {
            throw new Error(`Error al obtener la tarea con ID ${id}: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Función para crear un nuevo dato
export const createTarea = async (tarea: Task): Promise<Task> => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tarea),
        });
        if (!response.ok) {
            throw new Error(`Error al crear la tarea: ${response.statusText}`);
        }
        let data = await response.json();
        data = formatTareas([data])[0];
        console.log("Tarea creada:", data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Función para actualizar un dato por ID
export const updateTarea = async (id: string, tarea: Task): Promise<Task> => {
    try {
        const response = await fetch(`${API_URL}${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tarea),
        });
        if (!response.ok) {
            throw new Error(`Error al actualizar la tarea con ID ${id}: ${response.statusText}`);
        }
        let data = await response.json();
        data = formatTareas([data])[0];
        console.log("Tarea actualizada:", data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Función para eliminar un dato por ID
export const deleteTarea = async (id: string): Promise<Boolean> => {
    try {
        const response = await fetch(`${API_URL}${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error(`Error al eliminar la tarea con ID ${id}: ${response.statusText}`);
        }
        // const data = await response.json();
        // return data;
        console.log("Tarea eliminada:", response.status);
        return response.status == 200;
    } catch (error) {
        console.error(error);
        throw error;
    }
};