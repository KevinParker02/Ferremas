import React, { useEffect, useState } from 'react';
import carritoService from './CarritoService';
import { useNavigate } from 'react-router-dom';
import './Carrito.css';
const Carrito = ({ idUsuario, recargar, moneda, tipoCambio }) => {
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
            <span>
              Precio: {moneda === 'clp'
                ? `$${item.precio.toLocaleString('es-CL')}`
                : `US$ ${(item.precio / tipoCambio).toFixed(2)}`}
            </span>
            <span className="carrito-total">
              Total: {moneda === 'clp'
                ? `$${(item.precio * item.cantidad).toLocaleString('es-CL')}`
                : `US$ ${((item.precio * item.cantidad) / tipoCambio).toFixed(2)}`}
            </span>
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
          <div className="mt-4 mb-4 font-bold text-right">
            {moneda === 'clp' ? (
              <>Total: ${total.toLocaleString('es-CL')}</>
            ) : (
              <>
                Total: US$ {(total / tipoCambio).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} <br />
                <span className="text-muted" style={{ fontSize: '0.9em' }}>
                  (≈ ${total.toLocaleString('es-CL')} CLP)
                </span>
              </>
            )}
          </div>
          <button
            className="btn btn-danger btn-block fw-bold mb-2 w-100"
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