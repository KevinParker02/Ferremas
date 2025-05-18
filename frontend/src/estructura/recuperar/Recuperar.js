import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import logoImagen from '../../img/logo.png';
import './recuperar.css'; // Archivo CSS específico para esta página

const Recuperar = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRecuperar = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('http://localhost:8000/api/recuperar/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMensaje('Se han enviado las instrucciones a tu correo.');
        setTimeout(() => {
          navigate('/restablecer');
        }, 2000);
      } else {
        setMensaje(data.error || 'No se pudo enviar el correo.');
      }
    } catch (error) {
      setMensaje('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.(com|cl)$/;
    if (email && !regex.test(email)) {
      setMensaje('Ingrese un correo válido.');
    } else {
      setMensaje('');
    }
  };

  return (
    <div className="recovery-container">
      <div className="recovery-card">
        {/* Encabezado con logo */}
        <div className="recovery-header">
          <img 
            src={logoImagen} 
            alt="Logo de la empresa" 
            className="recovery-logo" 
          />
          <h2 className="recovery-title">Recuperar Contraseña</h2>
          <p className="recovery-subtitle">Ingresa tu correo para recibir instrucciones de recuperación</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleRecuperar} className="recovery-form">
          <div className="form-grupo">
            <div className="input-field">
              <Mail className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
                maxLength={40}
                required
              />
            </div>
          </div>

          {/* Mensajes */}
          {mensaje && (
            <div className={`recovery-mensaje ${mensaje.includes('envia') ? 'success' : 'error'}`}>
              {mensaje}
            </div>
          )}

          {/* Botones */}
          <div className="action-buttons mt-4">
            <button 
              type="submit" 
              className="btn-instrucciones"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
            </button>
            <button 
              type="button" 
              className="btn-link"
              onClick={() => navigate('/login')}
            >
              Volver al Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Recuperar;