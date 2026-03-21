import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// persist guarda el estado en localStorage automáticamente
// Si el usuario recarga la página, sigue autenticado
const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,

            // Guarda todo tras login/register
            setAuth: (user, accessToken, refreshToken) => {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                set({ user, accessToken, refreshToken });
            },

            // Limpia todo al cerrar sesión
            logout: () => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                set({ user: null, accessToken: null, refreshToken: null });
            },

            isAuthenticated: () => {
                // Getter derivado del estado actual
                return !!useAuthStore.getState().accessToken;
            },
        }),
        {
            name: 'auth-storage', // Clave en localStorage
            // Solo persistimos user, los tokens ya los manejamos manualmente
            partialize: (state) => ({ user: state.user }),
        }
    )
);

export default useAuthStore;