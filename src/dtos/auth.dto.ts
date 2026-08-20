export interface RegisterDto {
    name: string;
    email: string;
    password: string;
    role: "student" | "teacher" | "admin";
}

export interface UserResponseDto {
    id: string;
    name: string;
    email: string;
    role: "student" | "teacher" | "admin";
}

export interface LoginDto{
    email:string;
    password:string;
}

export interface RefreshTokenDto {
    refreshToken: string;
}

export interface LogoutDto {
    refreshToken: string;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}