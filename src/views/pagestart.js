// views/pagestart.js

export async function showStartingPage() {
    document.getElementById('app').innerHTML = `
        <main class="starting-page-container">
            <h1>Welcome to our Application!</h1>
            <p>Please <a href="/login" data-link>Login</a> or <a href="/register" data-link>Register</a> to continue.</p>
            </main>
    `;
    // No hay afterRender específico para esta vista, a menos que lo necesites.
    // Si tenías un "settingsLogin" que aplicaba a la página de inicio, podrías moverlo aquí o en una función separada.
}