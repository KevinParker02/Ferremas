import React, { useEffect, useState } from 'react';
import carritoService from './CarritoService';
import { useNavigate } from 'react-router-dom';
import './Carrito.css';
const Carrito = ({ idUsuario, recargar  }) => {
  const navigate = useNavigate();
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


  return (
  <div className="w-full px-4">
      <h2 className="text-xl font-bold mt-4 mb-4">🛒 Carrito</h2>
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
          <div className="mt-4 mb-4 font-bold text-right">Total: ${total}</div>
          <button
            className="btn btn-danger btn-block fw-bold mb-2"
            onClick={vaciarTodo}
          >
            🗑 Vaciar carrito
          </button>
          <button
            className="btn btn-primary w-100 mt-3"
            onClick={() => {
              const query = new URLSearchParams({
                usuario: idUsuario,      
                total: total              
              }).toString();
              navigate(`/formulario-pago?${query}`);
            }}
          >
            💳 Ir a pagar
          </button>
        </div>
      )}
    </div>
  );
};

export default Carrito;