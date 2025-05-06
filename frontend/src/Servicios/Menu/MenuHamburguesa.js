import React from 'react';
import { Link } from 'react-router-dom';
import authguard from '../Servicios/AuthGuard/authguard';
import MenuService from '../Servicios/MenuService/MenuService';

const MenuHamburguesa = () => {
  const usuario = authguard.obtenerUsuario();
  const opciones = usuario ? MenuService.obtenerMenuPorRol(usuario.rol.id) : [];

  return (
    <div className="menu-hamburguesa bg-light shadow p-3 rounded">
      <h5 className="mb-3">Menú</h5>
      <ul className="list-unstyled">
        {opciones.map((opcion, idx) => (
          <li key={idx}>
            <Link to={opcion.ruta} className="btn btn-outline-primary w-100 mb-2">
              {opcion.nombre}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuHamburguesa;