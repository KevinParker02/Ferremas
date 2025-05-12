import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authguard from '../../Servicios/AuthGuard/authguard';

const Administrador = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sucursales, setSucursales] = useState([]);
  const [roles, setRoles]           = useState([]);

  const [form, setForm] = useState({
    nombre_user: '',
    apellido_user: '',
    rut_user: '',
    dv_user: '',
    celular_user: '',
    password: '',
    email_user: '',
    direccion_user: '',
    rol_id: '',
    sucursal_id: ''
  });

  const [emailError, setEmailError]         = useState(false);
  const [passwordError, setPasswordError]   = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/sucursales/')
      .then(r => r.json()).then(setSucursales);
    fetch('http://localhost:8000/api/roles/')
      .then(r => r.json()).then(setRoles);
  }, []);
  

  const handleChange = e => {
    const { name, value } = e.target;

    // Validaciones por campo:
    if (name === 'nombre_user' || name === 'apellido_user') {
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return;
    }
    if (name === 'rut_user') {
      if (!/^\d{0,8}$/.test(value)) return;
    }
    if (name === 'dv_user') {
      const v = value.toUpperCase();
      if (!/^[0-9K]{0,1}$/.test(v)) return;
      setForm(f => ({ ...f, dv_user: v }));
      return;
    }
    if (name === 'celular_user') {
      if (!/^\d*$/.test(value)) return;
    }
    if (name === 'direccion_user') {
      if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return;
    }

    // Email validation on change
    if (name === 'email_user') {
      const regex = /^[^\s@]+@[^\s@]+\.(com|cl)$/;
      setEmailError(value.length > 0 && !regex.test(value));
    }
    // Password validation on change
    if (name === 'password') {
      setPasswordError(value.length > 0 && (value.length < 6 || value.length > 8));
    }

    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (emailError || passwordError) {
      alert('Corrige los errores antes de continuar');
      return;
    }

    const payload = {
      ...form,
      rut_user: parseInt(form.rut_user, 10),
      dv_user:  form.dv_user === 'K' ? 0 : parseInt(form.dv_user, 10),
      rol_id:   parseInt(form.rol_id,   10),
      id_sucursal: parseInt(form.sucursal_id, 10)
    };

    const res = await fetch('http://localhost:8000/api/empleados/', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      alert('Empleado creado correctamente');
      setDrawerOpen(false);
      setForm({
        nombre_user:'', apellido_user:'', rut_user:'', dv_user:'',
        celular_user:'', password:'', email_user:'', direccion_user:'',
        rol_id:'', sucursal_id:''
      });
    } else {
      alert(data.error || 'Error al crear empleado');
    }
  };

  return (
    <>
      <nav className="d-flex justify-content-between align-items-center p-3 bg-light">
        <h3>Menú administrador</h3>
        <div>
          <button className="btn btn-primary me-2" onClick={() => setDrawerOpen(true)}>
            Agregar empleado
          </button>
          <button className="btn btn-danger" onClick={() => { authguard.cerrarSesion(); navigate('/login'); }}>
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div
        className="position-fixed top-0 end-0 h-100 bg-white shadow-lg"
        style={{
          width: '400px',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
          zIndex: 1050
        }}
      >
        <div className="p-3 border-bottom d-flex justify-content-between">
          <h4>Agregar Empleado</h4>
          <button className="btn-close" onClick={() => setDrawerOpen(false)} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 overflow-auto" style={{ height: 'calc(100% - 60px)' }}>
          {/* Nombre / Apellido */}
          <div className="row mb-3">
            <div className="col">
              <label>Nombre</label>
              <input
                name="nombre_user"
                className="form-control"
                value={form.nombre_user}
                onChange={handleChange}
                maxLength={60}
                required
              />
            </div>
            <div className="col">
              <label>Apellido</label>
              <input
                name="apellido_user"
                className="form-control"
                value={form.apellido_user}
                onChange={handleChange}
                maxLength={60}
                required
              />
            </div>
          </div>

          {/* RUT / DV */}
          <div className="row mb-3">
            <div className="col-8">
              <label>RUT</label>
              <input
                name="rut_user"
                className="form-control"
                placeholder="21202977"
                value={form.rut_user}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-4">
              <label>DV</label>
              <input
                name="dv_user"
                className="form-control"
                placeholder="K"
                value={form.dv_user}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Celular */}
          <div className="mb-3">
            <label>Celular</label>
            <input
              name="celular_user"
              className="form-control"
              maxLength={8}
              value={form.celular_user}
              onChange={handleChange}
              required
            />
          </div>

          {/* Correo */}
          <div className="mb-3">
            <label>Correo</label>
            <input
              name="email_user"
              type="email"
              className="form-control"
              value={form.email_user}
              onChange={handleChange}
              required
            />
            {emailError && (
              <small className="text-danger">Ingrese un correo válido</small>
            )}
          </div>

          {/* Dirección */}
          <div className="mb-3">
            <label>Dirección</label>
            <input
              name="direccion_user"
              className="form-control"
              maxLength={100}
              placeholder="Av. Siempre Viva 123"
              value={form.direccion_user}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contraseña */}
          <div className="mb-3">
            <label>Contraseña</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="6 a 8 caracteres"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              maxLength={8}
              required
            />
            {passwordError && (
              <small className="text-danger">La contraseña debe tener entre 6 y 8 caracteres</small>
            )}
          </div>

          {/* Rol */}
          <div className="mb-3">
            <label>Rol</label>
            <select
              name="rol_id"
              className="form-control"
              value={form.rol_id}
              onChange={handleChange}
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
              name="sucursal_id"
              className="form-control"
              value={form.sucursal_id}
              onChange={handleChange}
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
        </form>
      </div>
    </>
  );
};

export default Administrador;
