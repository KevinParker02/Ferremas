
const API_URL = 'http://localhost:8000/api/carrito'; // Cambia el puerto si tu backend usa otro
const CarritoService = {
  // Agrega un producto al carrito (si existe, aumenta la cantidad)
  agregarProducto: async (id_usuario, id_producto, cantidad) => {
    const res = await fetch(`${API_URL}/agregar/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_usuario, id_producto, cantidad })
    });
    return res.json();
  },

  // Obtiene el carrito de un usuario
  obtenerCarrito: async (id_usuario) => {
    const res = await fetch(`${API_URL}/${id_usuario}/`);
    return res.json();
  },

  // Actualiza la cantidad de un producto
  actualizarCantidad: async (id_usuario, id_producto, cantidad) => {
    const res = await fetch(`${API_URL}/actualizar/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_usuario, id_producto, cantidad })
    });
    return res.json();
  },

  // Elimina un producto del carrito
  eliminarProducto: async (id_usuario, id_producto) => {
    const res = await fetch(`${API_URL}/eliminar/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_usuario, id_producto })
    });
    return res.json();
  },

  // Vacía todo el carrito del usuario
  vaciarCarrito: async (id_usuario) => {
    const res = await fetch(`${API_URL}/vaciar/${id_usuario}/`, {
      method: 'DELETE'
    });
    return res.json();
  },
  //Agrega el carrito
  agregarAlCarritoConFeedback: async (id_usuario, id_producto, cantidad = 1, onSuccess) => {
    try {
      await CarritoService.agregarProducto(id_usuario, id_producto, cantidad);
      alert('Producto agregado al carrito');
  
      if (typeof onSuccess === 'function') {
        onSuccess(); // 🔁 llama a la función que fuerza recarga
      }
  
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
      alert('Error al agregar producto');
    }
  }
};

export default CarritoService;