import React, { useEffect, useState } from 'react';
import carritoService from './CarritoService';
import './Carrito.css';
const Carrito = ({ idUsuario, recargar  }) => {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);

  
  useEffect(() => {
    if (idUsuario) {
      carritoService.obtenerCarrito(idUsuario).then(data => {
        if (Array.isArray(data)) {
          setCarrito(data);
          const totalCalculado = data.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
          setTotal(totalCalculado);
        } else {
          setCarrito([]);
          setTotal(0);
        }
      });
    }
  },[idUsuario, recargar]);     
  
  
  const eliminarItem = async (id_producto) => {
    await carritoService.eliminarProducto(idUsuario, id_producto);
    const nuevoCarrito = carrito.filter(item => item.id_producto !== id_producto);
    setCarrito(nuevoCarrito);
  };

  const vaciarTodo = async () => {
    await carritoService.vaciarCarrito(idUsuario);
    setCarrito([]);
    setTotal(0);
  };

  //manejo de pago 
  const handlePagar = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/webpay/iniciar/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: idUsuario })
      });
  
      const data = await res.json();
  
      if (res.ok && data.url_pago) {
        // Redirige al usuario a Webpay u otro simulador de pago
        window.location.href = data.url_pago;
      } else {
        alert(data.error || 'No se pudo iniciar el pago');
      }
    } catch (err) {
      console.error('Error al iniciar el pago:', err);
      alert('Ocurrió un error al procesar el pago');
    }
  };

  return (
  <div className="w-full px-4">
      <h2 className="text-xl font-bold mb-4">🛒 Carrito</h2>
      {carrito.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      ) : (
        <div className="space-y-4">
            {carrito.map((item) => (
        <div key={item.id_carrito} className="carrito-card">
          {/* Nombre del producto */}
          <p className="carrito-nombre">{item.nombre_producto}</p>

          {/* Detalles alineados horizontalmente */}
          <div className="carrito-detalles">
            <span>Cantidad: {item.cantidad}</span>
            <span>Precio: ${item.precio}</span>
            <span className="carrito-total">Total: ${item.precio * item.cantidad}</span>
          </div>

          {/* Botón eliminar */}
          <button
            className="carrito-eliminar"
            onClick={() => eliminarItem(item.id_producto)}
          >
            ✕
          </button>
        </div>
      ))}
          <div className="mt-4 font-bold text-right">Total: ${total}</div>
          <button
            className="btn btn-danger btn-block fw-bold"
            onClick={vaciarTodo}
          >
            🗑 Vaciar carrito
          </button>
          <button
            className="btn btn-success w-100 fw-bold mt-3"
            onClick={handlePagar}
          >
            💳 Pagar ahora
          </button>
        </div>
      )}
    </div>
  );
};

export default Carrito;