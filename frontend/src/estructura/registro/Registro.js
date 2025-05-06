  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom'; 

  const Registro = () => {
    const navigate = useNavigate();
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

    const comunasFiltradas = comunas.filter(c => c.region_id === parseInt(region_id));


    const handleRegister = async (e) => {
      e.preventDefault();

      const data = {
        nombre_user,
        apellido_user,
        rut_user,
        dv_user: dv_user === 'K' ? 0 : parseInt(dv_user),
        celular_user,
        password,
        email_user,
        direccion_user,
        rol_id: 5, // Cliente
        comuna_id
      };

      try {
        const res = await fetch('http://localhost:8000/api/register/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const resData = await res.json();
        if (res.ok) {
          alert('Registro exitoso');
          navigate('/');
        } else {
          alert(resData.error || 'Error al registrar');
        }
      } catch {
        alert('Error de conexión');
      }
    };

    return (
      <form onSubmit={handleRegister} className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
        <h2 className="mb-4">Registro de Usuario</h2>
        <div className="col-md-6 card p-4 shadow">

          <div className="mb-3 row">
            <div className="col">
              <label>Nombre</label>
              <input 
                className="form-control"
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
            <div className="col">
              <label>Apellido</label>
              <input 
                className="form-control"
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


          <div className="mb-3">
            <label>RUT</label>
            <div className="d-flex align-items-center">
              <input 
                className="form-control me-2"
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
              <span>-</span>
              <input 
                className="form-control ms-2"
                placeholder="K"
                value={dv_user}
                onChange={e => {
                  const val = e.target.value.toUpperCase();
                  if (/^[0-9K]{0,1}$/.test(val)) {
                    setDv(val);
                  }
                }}
                required
                style={{ width: '60px' }}
              />
            </div>
          </div>


          <div className="mb-3">
            <label>Celular</label>
            <input 
              className="form-control"
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

          <div className="mb-3">
            <label>Correo</label>
            <input 
              className="form-control"
              type="email"
              maxLength={100}
              value={email_user}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => {
                const regex = /^[^\s@]+@[^\s@]+\.(com|cl)$/;
                if (!regex.test(email_user)) {
                  alert('Ingrese un correo válido que termine en .com o .cl');
                }
              }}
              required
            />
          </div>

          <div className="mb-3">
            <label>Dirección</label>
            <input 
              className="form-control"
              maxLength={100}
              placeholder="Ej: Avenida Siempre Viva 123"
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
            {password.length > 0 && (password.length < 6 || password.length > 8) && (
              <small className="text-danger">La contraseña debe tener entre 6 y 8 caracteres</small>
            )}
          </div>

          <div className="mb-3 row">
            <div className="col">
              <label>Región</label>
              <select className="form-control" value={region_id} onChange={e => setRegion(e.target.value)} required>
                <option value="">Seleccione una región</option>
                {regiones.map(r => (
                  <option key={r.id_region} value={r.id_region}>
                    {r.nom_region}
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <label>Comuna</label>
              <select className="form-control" value={comuna_id} onChange={e => setComuna(e.target.value)} required>
                <option value="">Seleccione una comuna</option>
                {comunasFiltradas.map(c => (
                  <option key={c.id_comuna} value={c.id_comuna}>
                    {c.nom_comuna}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button type="submit" className="btn btn-success w-100">Registrarse</button>
          <button type="button" className="btn btn-danger mt-3 w-100" onClick={() => navigate('/login')}>Cancelar</button>
        </div>
      </form>
    );
  };


  export default Registro;