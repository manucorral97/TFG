export type Roles = 'SuperAdmin' | 'Admin' | 'User'
export interface User{
    username: string;
    password: string;
}

export interface UserResponse{
    message: string; //Opcional
    token: string;
    userID: number; //Opcional
    rol: Roles; //Necesario para mostrar las diferentes pantallas a cada usuario
}
