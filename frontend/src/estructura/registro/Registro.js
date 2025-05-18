import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, User, Lock, MapPin, Phone, Home, Map, Fingerprint     } from 'lucide-react';
import logoImagen from '../../img/logo.png';
import './registro.css';

const Registro = () => {
  const navigate = useNavigate();

  const [sucursales, setSucursales] = useState([]);
  const [id_sucursal, setSucursal] = useState('');

  const [comunas, setComunas] = useState([]);
  const [nombre_user, setNombre] = useState('');
  const [apellido_user, setApellido] = useState('');
  const [rut_user, setRut] = useState('');
  const [dv_user, setDv] = useState('');
  const [celular_user, setCelular] = useState('');
  const [password, setPassword] = useState('');
  const [email_user, setEmail] = useState('');
  const [direccion_user, setDireccion] = useState('');
  const [comuna_id, setComuna] = useState('');
  const [regiones, setRegiones] = useState([]);
  const [region_id, setRegion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/comunas/')
      .then(res => res.json())
      .then(data => setComunas(data));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/api/regiones/')
      .then(res => res.json())
      .then(data => setRegiones(data));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/api/sucursales/')
      .then(res => res.json())
      .then(data => setSucursales(data));
  }, []);

  const comunasFiltradas = comunas.filter(c => c.region_id === parseInt(region_id));

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password.length < 6 || password.length > 8) {
      setMensaje('La contraseña debe tener entre 6 y 8 caracteres');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.(com|cl)$/.test(email_user)) {
      setMensaje('Ingrese un correo válido');
      return;
    }

    setIsLoading(true);
    
    const data = {
      nombre_user,
      apellido_user,
      rut_user,
      dv_user: dv_user === 'K' ? 0 : parseInt(dv_user),
      celular_user,
      password,
      email_user,
      direccion_user,
      rol_id: 51,
      comuna_id,
      id_sucursal: parseInt(id_sucursal),
    };

    try {
      const res = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const resData = await res.json();
      if (res.ok) {
        setMensaje('Registro exitoso. Redirigiendo...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMensaje(resData.error || 'Error al registrar');
      }
    } catch {
      setMensaje('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        {/* Encabezado con logo */}
        <div className="registro-header">
          <img 
            src={logoImagen} 
            alt="Logo de la empresa" 
            className="registro-logo" 
          />
          <h2 className="registro-title">Registro de Usuario</h2>
          <p className="registro-subtitle">Complete todos los campos para crear su cuenta</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleRegister} className="registro-formulario">
          {/* Mensajes */}
          {mensaje && (
            <div className={`registro-message ${mensaje.includes('exitoso') ? 'success' : 'error'}`}>
              {mensaje}
            </div>
          )}

          {/* Nombre y Apellido */}
          <div className="form-row">
            <div className="form-grupo">
              <div className="input-field">
                <User className="input-icon" />
                <input
                  className="form-input"
                  placeholder="Nombre"
                  value={nombre_user}
                  maxLength={60}
                  onChange={e => {
                    const value = e.target.value;
                    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
                      setNombre(value);
                    }
                  }}
                  required
                />
              </div>
            </div>

            <div className="form-grupo">
              <div className="input-field">
                <User className="input-icon" />
                <input
                  className="form-input"
                  placeholder="Apellido"
                  value={apellido_user}
                  maxLength={60}
                  onChange={e => {
                    const value = e.target.value;
                    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
                      setApellido(value);
                    }
                  }}
                  required
                />
              </div>
            </div>
          </div>

          {/* RUT */}
          <div className="form-grupo">
            <label className="form-label">RUT</label>
            <div className="input-field-rut">
              <Fingerprint   className="input-icon" />
              <input
                className="form-input rut-input"
                type="text"
                placeholder="Ej: 21202977"
                value={rut_user}
                onChange={e => {
                  const value = e.target.value;
                  if (/^\d{0,8}$/.test(value)) {
                    setRut(value);
                  }
                }}
                required
              />
              <span className="rut-separator">-</span>
              <input
                className=" dv-input"
                placeholder="K"
                value={dv_user}
                onChange={e => {
                  const val = e.target.value.toUpperCase();
                  if (/^[0-9K]{0,1}$/.test(val)) {
                    setDv(val);
                  }
                }}
                required
              />
            </div>
          </div>

          {/* Celular */}
          <div className="form-grupo">
            <div className="input-field">
              <Phone className="input-icon" />
              <input
                className="form-input"
                placeholder="Celular"
                maxLength={8}
                value={celular_user}
                onChange={e => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setCelular(value);
                  }
                }}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-grupo">
            <div className="input-field">
              <Mail className="input-icon" />
              <input
                className="form-input"
                placeholder="Correo electrónico"
                type="email"
                maxLength={100}
                value={email_user}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => {
                  if (email_user && !/^[^\s@]+@[^\s@]+\.(com|cl)$/.test(email_user)) {
                    setMensaje('Ingrese un correo válido');
                  }
                }}
                required
              />
            </div>
          </div>

          {/* Dirección */}
          <div className="form-grupo">
            <div className="input-field">
              <Home className="input-icon" />
              <input
                className="form-input"
                placeholder="Dirección"
                maxLength={100}
                value={direccion_user}
                onChange={e => {
                  const value = e.target.value;
                  if (/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
                    setDireccion(value);
                  }
                }}
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="form-grupo">
            <div className="input-field">
              <Lock className="input-icon" />
              <input
                className="form-input"
                placeholder="Contraseña (6-8 caracteres)"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={6}
                maxLength={8}
                required
              />
            </div>
          </div>

          {/* Región y Comuna */}
          <div className="form-row">
            <div className="form-grupo">
              <div className="input-field">
                <Map className="input-icon" />
                <select 
                  className="form-input select-input" 
                  value={region_id} 
                  onChange={e => setRegion(e.target.value)} 
                  required
                >
                  <option value="">Seleccione región</option>
                  {regiones.map(r => (
                    <option key={r.id_region} value={r.id_region}>
                      {r.nom_region}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grupo">
              <div className="input-field">
                <MapPin className="input-icon" />
                <select 
                  className="form-input select-input" 
                  value={comuna_id} 
                  onChange={e => setComuna(e.target.value)} 
                  disabled={!region_id}
                  required
                >
                  <option value="">Seleccione comuna</option>
                  {comunasFiltradas.map(c => (
                    <option key={c.id_comuna} value={c.id_comuna}>
                      {c.nom_comuna}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sucursal */}
          <div className="form-grupo">
            <div className="input-field">
              <MapPin className="input-icon" />
              <select
                className="form-input select-input"
                value={id_sucursal}
                onChange={e => setSucursal(e.target.value)}
                required
              >
                <option value="">Seleccione sucursal</option>
                {sucursales.map(s => (
                  <option key={s.id_sucursal} value={s.id_sucursal}>
                    {s.direccion_sucursal}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="action-buttons">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
            <button 
              type="button" 
              className="btn-link"
              onClick={() => navigate('/login')}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;