import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuService from '../../Servicios/Menu/MenuService'; 
import authguard from '../../Servicios/AuthGuard/authguard';

const MiCuenta = () => {
  const navigate = useNavigate();
  const usuario = authguard.obtenerUsuario();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const menuItems = MenuService.obtenerMenuPorRol(usuario?.rol?.id);
  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  return (
    <div className={`catalogo-wrapper ${menuAbierto ? 'menu-abierto' : ''}`}>
      <nav className="d-flex justify-content-between align-items-center p-3 bg-light">
        <div className="d-flex align-items-center">
          <button 
            className="btn-hamburguesa-mi-cuenta btn btn-sm me-2" 
            onClick={toggleMenu}
            aria-label="Abrir menú"
          >
            ☰
          </button>
          <h1 className="mb-0">
            Hola{usuario?.nombre_user ? `, ${usuario.nombre_user}` : ''}
          </h1>
        </div>
      </nav>

      <div className={`menu-lateral ${menuAbierto ? 'abierto' : ''}`}>
        <h5 className="menu-header">{usuario?.rol?.nombre || 'Menú'}</h5>
        <button 
          className="btn btn-sm btn-outline-secondary mb-3" 
          onClick={toggleMenu}
        >
          ✕ Cerrar menú
        </button>
        <ul className="menu-items list-unstyled">
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <a href={item.ruta} className="menu-link d-block py-1">
                {item.nombre}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="contenido p-3">
        
      </div>
    </div>
  );
};

export default MiCuenta;