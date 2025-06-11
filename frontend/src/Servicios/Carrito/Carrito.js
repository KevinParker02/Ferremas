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
  }, [idUsuario, recargar]);

  const eliminarItem = async (id_producto) => {
    await carritoService.eliminarProducto(idUsuario, id_producto);
    const nuevoCarrito = carrito.filter(item => item.id_producto !== id_producto);
    setCarrito(nuevoCarrito);
    const nuevoTotal = nuevoCarrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    setTotal(nuevoTotal);
  };

  const vaciarTodo = async () => {
    await carritoService.vaciarCarrito(idUsuario);
    setCarrito([]);
    setTotal(0);
  };

  const aumentarCantidad = async (item) => {
    if (item.cantidad < item.stock_disponible) {
      await carritoService.actualizarCantidad(idUsuario, item.id_producto, item.cantidad + 1);
      const nuevoCarrito = carrito.map(prod =>
        prod.id_producto === item.id_producto
          ? { ...prod, cantidad: prod.cantidad + 1 }
          : prod
      );
      setCarrito(nuevoCarrito);
      setTotal(total + item.precio);
    }
  };

  const disminuirCantidad = async (item) => {
    if (item.cantidad > 1) {
      await carritoService.actualizarCantidad(idUsuario, item.id_producto, item.cantidad - 1);
      const nuevoCarrito = carrito.map(prod =>
        prod.id_producto === item.id_producto
          ? { ...prod, cantidad: prod.cantidad - 1 }
          : prod
      );
      setCarrito(nuevoCarrito);
      setTotal(total - item.precio);
    } else {
      await eliminarItem(item.id_producto);
    }
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
              {/* Imagen */}
              {item.foto_producto && (
                <img
                  src={`data:image/jpeg;base64,${item.foto_producto}`}
                  className="carrito-imagen"
                  alt={item.nombre_producto}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    marginBottom: '8px'
                  }}
                />
              )}

              {/* Nombre */}
              <p className="carrito-nombre">{item.nombre_producto}</p>

              {/* Detalles */}
              <div className="carrito-detalles">
                <span className="carrito-controles-cantidad">
                  Cantidad:
                  <button className="btn-cantidad" onClick={() => disminuirCantidad(item)}>➖</button>
                  <strong className="mx-2">{item.cantidad}</strong>
                  <button
                    className="btn-cantidad"
                    onClick={() => aumentarCantidad(item)}
                    disabled={item.cantidad >= item.stock_disponible}
                    title={
                      item.cantidad >= item.stock_disponible
                        ? `Stock máximo: ${item.stock_disponible}`
                        : 'Agregar 1'
                    }
                  >➕</button>
                </span>

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

              {/* Eliminar */}
              <button
                className="carrito-eliminar"
                onClick={() => eliminarItem(item.id_producto)}
              >
                ✕
              </button>
            </div>
          ))}

          {/* Total */}
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

          {/* Botones finales */}
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
