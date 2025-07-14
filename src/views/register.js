// views/register.js
import { auth } from "../js/auth"; // Asegúrate de importar auth
import { router } from "../router"; // Asegúrate de importar router

export async function showRegister() { // Hacerla async por si auth.register lo es
    document.getElementById('app').innerHTML = `
        <main class="register-container">
            <h2>Register</h2>
            <form id="form-register"> <label for="username">Username</label>
                <input type="text" id="username" name="username" required />

                <label for="email">Email</label>
                <input type="email" id="email" name="email" required />

                <label for="password">Password</label>
                <input type="password" id="password" name="password" required />

                <label for="confirm-password">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirm-password" required />

                <button type="submit">Register</button>
            </form>
            <div class="links">
                <a href="/login" data-link>Already have an account? Login here</a>
            </div>
        </main>`;

    // Adjuntar el evento después de que el HTML ha sido inyectado
    const formRegister = document.getElementById('form-register'); // ID corregido
    if (formRegister) {
        formRegister.onsubmit = async e => {
            e.preventDefault();
            try {
                const username = e.target.username.value;
                const email = e.target.email.value;
                const password = e.target.password.value;
                // Acceder al campo de confirmación de contraseña.
                // Si cambiaste el ID a confirmPassword: e.target.confirmPassword.value
                const confirmPassword = e.target['confirm-password'].value; // O e.target.confirmPassword.value si cambiaste el ID

                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match.');
                }

                await auth.register(username, email, password); // auth.register solo recibe 3 argumentos
                alert('Registration successful! Please log in.'); // Mensaje de éxito
                history.pushState(null, null, "/login"); // Redirige al login después del registro
                router();
            } catch (error) {
                alert(error.message);
            }
        };
    }
}