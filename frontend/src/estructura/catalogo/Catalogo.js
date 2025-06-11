import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, LogOut } from 'react-feather';
import authguard from '../../Servicios/AuthGuard/authguard';
import MenuService from '../../Servicios/Menu/MenuService';
import CarritoService from '../../Servicios/Carrito/CarritoService';
import Carrito from '../../Servicios/Carrito/Carrito';
import './Catalogocs.css';
import logoFerremas from '../../img/logo-ferremas.png'; 

const Catalogo  = ({ moneda, tipoCambio, setMoneda }) => {
  const navigate = useNavigate();
  const usuario = authguard.obtenerUsuario();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [productos, setProductos] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [recargarCarrito, setRecargarCarrito] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [nombreSucursal, setNombreSucursal] = useState('');

  const toggleCarrito = () => setMostrarCarrito(!mostrarCarrito);
  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const agregarAlCarrito = async (id_producto) => {
    const boton = document.activeElement;
    if (boton) boton.disabled = true;

    try {
      await CarritoService.agregarAlCarritoConFeedback(
        usuario.id_user,
        id_producto,
        1,
        () => {
          setRecargarCarrito(prev => !prev);
        }
      );
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    } finally {
      if (boton) boton.disabled = false;
    }
  };

  const cerrarSesion = () => {
    authguard.cerrarSesion();
    navigate('/login');
  };

  // Obtener menú según el rol
  const menuItems = MenuService.obtenerMenuPorRol(usuario?.rol?.id);

  // Cargar nombre de la sucursal
  useEffect(() => {
    const cargarSucursal = async () => {
      if (usuario?.id_user) {
        try {
          const response = await fetch(
            `http://localhost:8000/api/sucursales/del_usuario/?id_user=${usuario.id_user}`
          );
          const data = await response.json();
          setNombreSucursal(`${data.direccion_sucursal}`);
        } catch (error) {
          console.error('Error al cargar sucursal:', error);
          setNombreSucursal(`Sucursal ID ${usuario.id_sucursal}`);
        }
      }
    };
    cargarSucursal();
  }, [usuario?.id_user]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setCargando(true);
        const favSucursal = usuario.id_sucursal;
        const response = await fetch(
          `http://localhost:8000/api/productos/?sucursal=${favSucursal}`
        );
        const data = await response.json();
        setProductos(data);
      } catch (err) {
        console.error('Error al cargar productos', err);
      } finally {
        setCargando(false);
      }
    };
    fetchProductos();
  }, [usuario.id_sucursal]);

  return (
    <div className={`catalogo-wrapper ${menuAbierto ? 'menu-abierto' : ''}`}>

      {/* Menú lateral */}
      <div className={`menu-lateral ${menuAbierto ? 'abierto' : ''}`}>
        <div className="menu-header">
          <h5>{usuario?.rol?.nombre || 'Menú'}</h5>
          <button className="btn-cerrar-menu" onClick={toggleMenu}>
            <X size={20} />
          </button>
        </div>
        <ul className="menu-items">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a href={item.ruta} className="menu-link">
                {item.icono && <span className="menu-icon">{item.icono}</span>}
                {item.nombre}
              </a>
            </li>
          ))}
          <li>
            <button 
              className="menu-link logout-link" 
              onClick={cerrarSesion}
            >
            <LogOut size={18} className="me-2" />
              Cerrar sesión
            </button>
          </li>
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="contenido-principal">
        <header className="catalogo-header">
          <div className="header-left">
            <button className="btn-menú" onClick={toggleMenu}>
              <Menu size={20} />
            </button>
            <img 
              src={logoFerremas} 
              alt="Logo Ferremas" 
              className="header-logo"
            />
          </div>
          <div className="text-end p-3">
            <label>Moneda: </label>
            <select value={moneda} onChange={(e) => {
              setMoneda(e.target.value);
              localStorage.setItem('moneda', e.target.value);  // guardar persistente
            }}>
              <option value="clp">CLP</option>
              <option value="usd">USD</option>
            </select>
          </div>
          <div className="header-actions">
            <button className="btn-carrito" onClick={toggleCarrito}>
              <ShoppingCart size={18} />
              <span>{mostrarCarrito ? 'Ocultar' : 'Ver'} carrito</span>
            </button>
          </div>
        </header>

        <main className="catalogo-main">
          <div className="usuario-info">
            <h2>Bienvenido, {usuario.nombre_user}</h2>
            <p>Sucursal: {nombreSucursal || 'Cargando...'}</p>
          </div>
          
          <h1 className="titulo-catalogo">Catálogo de Productos</h1>
          
          {cargando ? (
            <div className="cargando-productos">
              <div className="spinner"></div>
              <p>Cargando productos...</p>
            </div>
          ) : (
            <div className="grid-productos">
              {productos.map((prod) => (
                <div className="card-producto" key={prod.id_prod}>
                  <div className="producto-imagen-container">
                    <img
                      src={
                        typeof prod.foto_prod === 'string' && 
                        prod.foto_prod.trim() !== '' && 
                        prod.foto_prod !== 'null'
                          ? `data:image/jpeg;base64,${prod.foto_prod}`
                          : 'https://placehold.co/600x400?text=Sin+Imagen'
                      }
                      alt={prod.nom_prod}
                      className="producto-imagen"
                    />
                  </div>
                  
                  <div className="producto-info">
                    {/* Marca arriba */}
                    <div className="producto-marca">
                      {prod.marca_prod || 'Marca no especificada'}
                    </div>
                    
                    {/* Nombre del producto */}
                    <h3 className="producto-nombre">{prod.nom_prod}</h3>
                    
                    {/* Precio y stock en misma línea */}
                    <div className="producto-precio-stock">
                    <span className="producto-precio">
                      {moneda === 'clp' && `$${prod.precio_prod.toLocaleString('es-CL')}`}
                      {moneda === 'usd' && `US$ ${(prod.precio_prod / tipoCambio).toFixed(2)}`}
                    </span>
                      <span className={`producto-stock ${prod.stock > 0 ? 'disponible' : 'agotado'}`}>
                        {prod.stock > 0 ? `${prod.stock} disponibles` : 'Agotado'}
                      </span>
                    </div>
                    
                    {/* Categoría */}
                    <div className="producto-categoria">
                      {prod.categoria__nom_cat_prod || 'Sin categoría'}
                    </div>
                    
                    {/* Botón de acción */}
                    <button 
                      className="btn-agregar-carrito" 
                      onClick={() => agregarAlCarrito(prod.id_prod)}
                      disabled={prod.stock <= 0 || !prod.estado_prod}
                    >
                      <ShoppingCart size={16} />
                      {prod.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Carrito lateral */}
      <div className={`carrito-sidebar ${mostrarCarrito ? 'abierto' : ''}`}>
        <div className="carrito-header">
          <h3>Tu Carrito</h3>
          <button className="btn-cerrar-carrito" onClick={toggleCarrito}>
            <X size={20} />
          </button>
        </div>
        <Carrito
          idUsuario={usuario.id_user}
          recargar={recargarCarrito}
          moneda={moneda}
          tipoCambio={tipoCambio}
        />
      </div>
    </div>
  );
};

export default Catalogo;