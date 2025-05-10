import React, { useEffect, useState } from 'react';
import carritoService from './CarritoService';

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

  return (
    <div className="w-full max-w-lg mx-auto mt-4 p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4">🛒 Carrito</h2>
      {carrito.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      ) : (
        <div className="space-y-4">
          {carrito.map((item) => (
            <div key={item.id_carrito} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-semibold">{item.nombre_producto}</p>
                <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                <p className="text-sm text-gray-500">Precio: ${item.precio}</p>
              </div>
              <button
                className="text-red-500 hover:text-red-700 font-bold"
                onClick={() => eliminarItem(item.id_producto)}
              >
                ✕
              </button>
            </div>
          ))}
          <div className="mt-4 font-bold text-right">Total: ${total}</div>
          <button
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl"
            onClick={vaciarTodo}
          >
            Vaciar carrito
          </button>
        </div>
      )}
    </div>
  );
};

export default Carrito;