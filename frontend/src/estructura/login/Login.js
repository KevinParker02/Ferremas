import React, { useState } from 'react';
import './logincs.css';
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const res = await fetch('http://localhost:8000/api/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ usuario, password }),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          console.log('Login exitoso:', data);
          navigate('/catalogo');
        } else {
          setError(data.error || 'Error desconocido');
        }
      } catch (err) {
        setError('Error de conexión con el servidor');
      }
    };
  
  return (
    <form onSubmit={handleSubmit}>
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <header className="text-center mb-4">
        <h2>Ferretería y constructora</h2>
        <h1 className="titulo">Ferremas</h1>
        <h3>Construye con confianza</h3>
      </header>

      <div className="col-md-4">
        <div className="card p-4 shadow">
          <div className="mb-3">
            <label>Correo</label>
            <input
              type="text"
              className="form-control"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button type="submit" className="btn btn-primary w-100">
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  </form>
  );
};

export default Login;
