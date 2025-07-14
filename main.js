import { auth } from "./js/auth"
import { router } from "./router"
// Es para que las direccionales del navegador nos permitan avanzar o retroceder
window.addEventListener("popstate", router) 


// Es para que se rederize el contenido dinamico la primera vez
window.addEventListener("load", router)


router()


document.addEventListener("click", e => {
    if (e.target.matches("[data-link]")){
        e.preventDefault()
        history.pushState(null, null, e.target.href)
        router()
    }
})

// Hacer navigateTo accesible globalmente para los onclicks
window.navigateTo = (path) => {
    // Evita que el navegador haga una recarga completa
    window.history.pushState({}, path, path)
    router(); // Llama a tu función de enrutamiento
};

export const api = {
  endpoint: 'http://localhost:3000', // Cambia la URL si es necesario
  // Implementa la función GET
  get: async param => {
    // TODO: Realiza una petición GET a la API y devuelve los datos
    try {
      const response = await fetch(`${api.endpoint}${param}`);
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en la petición GET:', error);
      throw error;
    }
  },
  // Implementa la función POST
  post: async (param, data) => {
    // TODO: Realiza una petición POST a la API con los datos
    try {
      const response = await fetch(`${api.endpoint}${param}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Error al crear los datos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en la petición POST:', error);
      throw error;
    }
  },
  // Implementa la función PUT
  put: async (p, data) => {
    // TODO: Realiza una petición PUT a la API con los datos
    try {
      const response = await fetch(`${api.endpoint}${p}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Error al actualizar los datos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en la petición PUT:', error);
      throw error;
    }
  },
  // Implementa la función DELETE
  del: async p => {
    // TODO: Realiza una petición DELETE a la API
    try {
      const response = await fetch(`${api.endpoint}${p}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Error al eliminar los datos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en la petición DELETE:', error);
      throw error;
    }
  }
};

export function renderNotFound(){
  document.getElementById('app').innerHTML = `<h1>404 Error, Page not found</h1>`
}





