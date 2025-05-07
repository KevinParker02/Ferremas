import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Recuperar = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();


  const handleRecuperar = async (e) => {
    e.preventDefault();
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
      }, 2000); // Espera 2 segundos antes de redirigir
    }
     else {
      setMensaje(data.error || 'No se pudo enviar el correo.');
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <h2 className="mb-4">Recuperar Contraseña</h2>
      <p>Ingrese su correo para enviar instrucciones de recuperación.</p>
      <form onSubmit={handleRecuperar} className="w-50">
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
        <button className="btn btn-primary w-100" type="submit">Enviar</button>
      </form>
      {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
    </div>
  );
};

export default Recuperar;
