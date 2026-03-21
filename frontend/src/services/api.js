import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Interceptor de REQUEST
// Se ejecuta antes de cada llamada — adjunta el token automáticamente
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de RESPONSE
// Se ejecuta después de cada respuesta
// Si el token expiró (401), intenta refrescarlo automáticamente
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // _retry evita loops infinitos si el refresh también falla
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
                    { refreshToken }
                );

                localStorage.setItem('accessToken', data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

                // Reintenta la petición original con el nuevo token
                return api(originalRequest);
            } catch {
                // Si el refresh también falla, el usuario debe loguearse de nuevo
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;