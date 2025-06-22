import { API_Base } from "@/lib/data";
const API_URL = API_Base+"api/user/";

export const notifi = async (): Promise<any> => {
  try {
    const response = await fetch(API_Base+"api/email/", { credentials: "include" });

    if (!response.ok) {
      throw new Error(`Error al obtener notificaciones: ${response.statusText}`);
    }

    let data = await response.json();
    console.log("Notificaciones obtenidas:", data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const login = async (Correo: string, Contrasena: string): Promise<Boolean> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Correo, Contrasena }),
    });

    if (!response.ok) {
      throw new Error(`Error al iniciar sesión: ${response.statusText}`);
    }

    // const data = await response.json();
    return true;
    // return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const logout = async (): Promise<any> => {
    try {
        const response = await fetch(API_URL+"logout/", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
    
        if (!response.ok) {
        throw new Error(`Error al cerrar sesión: ${response.statusText}`);
        }
    
        // const data = await response.json();
        return true;
        // return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getUsers = async (): Promise<any> => {
    try {
        const response = await fetch(API_URL+"users/", { credentials: "include" });
    
        if (!response.ok) {
        throw new Error(`Error al obtener los usuarios: ${response.statusText}`);
        }
    
        let data = await response.json();
        console.log(data);
        data = data.map((user: any) => {
            return {
                name: user.Nombre,
                email: user.Correo,
                iniciales: user.Iniciales
            }
        })
        console.log("Usuarios obtenidos:", data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const howiam = async (): Promise<any> => {
    try {
        const response = await fetch(API_URL+"howiam/", { credentials: "include" });
    
        if (!response.ok) {
          throw new Error(`Error al comprobar el usuario: ${response.statusText}`);
        }
    
        let data = await response.json();
        console.log("respuesta:", data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const verifyAdmin = async (): Promise<any> => {
    try {
        const response = await fetch(API_URL+"admin/", { credentials: "include" });
    
        if (!response.ok) {
          if (response.status == 401) {
            let data = await response.json();
            if (data.error == "Invalid Rol") { return; }
          }
          throw new Error(`Error al comprobar rol de administrador: ${response.statusText}`);
        }
    
        let data = await response.json();
        console.log("respuesta:", data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getUsersAdmin = async (): Promise<any> => {
    try {
        const response = await fetch(API_URL+"admin/users/", { credentials: "include" });
    
        if (!response.ok) {
        throw new Error(`Error al obtener los usuarios: ${response.statusText}`);
        }
    
        let data = await response.json();
        data = data.map((user: any) => {
            return {
                name: user.Nombre,
                iniciales: user.Iniciales,
                email: user.Correo,
                role: user.Rol,
            }
        })
        console.log("Usuarios obtenidos:", data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const addUser = async (Nombre: string, Correo: string, Contrasena: string, Rol: string): Promise<any> => {
    try {
        const response = await fetch(API_URL+"admin/user", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Correo, Contrasena, Nombre, Rol }),
        });
    
        if (!response.ok) {
        throw new Error(`Error al agregar un usuario: ${response.statusText}`);
        }
    
        let data = await response.json();
        data = {
          name: data.Nombre,
          email: data.Correo,
          role: data.Rol
        }
        console.log("Usuario agregado:", data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const editUser = async (Nombre: string, Correo: string, CorreoOriginal: string, Contrasena: string, Rol: string): Promise<any> => {
    try {
        const response = await fetch(API_URL+"admin/user/edit", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Correo, CorreoOriginal, Contrasena, Nombre, Rol }),
        });
    
        if (!response.ok) {
        throw new Error(`Error al editar un usuario: ${response.statusText}`);
        }
    
        let data = await response.json();
        data = {
          name: data.Nombre,
          email: data.Correo,
          role: data.Rol
        }
        console.log("Usuario editado:", data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deleteUser = async (Correo: string): Promise<any> => {
    try {
        const response = await fetch(API_URL+"admin/user/delete", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Correo }),
        });
    
        if (!response.ok) {
        throw new Error(`Error al eliminar un usuario: ${response.statusText}`);
        }
    
        let data = await response.json();
        console.log("Usuario eliminado:", data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// export const user = async (): Promise<Boolean> => {
//     try {
//         console.log("hola1");
//         const response = await fetch(API_URL, { credentials: "include" });
//         console.log("hola2");
    
//         if (!response.ok) {
//         throw new Error(`Error al obtener el usuario: ${response.statusText}`);
//         }
//         console.log(response);
//         // const data = await response.json();
//         return true;
//         // return data;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }