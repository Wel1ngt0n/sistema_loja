export interface Permission {
    code: string;
    description?: string;
}

export interface Role {
    name: string;
    description?: string;
    permissions: string[]; // List of permission codes
}

export interface User {
    id: number;
    username: string;
    name: string;
    active: boolean;
    is_super_admin: boolean;
    roles: string[]; // List of role names
    permissions: string[]; // Combined list of all permissions
}

export interface LoginResponse {
    message: string;
    user: User;
}

export interface Device {
    id: number;
    name: string;
    active: boolean;
    last_seen: string | null;
}
