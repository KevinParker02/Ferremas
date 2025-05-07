import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const Restablecer = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6 || newPassword.length > 8) {
        setMensaje('La contraseña debe tener entre 6 y 8 caracteres.');
        return;
    }
    
    if (newPassword !== confirmPassword) {
    setMensaje('Las contraseñas no coinciden.');
    return;
    }

    const res = await fetch('http://localhost:8000/api/reset_password/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, new_password: newPassword, confirm_password: confirmPassword })
    });

    const data = await res.json();

    if (res.ok) {
      setMensaje('Contraseña actualizada correctamente');
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Espera 2 segundos antes de redirigir
    } else {
      setMensaje(`${data.error || 'Error al restablecer la contraseña'}`);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <h2 className="mb-4">Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit} className="w-50">
      <input
        type="email"
        className="form-control mb-3"
        placeholder="Correo electrónico"
        maxLength={40}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => {
            const regex = /^[^\s@]+@[^\s@]+\.(com|cl)$/;
            if (!regex.test(email)) {
            setMensaje('Ingrese un correo válido.');
            } else {
            setMensaje('');
            }
        }}
        required
        />
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Token recibido por correo"
          maxLength={10}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Nueva contraseña"
          minLength={6}
          maxLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Confirmar contraseña"
          minLength={6}
          maxLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button className="btn btn-success w-100" type="submit">
          Restablecer Contraseña
        </button>
      </form>
      {mensaje && <div className="alert alert-info mt-3 text-center">{mensaje}</div>}
    </div>
  );
};

export default Restablecer;
