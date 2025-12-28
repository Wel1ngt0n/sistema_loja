import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // Important for Cookies!
});

// Helper to read cookie
function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

api.interceptors.request.use(config => {
    // Add CSRF Token header (Double Submit Cookie Pattern)
    const csrfToken = getCookie('csrf_token');
    if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
        config.headers['X-CSRF-Token'] = csrfToken;
    }

    // Add Device Token if exists (for Totem)
    const deviceToken = localStorage.getItem('device_token');
    if (deviceToken) {
        config.headers['X-Device-Token'] = deviceToken;
    }

    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Ignore 401 on /auth/me (initial check)
            if (error.config?.url?.includes('/auth/me')) {
                return Promise.reject(error);
            }

            // Only redirect if NOT already on login and NOT a totem device relying on local token
            if (!window.location.pathname.includes('/login') && !localStorage.getItem('device_token')) {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
