import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import authguard from '../../Servicios/AuthGuard/authguard';

const Bodega = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <nav className="d-flex justify-content-between align-items-center p-3 bg-light">
        <h3>Menú Bodega</h3>
        <div>
          <button className="btn btn-primary me-2" onClick={() => setDrawerOpen(true)}>
            Agregar productos
          </button>
          <button className="btn btn-danger" onClick={() => { authguard.cerrarSesion(); navigate('/login'); }}>
            Cerrar sesión
          </button>
        </div>
      </nav>
    </>
  )
}

export default Bodega;