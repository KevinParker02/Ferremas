import React, { useState } from 'react';
import './logincs.css';
import { useNavigate } from 'react-router-dom'; 
import authguard from '../../Servicios/AuthGuard/authguard';
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
          authguard.guardarUsuario(data.usuario);
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

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}
          
          <div className="mb-3">
            <label>Correo</label>
            <input
              type="text"
              className="form-control"
              maxLength={100}
              placeholder="correo@ejemplo.com"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              onBlur={() => {
                const regex = /^[^\s@]+@[^\s@]+\.(com|cl)$/;
                if (!regex.test(usuario)) {
                  alert('Ingrese un correo válido que termine en .com o .cl');
                }
              }}
              required
            />
          </div>

          <div className="mb-3">
            <label>Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="6 a 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              maxLength={8}
              required
            />
            {password.length > 0 && (password.length < 6 || password.length > 8) && (
              <small className="text-danger">La contraseña debe tener entre 6 y 8 caracteres</small>
            )}
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary w-100">
              Enviar
            </button>
            <button
              type="button"
              className="btn btn-warning w-100"
              onClick={() => navigate('/recuperar')}
            >
              Olvide mi contraseña
            </button>
            <button
              type="button"
              className="btn btn-success w-100"
              onClick={() => navigate('/registro')}
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </div>
  </form>
  );
};

export default Login;
