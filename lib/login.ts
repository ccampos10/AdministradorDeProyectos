import { API_Base } from "@/lib/data";
const API_URL = API_Base+"api/user/";

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
        data = data.map((user: any) => {
            return {
                name: user.Nombre,
                email: user.Correo
            }
        })
        console.log("Usuarios obtenidos:", data);
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