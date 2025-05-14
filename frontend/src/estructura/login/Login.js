import React, { useState } from 'react';
import './logincs.css';
import { useNavigate } from 'react-router-dom';
import authguard from '../../Servicios/AuthGuard/authguard';
import logoImagen from '../../img/logo.png'
const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [mensaje, setMensaje] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, password }),
            })
            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Error desconocido')
                return
            }

            if (data.usuario.estado_user === 0 || data.usuario.estado_user === false) {
                setError('Tu cuenta está deshabilitada. Contacta al administrador.')
                return
            }

            authguard.guardarUsuario(data.usuario)

            const rol = data.usuario.rol.id
            switch (rol) {
                case 11:
                    navigate('/admin')
                    break
                case 21:
                    navigate('/vendedor')
                    break
                case 31:
                    navigate('/bodega')
                    break
                case 41:
                    navigate('/contador')
                    break
                case 51:
                    navigate('/catalogo')
                    break
                default:
                    navigate('/error')
            }

        } catch (err) {
            setError('Error de conexión con el servidor')
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="login-background d-flex flex-column align-items-center justify-content-center min-vh-100">

                <header className="box-top"> {/* Usamos la clase box-top para el header */}
                    {/* <h2></h2>
                    <h1 className="titulo">Bienvenido a Ferremas</h1> */}
                </header>

                <div className="col-md-4">
                    <div className="card shadow-lg"> {/* Quitamos position-relative del card */}
                        <div className="profile-container"> {/* El logo y el título en un contenedor */}
                            <img src={logoImagen} alt="Ferremas Logo" className="rounded-circle" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                            <h2 className="mt-1 mb-2">Iniciar Sesión</h2>
                        </div>

                    {error && (
                        <div className="alert alert-info text-center" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="mb-3">
                            <label>Correo electrónico</label>
                        <input
                            type="text"
                            className="form-control"
                            maxLength={40}
                            placeholder="correo@ejemplo.com"
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
                        {mensaje && (
                            <small className="text-danger">{mensaje}</small>
                        )}
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
                            <button type="submit" className="btn-inicio">Ingresar</button>
                            <button type="button" className="btn-olvidar" onClick={() => navigate('/recuperar')}>Olvide mi contraseña</button>
                            <button type="button" className="btn btn-success" onClick={() => navigate('/registro')}>Registrarse</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Login;