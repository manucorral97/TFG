export type Roles = 'SuperAdmin' | 'Admin' | 'User'
export interface User{
    username: string;
    password: string;
}

export interface UserResponse{
    message: string;
    token: string;
    userID: number;
    rol: Roles;
}
