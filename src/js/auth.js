// js/auth.js
import { api } from "../main"; // La API está en main.js

export const auth = {
    login: async (email, password) => {
        // Corregido: removido el espacio antes del '=' en el query string
        const users = await api.get(`/users?email=${email}`);
        if (users.length === 0 || users[0].password !== password) {
            throw new Error("Invalid credentials");
        }
        const user = users[0];
        localStorage.setItem("user", JSON.stringify(user));
    },
    register: async (name, email, pass) => {
        const existingUser = await api.get(`/users?email=${email}`);
        if (existingUser.length > 0) {
            throw new Error('Email already registered');
        }
        const newUser = { name, email, password: pass, role: 'student' }; // Asignar un rol por defecto
        await api.post('/users', newUser);
    },
    logout: () => {
        localStorage.removeItem('user');
        // Aquí podrías agregar una llamada a router() para redirigir,
        // pero generalmente el componente que llama a logout (e.g., dashboard.js) se encarga de la redirección
        // para tener más control sobre a dónde va el usuario después de salir.
    },
    isAuthenticated: () => {
        return !!localStorage.getItem('user');
    },
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};