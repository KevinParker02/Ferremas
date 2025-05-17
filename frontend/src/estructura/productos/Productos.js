import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authguard from '../../Servicios/AuthGuard/authguard';

const Productos = () => {
    const navigate = useNavigate();
    const { id_user, id_sucursal } = authguard.obtenerUsuario();

    // Estados para “Agregar producto” (drawer)
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [categorias, setCategorias]   = useState([]);
  const [sucursales, setSucursales]   = useState([]);
  const [form, setForm]               = useState({
    nom_prod: '', marca_prod: '', codigo_fabricante: '',
    precio_prod: '', stock: '', id_categoria: '', foto_prod: null
  });
  const [precioError, setPrecioError] = useState(false);
  const [stockError, setStockError]   = useState(false);

  // Cargo categorías y sucursales (solo para mostrar nombre de la sucursal actual)
  useEffect(() => {
    fetch('http://localhost:8000/api/categorias/')
      .then(r => r.json()).then(setCategorias)
      .catch(console.error);
    fetch('http://localhost:8000/api/sucursales/')
      .then(r => r.json()).then(setSucursales)
      .catch(console.error);
  }, []);

  const sucursalObj    = sucursales.find(s => s.id_sucursal === id_sucursal);
  const sucursalNombre = sucursalObj?.direccion_sucursal || '–';

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'precio_prod') {
      if (!/^\d*$/.test(value)) return;
      setPrecioError(value !== '' && Number(value) <= 0);
    }
    if (name === 'stock') {
      if (!/^\d*$/.test(value)) return;
      setStockError(value !== '' && Number(value) < 0);
    }
    if (name === 'foto_prod') {
      return setForm(f => ({ ...f, foto_prod: files[0] }));
    }
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (precioError || stockError) {
      alert('Corrige los errores antes de continuar');
      return;
    }
    const formData = new FormData();
    formData.append('id_user', id_user);
    formData.append('nom_prod', form.nom_prod);
    formData.append('marca_prod', form.marca_prod);
    formData.append('codigo_fabricante', form.codigo_fabricante);
    formData.append('precio_prod', form.precio_prod);
    formData.append('stock', form.stock);
    formData.append('id_categoria', form.id_categoria);
    if (form.foto_prod) formData.append('foto_prod', form.foto_prod);

    const res = await fetch('http://localhost:8000/api/producto/crear/', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (res.ok) {
      alert(`Producto creado (ID ${data.id_prod}) en "${sucursalNombre}"`);
      setDrawerOpen(false);
      setForm({
        nom_prod:'', marca_prod:'', codigo_fabricante:'',
        precio_prod:'', stock:'', id_categoria:'', foto_prod:null
      });
    } else {
      alert(data.error || 'Error al crear producto');
    }
  };

  // Logout
  const cerrarSesion = () => {
    authguard.cerrarSesion();
    navigate('/login');
  };

  const irBodega = () => {
    navigate('/bodega');
  };

  return (
        <>
      {/* — Navegación superior — */}
      <nav className="d-flex justify-content-between align-items-center p-3 bg-light">
        <h3>Gestión de Stock</h3>
        <div>
          <button className="btn btn-warning me-2" onClick={irBodega}>
            volver
          </button>
          <button className="btn btn-info me-2" onClick={() => setDrawerOpen(true)}>
            Agregar productos
          </button>
          <button className="btn btn-danger" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* — Drawer para Agregar producto — */}
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
          <div>
            <h4>Agregar Producto</h4>
            <small className="text-muted">Sucursal: {sucursalNombre}</small>
          </div>
          <button className="btn-close" onClick={() => setDrawerOpen(false)} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 overflow-auto"
          style={{ height: 'calc(100% - 60px)' }}
        >
          {/* Nombre */}
          <div className="mb-3">
            <label>Nombre</label>
            <input
              name="nom_prod"
              className="form-control"
              value={form.nom_prod}
              onChange={handleChange}
              required
            />
          </div>

          {/* Marca */}
          <div className="mb-3">
            <label>Marca</label>
            <input
              name="marca_prod"
              className="form-control"
              value={form.marca_prod}
              onChange={handleChange}
              required
            />
          </div>

          {/* Código fabricante */}
          <div className="mb-3">
            <label>Código fabricante</label>
            <input
              name="codigo_fabricante"
              className="form-control"
              value={form.codigo_fabricante}
              onChange={handleChange}
              required
            />
          </div>

          {/* Precio */}
          <div className="mb-3">
            <label>Precio (CLP)</label>
            <input
              name="precio_prod"
              className="form-control"
              value={form.precio_prod}
              onChange={handleChange}
              required
            />
            {precioError && (
              <small className="text-danger">
                El precio debe ser un número mayor a 0
              </small>
            )}
          </div>

          {/* Stock */}
          <div className="mb-3">
            <label>Stock</label>
            <input
              name="stock"
              className="form-control"
              value={form.stock}
              onChange={handleChange}
              required
            />
            {stockError && (
              <small className="text-danger">
                El stock no puede ser negativo
              </small>
            )}
          </div>

          {/* Categoría */}
          <div className="mb-3">
            <label>Categoría</label>
            <select
              name="id_categoria"
              className="form-control"
              value={form.id_categoria}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione categoría</option>
              {categorias.map(c => (
                <option key={c.id_categoria} value={c.id_categoria}>
                  {c.nom_cat_prod}
                </option>
              ))}
            </select>
          </div>

          {/* Foto */}
          <div className="mb-3">
            <label>Foto</label>
            <input
              name="foto_prod"
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Crear Producto
          </button>
        </form>
      </div>
    </>
  );
};

export default Productos;