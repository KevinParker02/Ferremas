import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authguard from '../../Servicios/AuthGuard/authguard';
import MenuService from '../../Servicios/Menu/MenuService';
import './Catalogocs.css';

const Catalogo = () => {
  const navigate = useNavigate();
  const usuario = authguard.obtenerUsuario();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [productos, setProductos] = useState([]);
  
  const menuItems = MenuService.obtenerMenuPorRol(usuario?.rol?.id);
  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  
  
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/productos/');
        const data = await response.json();
        setProductos(data);
      } catch (err) {
        console.error('Error al cargar productos', err);
      }
    };
    fetchProductos();
  }, []);
  
  return (
    <div className={`catalogo-wrapper ${menuAbierto ? 'menu-abierto' : ''}`}>
    <div className={`menu-lateral ${menuAbierto ? 'abierto' : ''}`}>
    <h5 className="menu-header">{usuario?.rol?.nombre || 'Menú'}</h5>
    <button className="btn btn-sm btn-outline-secondary mb-3" onClick={toggleMenu}>
    ✕ Cerrar menú
    </button>
    <ul className="menu-items">
    {menuItems.map((item, index) => (
      <li key={index}>
      <a href={item.ruta} className="menu-link">{item.nombre}</a>
      </li>
    ))}
    </ul>
    </div>
    
    <div className="contenido">
    <button className="btn btn-secondary mt-3 me-2" onClick={toggleMenu}>☰ Menú</button>
    <button className="btn btn-danger mt-3" onClick={() => {
      authguard.cerrarSesion();
      navigate('/login');
    }}>
    Cerrar sesión
    </button>
    
    <h1 className="mt-4">Catálogo de Productos</h1>
    <p>Aquí se mostrarán los productos disponibles en Ferremas.</p>
    
    {usuario && (
      <div className="alert alert-info mt-3">
      <strong>Bienvenido:</strong> {usuario.nombre_user} ({usuario.email_user})<br />
      <strong>Rol:</strong> {usuario.rol?.nombre} (ID: {usuario.rol?.id})
      </div>
    )}
    
    <div className="row mt-4">
    {productos.map((prod) => (
      <div className="col-md-4 mb-4" key={prod.id_prod}>
      <div className="card h-100 shadow">
      <img
      src={
        typeof prod.foto_prod === 'string' && prod.foto_prod.trim() !== '' && prod.foto_prod !== 'null'
        ? `data:image/jpeg;base64,${prod.foto_prod}`
        : 'https://placehold.co/600x400'
      }
      alt="Producto"
      className="card-img-top"
      style={{ maxHeight: '200px', objectFit: 'cover' }}
      />
      <div className="card-body">
      <h5 className="card-title">{prod.nom_prod}</h5>
      <p className="card-text">
      <strong>Marca:</strong> {prod.marca_prod}<br />
      <strong>Precio:</strong> ${prod.precio_prod}<br />
      <strong>Stock:</strong> {prod.stock}<br />
      <strong>Categoría:</strong> {prod.categoria__nom_cat_prod}
      </p>
      </div>
      </div>
      </div>
    ))}
    </div>
    </div>
    </div>
  );
};

export default Catalogo;