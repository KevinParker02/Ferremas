import React from 'react';
import { useNavigate } from 'react-router-dom';
const Catalogo = () => {
    const navigate = useNavigate();
  return (
    <div className="catalogo-container">
      <h1>Catálogo de Productos</h1>
      <p>Aquí se mostrarán los productos disponibles en Ferremas.</p>

      <button className="btn btn-danger" onClick={() => navigate('/login')}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Catalogo;
