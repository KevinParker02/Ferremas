import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import authguard from '../../Servicios/AuthGuard/authguard';


const Administrador = () => {
  const navigate = useNavigate();

  // Listas maestras
  const [sucursales, setSucursales] = useState([]);
  const [roles, setRoles]           = useState([]);

  // Campos del formulario
  const [nombre_user, setNombre]      = useState('');
  const [apellido_user, setApellido]  = useState('');
  const [rut_user, setRut]            = useState('');
  const [dv_user, setDv]              = useState('');
  const [celular_user, setCelular]    = useState('');
  const [password, setPassword]       = useState('');
  const [email_user, setEmail]        = useState('');
  const [direccion_user, setDireccion]= useState('');
  const [rol_id, setRol]              = useState('');
  const [sucursal_id, setSucursal]    = useState('');

  // Carga inicial de sucursales y roles
  useEffect(() => {
    fetch('http://localhost:8000/api/sucursales/')
      .then(r => r.json())
      .then(setSucursales);

    fetch('http://localhost:8000/api/roles/')
      .then(r => r.json())
      .then(data => setRoles(data)); // ya vienen excluyendo Cliente
  }, []);

  // Envío del formulario
  const handleSubmit = async e => {
    e.preventDefault();

    const payload = {
      nombre_user,
      apellido_user,
      rut_user: parseInt(rut_user, 10),
      dv_user: dv_user === 'K' ? 0 : parseInt(dv_user, 10),
      celular_user,
      password,
      email_user,
      direccion_user,
      rol_id: parseInt(rol_id, 10),
      id_sucursal: parseInt(sucursal_id, 10),
    };

    try {
      const res = await fetch('http://localhost:8000/api/empleados/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        alert('Empleado creado correctamente');
        navigate('/admin'); // Ajusta a la ruta de tu listado de empleados
      } else {
        alert(data.error || 'Error al crear empleado');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="container d-flex flex-column align-items-center justify-content-center min-vh-100"
    >
      <h2 className="mb-4">Agregar Empleado</h2>
      <div className="col-md-8 card p-4 shadow">

        {/* Nombre / Apellido */}
        <div className="mb-3 row">
          <div className="col">
            <label>Nombre</label>
            <input
              className="form-control"
              value={nombre_user}
              onChange={e => setNombre(e.target.value)}
              maxLength={60}
              required
            />
          </div>
          <div className="col">
            <label>Apellido</label>
            <input
              className="form-control"
              value={apellido_user}
              onChange={e => setApellido(e.target.value)}
              maxLength={60}
              required
            />
          </div>
        </div>

        {/* RUT / DV */}
        <div className="mb-3 row">
          <div className="col-8">
            <label>RUT</label>
            <input
              className="form-control"
              type="text"
              placeholder="Ej: 21202977"
              value={rut_user}
              onChange={e => {
                const v = e.target.value;
                if (/^\d{0,8}$/.test(v)) setRut(v);
              }}
              required
            />
          </div>
          <div className="col-4">
            <label>DV</label>
            <input
              className="form-control"
              placeholder="K"
              value={dv_user}
              onChange={e => {
                const v = e.target.value.toUpperCase();
                if (/^[0-9K]{0,1}$/.test(v)) setDv(v);
              }}
              required
            />
          </div>
        </div>

        {/* Celular */}
        <div className="mb-3">
          <label>Celular</label>
          <input
            className="form-control"
            maxLength={8}
            value={celular_user}
            onChange={e => /^\d*$/.test(e.target.value) && setCelular(e.target.value)}
            required
          />
        </div>

        {/* Correo */}
        <div className="mb-3">
          <label>Correo</label>
          <input
            className="form-control"
            type="email"
            maxLength={100}
            value={email_user}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Dirección */}
        <div className="mb-3">
          <label>Dirección</label>
          <input
            className="form-control"
            maxLength={100}
            value={direccion_user}
            onChange={e => setDireccion(e.target.value)}
            required
          />
        </div>

        {/* Contraseña */}
        <div className="mb-3">
          <label>Contraseña</label>
          <input
            className="form-control"
            type="password"
            placeholder="6 a 8 caracteres"
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={6}
            maxLength={8}
            required
          />
        </div>

        {/* Rol */}
        <div className="mb-3">
          <label>Rol</label>
          <select
            className="form-control"
            value={rol_id}
            onChange={e => setRol(e.target.value)}
            required
          >
            <option value="">Seleccione rol</option>
            {roles.map(r => (
              <option key={r.id_rol} value={r.id_rol}>
                {r.nom_rol}
              </option>
            ))}
          </select>
        </div>

        {/* Sucursal */}
        <div className="mb-3">
          <label>Sucursal</label>
          <select
            className="form-control"
            value={sucursal_id}
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

        {/* Botones */}
        <button type="submit" className="btn btn-primary w-100">
          Crear Empleado
        </button>
        <button
          type="button"
          className="btn btn-secondary mt-2 w-100"
          onClick={() => navigate('/admin')}
        >
          Cancelar
        </button>

      </div>
    </form>
  );
};

export default Administrador;