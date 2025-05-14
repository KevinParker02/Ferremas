import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Key, Lock, LockKeyhole } from 'lucide-react';
import logoImagen from '../../img/logo.png';
import './reset_password.css'; // Archivo CSS específico para esta página

const Restablecer = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validaciones
    if (newPassword.length < 6 || newPassword.length > 8) {
      setMensaje('La contraseña debe tener entre 6 y 8 caracteres.');
      setIsLoading(false);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMensaje('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/reset_password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          token, 
          new_password: newPassword, 
          confirm_password: confirmPassword 
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje('Contraseña actualizada correctamente');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMensaje(data.error || 'Error al restablecer la contraseña');
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
    <div className="reset-container">
      <div className="reset-card">
        {/* Encabezado con logo */}
        <div className="reset-header">
          <img 
            src={logoImagen} 
            alt="Logo de la empresa" 
            className="reset-logo" 
          />
          <h2 className="reset-title">Restablecer Contraseña</h2>
          <p className="reset-subtitle">Ingresa tus datos para crear una nueva contraseña</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="reset-form">
          {/* Campo de email */}
          <div className="form-group">
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

          {/* Campo de token */}
          <div className="form-group">
            <div className="input-field">
              <Key className="input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="Token de verificación"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                maxLength={10}
                required
              />
            </div>
          </div>

          {/* Campo de nueva contraseña */}
          <div className="form-group">
            <div className="input-field">
              <Lock className="input-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="Nueva contraseña (6-8 caracteres)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                maxLength={8}
                required
              />
            </div>
          </div>

          {/* Campo de confirmación de contraseña */}
          <div className="form-group">
            <div className="input-field">
              <LockKeyhole className="input-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                maxLength={8}
                required
              />
            </div>
          </div>

          {/* Mensajes de estado */}
          {mensaje && (
            <div className={`reset-message ${
              mensaje.includes('actualizada') ? 'success' : 
              mensaje.includes('válido') ? 'warning' : 'error'
            }`}>
              {mensaje}
            </div>
          )}

          {/* Botones */}
          <div className="action-buttons">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Procesando...' : 'Restablecer Contraseña'}
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

export default Restablecer;