// views/dashboard.js
import { auth } from "../js/auth";
import { router } from "../router";

// La API ya está en main.js, no necesitas importarla directamente aquí
// import { api } from "../main"; // No es necesaria aquí si no haces llamadas directas a la API en esta vista

export async function showDashboard(){
    const user = auth.getUser();
    if (!user) { // Protección de ruta: si no hay usuario, redirige al login
        history.pushState(null, null, "/login");
        router();
        return;
    }

    document.getElementById('app').innerHTML = `
        <h2>Welcome, ${user.name} (${user.role})</h2>
        <button id="logout-btn">Logout</button>
        <nav>
            <a href="/courses" data-link>View courses</a>
            ${user.role === 'admin' ? `<a href="/courses/create" data-link>Create course</a>` : ''}
        </nav>`;

    document.getElementById('logout-btn').onclick = () => {
        auth.logout();
        history.pushState(null, null, "/login"); // Redirige al login después de cerrar sesión
        router();
    };

    // La delegación de eventos para [data-link] ya está en main.js, no necesitas re-adjuntarla aquí
    // document.querySelectorAll("[data-link]").forEach(a =>{
    //     a.onclick = e => {
    //         e.preventDefault()
    //         history.pushState(null, null, a.getAttribute("href")); // Usar history.pushState
    //         router();
    //     }
    // });
}

// views/courses.js (asumo que está en el mismo archivo que showDashboard por tu código original)
// Si no, necesitarás importar api y auth
// import { api } from '../main.js';
// import { auth } from '../js/auth.js';
// import { router } from '../router.js'; // Importar router si no está ya

export async function showCourses() {
    const user = auth.getUser();
    if (!user) { // Protección de ruta
        history.pushState(null, null, "/login");
        router();
        return;
    }
    // Asumo que 'api' está disponible globalmente a través de 'window.api'
    // O si está importada desde 'main.js' como en mi ejemplo de router.js:
    // const courses = await api.get('/courses'); // Asegúrate de tener 'api' importada si no es global
    // Si 'api' NO es global, necesitas importarla en CADA archivo de vista que la use:
    // import { api } from '../main.js';
    
    // Si 'api' es global (mala práctica):
    const courses = await window.api.get('/courses');


    document.getElementById('app').innerHTML = `
        <h2>Available Courses</h2>
        <ul>${courses.map(c => `
            <li>${c.title || 'No title'} (${c.capacity || 0} slots) — Instructor: ${c.instructor || 'N/A'}
                ${user.role === 'admin' ? `<button onclick="navigateTo('/courses/edit/${c.id}')">Edit</button>` : ''}
                ${user.role === 'student' ? `<button class="enroll-btn" data-id="${c.id}">Enroll</button>` : ''}
            </li>`).join('')}</ul>`;

    // Reutiliza la variable 'user' en lugar de 'u' para consistencia
    if (user.role === 'student') {
        document.querySelectorAll('.enroll-btn').forEach(btn => {
            btn.onclick = async () => {
                const courseId = btn.dataset.id;
                
                // Asegúrate que 'api' esté importada o sea global
                const course = await window.api.get('/courses/' + courseId); 

                if (!course.enrolled) course.enrolled = [];

                if (course.enrolled.includes(user.email)) { // Usar 'user'
                    alert('You are already enrolled in this course.');
                    return;
                }

                let capacity = course.capacity - 1;

                if (course.enrolled.length >= course.capacity) {
                    alert('This course is full.');
                    return;
                }

                course.enrolled.push(user.email); // Usar 'user'
                course.capacity = capacity;

                await window.api.put('/courses/' + courseId, course); // Asegúrate que 'api' esté importada o sea global
                alert('Enrollment successful!');
                showCourses(); // recargar lista
            };
        });
    }
}

// views/createCourse.js
// Necesitarás importar auth, api (si no es global), y router
// import { api } from '../main.js'; // o import { api } from '../js/api.js'; si la moviste
// import { auth } from '../js/auth.js';
// import { router } from '../router.js';

export function showCreateCourse() {
    const user = auth.getUser();
    if (!user || user.role !== 'admin') { // Proteger ruta solo para admins
        history.pushState(null, null, "/dashboard");
        router();
        return;
    }

    document.getElementById('app').innerHTML = `
        <h2>Create Course</h2>
        <form id="create-course-form"> <input placeholder="Title" id="title" name="title">
            <input placeholder="Instructor" id="instructor" name="instructor">
            <input type="number" placeholder="Capacity" id="capacity" name="capacity">
            <button type="submit">Save</button>
        </form>`;
    
    // Adjuntar el evento al formulario con el ID correcto
    const formCreateCourse = document.getElementById('create-course-form');
    if (formCreateCourse) {
        formCreateCourse.onsubmit = async e => {
            e.preventDefault();
            const data = {
                title: e.target.title.value,
                instructor: e.target.instructor.value,
                capacity: parseInt(e.target.capacity.value)
            };
            await window.api.post('/courses', data); // Asegúrate que 'api' esté importada o sea global
            history.pushState(null, null, '/courses'); // Redirigir a /courses
            router();
        };
    }
}

// views/editCourse.js
// Necesitarás importar auth, api (si no es global), y router
// import { api } from '../main.js'; // o import { api } from '../js/api.js'; si la moviste
// import { auth } from '../js/auth.js';
// import { router } from '../router.js';

export async function showEditCourse() {
    const user = auth.getUser();
    if (!user || user.role !== 'admin') {
        history.pushState(null, null, "/dashboard");
        router();
        return;
    }

    // Obtener el ID del curso de la URL (pathname)
    const courseId = window.location.pathname.split('/').pop();

    const course = await window.api.get('/courses/' + courseId); // Asegúrate que 'api' esté importada o sea global

    if (!course) {
        history.pushState(null, null, "/courses"); // Redirigir si el curso no existe
        router();
        return;
    }

    document.getElementById('app').innerHTML = `
        <h2>Edit Course</h2>
        <form id="edit-course-form"> <input id="title" name="title" placeholder="Title" value="${course.title}">
            <input id="instructor" name="instructor" placeholder="Instructor" value="${course.instructor}">
            <input type="number" id="capacity" name="capacity" placeholder="Capacity" value="${course.capacity}">
            <button type="submit">Save</button>
            <button type="button" id="delete-course-btn" style="background-color: red;">Delete Course</button>
        </form>`;

    // Adjuntar eventos
    const formEditCourse = document.getElementById('edit-course-form');
    if (formEditCourse) {
        formEditCourse.onsubmit = async e => {
            e.preventDefault();
            const updated = {
                title: e.target.title.value,
                instructor: e.target.instructor.value,
                capacity: parseInt(e.target.capacity.value)
            };
            await window.api.put('/courses/' + courseId, updated); // Asegúrate que 'api' esté importada o sea global
            history.pushState(null, null, '/courses');
            router();
        };

        const deleteButton = document.getElementById('delete-course-btn');
        if (deleteButton) {
            deleteButton.onclick = async () => {
                if (confirm('Are you sure you want to delete this course?')) {
                    try {
                        await window.api.del('/courses/' + courseId); // Asegúrate que 'api' esté importada o sea global
                        alert('Course deleted successfully!');
                        history.pushState(null, null, '/courses');
                        router();
                    } catch (error) {
                        alert('Error deleting course: ' + error.message);
                    }
                }
            };
        }
    }
}


