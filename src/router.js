// router.js
import { auth } from './js/auth'; // Importa auth para verificar autenticación y roles

// --- Importa todas tus vistas ---
import { showLogin } from "./views/login";
import { showStartingPage } from "./views/pagestart";
import { showRegister } from "./views/register";
import { showDashboard, showCourses, showCreateCourse, showEditCourse } from "./views/dashboard";

// Función para mostrar una página 404 (puedes tenerla en un archivo de vistas también)
export function renderNotFound() {
    document.getElementById('app').innerHTML = `<h1>404 Error, Page not found</h1>`;
}

// Función auxiliar para redirigir al login
function redirectToLogin() {
    history.pushState(null, null, "/login");
    router();
}

// Objeto de rutas
const routes = {
    "/": {
        showView: showStartingPage,
        // Si settingsLogin existe y es una función, pásala directamente
        // afterRender: settingsLogin, 
        private: false // No requiere autenticación
    },
    "/login": {
        showView: showLogin,
        // afterRender: settingsLogin, 
        private: false
    },
    "/register": {
        showView: showRegister,
        // afterRender: settingsRegister, 
        private: false
    },
    "/dashboard": {
        showView: showDashboard,
        private: true // Requiere autenticación
    },
    "/courses": {
        showView: showCourses,
        private: true // Requiere autenticación
    },
    "/courses/create": {
        showView: showCreateCourse,
        private: true,
        roles: ['admin'] // Solo administradores
    },
    // Nota: Las rutas dinámicas como "/courses/edit/:id" no se listan aquí directamente.
    // Se manejan en la lógica del 'router'
};

export async function router() {
    const path = window.location.pathname;
    const user = auth.getUser(); // Obtener el usuario actual
    
    let currentRoute = null;
    let isDynamicRoute = false;

    // 1. Intentar encontrar una ruta estática
    if (routes[path]) {
        currentRoute = routes[path];
    } else {
        // 2. Intentar encontrar rutas dinámicas
        const pathSegments = path.split('/').filter(segment => segment !== ''); // ["courses", "edit", "123"]

        // Ejemplo para /courses/edit/:id
        if (pathSegments.length === 3 && 
            pathSegments[0] === 'courses' && 
            pathSegments[1] === 'edit') {
            
            // Este es el caso de /courses/edit/123
            currentRoute = {
                showView: showEditCourse,
                private: true,
                roles: ['admin']
            };
            isDynamicRoute = true;
        }
        // Agrega aquí más lógica para otras rutas dinámicas si las necesitas
        // Por ejemplo:
        // if (pathSegments.length === 2 && pathSegments[0] === 'users' && !isNaN(pathSegments[1])) {
        //     currentRoute = { showView: showUserProfile, private: true };
        //     isDynamicRoute = true;
        // }
    }

    // Si no se encontró ninguna ruta
    if (!currentRoute) {
        renderNotFound();
        return;
    }

    // --- Lógica de Protección de Rutas ---
    if (currentRoute.private && !user) {
        redirectToLogin();
        return;
    }

    // Si la ruta requiere roles específicos
    if (currentRoute.roles && !currentRoute.roles.includes(user.role)) {
        alert('You do not have permission to access this page.');
        history.pushState(null, null, "/dashboard"); // Redirige al dashboard o a una página de acceso denegado
        router();
        return;
    }

    // --- Renderizar la vista ---
    await currentRoute.showView();

    // --- Ejecutar afterRender si existe y es una función ---
    if (typeof currentRoute.afterRender === "function") {
        currentRoute.afterRender();
    } 
    // Considera eliminar la parte de window[currentRoute.afterRender] si no la usas activamente
    // o si prefieres pasar las funciones directamente para mejor legibilidad.
    else if (typeof currentRoute.afterRender === "string" && typeof window[currentRoute.afterRender] === "function") {
        window[currentRoute.afterRender]();
    }
}