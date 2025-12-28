import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import type { User, LoginResponse } from '../types/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isSuperAdmin: boolean;
    hasPermission: (code: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await api.get<User>('/auth/me');
            setUser(res.data);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        const res = await api.post<LoginResponse>('/auth/login', { username, password });
        setUser(res.data.user);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            setUser(null);
            window.location.href = '/auth/login';
        }
    };

    const hasPermission = (code: string) => {
        if (!user) return false;
        if (user.is_super_admin) return true;
        return user.permissions.includes(code);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            isAuthenticated: !!user,
            isSuperAdmin: user?.is_super_admin || false,
            hasPermission
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
