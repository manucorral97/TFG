export type Roles = '0' | '1' | '2';
export interface User{
    username: string;
    password: string;
}

export interface UserResponse{
    token: string;
    rol: Roles; //Necesario para mostrar las diferentes pantallas a cada usuario
}
