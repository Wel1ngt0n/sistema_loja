import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../../../components/Login';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();

    const handleSuccess = (user: any) => {
        if (user.role === 'ADMIN') {
            navigate('/admin');
        } else {
            alert('Acesso negado. Apenas administradores.');
            localStorage.removeItem('token');
        }
    };

    return <Login onLoginSuccess={handleSuccess} title="Admin Login" />;
};

export default AdminLogin;
