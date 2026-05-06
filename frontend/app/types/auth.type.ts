export interface User{
    id: string;
    email: string;
    name?: string;
    role?: string;
}

export interface UserLogin {
    email: string,
    password: string
}

export interface AuthResponse {
    accessToken: string,
    refreshToken: string,
    user: User
}
