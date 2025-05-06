import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authguard from '../../Servicios/AuthGuard/authguard';
import MenuService from '../../Servicios/Menu/MenuService';
import './Catalogocs.css';

const Catalogo = () => {
  const navigate = useNavigate();
  const usuario = authguard.obtenerUsuario();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const menuItems = MenuService.obtenerMenuPorRol(usuario?.rol?.id);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  return (
    <div className={`catalogo-wrapper ${menuAbierto ? 'menu-abierto' : ''}`}>
      
      <div className={`menu-lateral ${menuAbierto ? 'abierto' : ''}`}>
        <h5 className="menu-header">{usuario?.rol?.nombre || 'Menú'}</h5>
        <button className="btn btn-sm btn-outline-secondary mb-3" onClick={toggleMenu}>
          ✕ Cerrar
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
        <button className="btn btn-secondary mt-3 me-2" onClick={toggleMenu}>
          ☰ Menú
        </button>

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
      </div>
    </div>
  );
};

export default Catalogo;