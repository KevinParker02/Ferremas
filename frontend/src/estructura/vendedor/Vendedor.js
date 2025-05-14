import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import authguard from '../../Servicios/AuthGuard/authguard';


const Vendedor = () => {
  
  const navigate = useNavigate();

  return (
    <nav className="d-flex justify-content-between align-items-center p-3 bg-light">
        <h3>Vista Vendedor</h3>
        <div>
          <button
            className="btn btn-danger"
            onClick={() => {
              authguard.cerrarSesion();
              navigate('/login');
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
  )
}

export default Vendedor;