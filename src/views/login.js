// views/login.js
import { auth } from "../js/auth";
import { router } from "../router"; // Asegúrate que router esté en el nivel correcto

export async function showLogin() {
    document.getElementById('app').innerHTML = `
        <main class="login-container">
            <h2>Login</h2>
            <form id="form-login">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required />

                <label for="password">Password</label>
                <input type="password" id="password" name="password" required />

                <button type="submit">Enter</button>
            </form>
            <div class="links">
                <a href="/register" data-link>Register here</a>
            </div>
        </main>`;

    // Adjuntar el evento después de que el HTML ha sido inyectado
    const formLogin = document.getElementById("form-login");
    if (formLogin) { // Verificar si el elemento existe
        formLogin.onsubmit = async e => {
            e.preventDefault(); // <-- Aquí debe ser e.preventDefault()
            try {
                // Acceder a los valores por el `name` o `id` del input
                const email = e.target.email.value;
                const password = e.target.password.value;

                await auth.login(email, password);
                
                // Usar history.pushState para navegación basada en pathname
                history.pushState(null, null, "/dashboard"); 
                router(); // Recargar la vista del dashboard
            } catch (error) {
                alert(error.message);
            }
        };
    }
}