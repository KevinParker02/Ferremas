import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FormularioPago = ({ idUsuario, total }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tipo_despacho: '100', // 100 = Retiro, 200 = Domicilio
    direc_desp: '',
    id_comuna_dep: '',
    tipo_comprobante: '1', // 1 = Boleta, 2 = Factura
    rut_factura: '',
    razon_social: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContinuar = () => {
    // Redirigir al simulador de pago con parámetros
    const query = new URLSearchParams({
      usuario: idUsuario,
      total,
      ...form
    }).toString();

    navigate(`/pago-simulado?${query}`);
  };

  return (
    <div className="container mt-4">
      <h2>💳 Formulario previo al pago</h2>
      <div className="mb-3">
        <label className="form-label">Tipo de despacho</label>
        <select name="tipo_despacho" className="form-select" value={form.tipo_despacho} onChange={handleChange}>
          <option value="100">Retiro en tienda</option>
          <option value="200">Despacho a domicilio</option>
        </select>
      </div>

      {form.tipo_despacho === '200' && (
        <>
          <div className="mb-3">
            <label className="form-label">Dirección de despacho</label>
            <input type="text" className="form-control" name="direc_desp" value={form.direc_desp} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">ID Comuna</label>
            <input type="text" className="form-control" name="id_comuna_dep" value={form.id_comuna_dep} onChange={handleChange} />
          </div>
        </>
      )}

      <div className="mb-3">
        <label className="form-label">Tipo de comprobante</label>
        <select name="tipo_comprobante" className="form-select" value={form.tipo_comprobante} onChange={handleChange}>
          <option value="1">Boleta</option>
          <option value="2">Factura</option>
        </select>
      </div>

      {form.tipo_comprobante === '2' && (
        <>
          <div className="mb-3">
            <label className="form-label">RUT de Factura</label>
            <input type="text" className="form-control" name="rut_factura" value={form.rut_factura} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Razón Social</label>
            <input type="text" className="form-control" name="razon_social" value={form.razon_social} onChange={handleChange} />
          </div>
        </>
      )}

      <button className="btn btn-success mt-3" onClick={handleContinuar}>
        Continuar al pago
      </button>
    </div>
  );
};

export default FormularioPago;