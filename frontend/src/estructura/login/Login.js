import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import authguard from '../../Servicios/AuthGuard/authguard';
import logoImagen from '../../img/logo.png';
import './logincs.css';

const Login = () => {
    // Estados del componente
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    // Manejador de envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, password }),
            });
            
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Error desconocido');
                return;
            }

            if (data.usuario.estado_user === 0 || data.usuario.estado_user === false) {
                setError('Tu cuenta está deshabilitada. Contacta al administrador.');
                return;
            }

            authguard.guardarUsuario(data.usuario);
            redirectByRole(data.usuario.rol.id);
            
        } catch (err) {
            setError('Error de conexión con el servidor');
        }
    };

    // Redirección según el rol del usuario
    const redirectByRole = (roleId) => {
        const routes = {
            11: '/admin',
            21: '/vendedor',
            31: '/bodega',
            41: '/contador',
            51: '/catalogo'
        };
        
        navigate(routes[roleId] || '/error');
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <div className="login-card">
                    {/* Encabezado con logo */}
                    <div className="login-header">
                        <img 
                            src={logoImagen} 
                            alt="Logo de la empresa" 
                            className="login-logo" 
                        />
                        <h2 className="login-title">Iniciar Sesión</h2>
                    </div>

                    {/* Mensajes de error */}
                    {error && (
                        <div className="login-alert">
                            {error}
                        </div>
                    )}

                    {/* Campos del formulario */}
                    <div className="form-group">
                        <div className="input-field">
                            <Mail className="input-icon" />
                            <input
                                type="text"
                                className="form-input"
                                maxLength={40}
                                placeholder="Correo electrónico"
                                value={usuario}
                                onChange={(e) => {
                                    setUsuario(e.target.value);
                                    setMensaje('');
                                }}
                                onBlur={() => {
                                    const regex = /^[^\s@]+@[^\s@]+\.(com|cl)$/;
                                    if (!regex.test(usuario)) {
                                        setMensaje('Ingrese un correo válido.');
                                    }
                                }}
                                required
                            />
                        </div>
                        {mensaje && <span className="error-message">{mensaje}</span>}
                    </div>

                    <div className="form-group">
                        <div className="input-field">
                            <Lock className="input-icon" />
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Contraseña (6 a 8 caracteres)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                maxLength={8}
                                required
                            />
                        </div>
                        {password.length > 0 && (password.length < 6 || password.length > 8) && (
                            <span className="error-message">
                                La contraseña debe tener entre 6 y 8 caracteres
                            </span>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="action-buttons">
                        <button type="submit" className="btn-primary">
                            Ingresar
                        </button>
                        <button 
                            type="button" 
                            className="btn-secondary"
                            onClick={() => navigate('/recuperar')}
                        >
                            Olvidé mi contraseña
                        </button>
                        <button 
                            type="button" 
                            className="btn-tertiary"
                            onClick={() => navigate('/registro')}
                        >
                            Registrarse
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Login;