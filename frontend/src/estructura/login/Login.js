import React from 'react';
import './logincs.css';
import { useNavigate } from 'react-router-dom'; 
const Login = () => {
    const navigate = useNavigate();
  return (
<div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
  <header className="text-center mb-4">
    <h2>Ferretería y constructora</h2>
    <h1 className="titulo">Ferremas</h1>
    <h3>Construye con confianza</h3>
  </header>

  <div className="col-md-4">
    <div className="card p-4 shadow">
      <div className="mb-3">
        <label>Usuario</label>
        <input type="text" className="form-control" placeholder="Escribe algo" />
      </div>
      <div className="mb-3">
        <label>Contraseña</label>
        <input type="password" className="form-control" placeholder="Escribe algo" />
      </div>
      <div>
        <button type="button" className="btn btn-primary w-100" onClick={() => navigate('/catalogo')}>
          Enviar
        </button>
      </div>
    </div>
  </div>
</div>
  );
};

export default Login;
