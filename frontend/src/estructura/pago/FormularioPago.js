import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import authguard from '../../Servicios/AuthGuard/authguard';

const FormularioPago = () => {
    const stripePromise = loadStripe('pk_test_51ROTKbC0ISZZKwGbP50NTgZ4WaZIlLBR28pk052WyyYxLEsPwahrBjdQXRFiRHmzXK7peeNG8f9GjhCP9Nd0WMrN00riz24rCi');
    const navigate = useNavigate();

    const [regiones, setRegiones] = useState([]);
    const [comunas, setComunas] = useState([]);
    const [regionSeleccionada, setRegionSeleccionada] = useState('');
    const [sucursales, setSucursales] = useState([]);

    const [form, setForm] = useState({
        tipo_despacho: '100',
        direc_desp: '',
        id_comuna_dep: '',
        id_region_dep: '',
        tipo_comprobante: '1',
        rut_factura: '',
        razon_social: ''
    });

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const totalRaw = query.get('total');
    const total = Number(totalRaw);
    const totalSeguro = isNaN(total) ? 0 : total;
    const costoEnvio = form.tipo_despacho === '200' ? 2990 : 0;
    const totalConEnvio = totalSeguro + costoEnvio;
    const Userid = parseInt(query.get('usuario')) || 0;

    const handleContinuar = async () => {
      const costoEnvio = form.tipo_despacho === '200' ? 2990 : 0;
      const totalConEnvio = parseInt(total) + costoEnvio;
  
      let direccionDespacho = form.direc_desp;
      let idSucursalFinal = '';
      let idComunaFinal = form.id_comuna_dep;
      let idRegionFinal = regionSeleccionada;
      if (form.tipo_despacho === '200'){
        const idSucursalCliente=authguard.obtenerUsuario()?.id_sucursal;
        idSucursalFinal = idSucursalCliente;
      }
      if (form.tipo_despacho === '100') {
        const idSucursalCliente = authguard.obtenerUsuario()?.id_sucursal;
        idSucursalFinal = idSucursalCliente;
    
        const sucursal = sucursales.find(s => s.id_sucursal === idSucursalCliente);
        if (sucursal) {
            direccionDespacho = sucursal.direccion_sucursal || '';
            idComunaFinal = sucursal.id_comuna;
            idRegionFinal = sucursal.id_region;
        }
        
    }
  
      const datosPedido = {
          usuario: Userid,
          total: totalConEnvio,
          estado: 'ACEPTADO',
          tipo_despacho_id: form.tipo_despacho,
          direc_desp: direccionDespacho,
          id_comuna_dep: idComunaFinal,
          id_region_desp: idRegionFinal,
          tipo_comprobante_id: form.tipo_comprobante,
          rut_factura: form.rut_factura,
          razon_social: form.razon_social,
          id_sucursal: idSucursalFinal
      };
  
      console.log('📝 Enviando metadata a Stripe:', datosPedido);
  
      const res = await fetch('http://localhost:8000/api/stripe/crear-sesion/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosPedido)
      });
  
      const data = await res.json();
  
      if (data.id) {
          const stripe = await stripePromise;
          await stripe.redirectToCheckout({ sessionId: data.id });
      } else {
          alert(data.error || 'No se pudo iniciar el pago');
      }
  };
    useEffect(() => {
        fetch('http://localhost:8000/api/regiones/')
            .then(res => res.json())
            .then(data => setRegiones(data));
    }, []);

    useEffect(() => {
        if (regionSeleccionada) {
            fetch(`http://localhost:8000/api/comunas/?region=${regionSeleccionada}`)
                .then(res => res.json())
                .then(data => setComunas(data));
        }
    }, [regionSeleccionada]);

    useEffect(() => {
        fetch('http://localhost:8000/api/sucursales/')
            .then(res => res.json())
            .then(data => setSucursales(data));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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

                    <div className="mb-3 row">
                        <div className="col">
                            <label className="form-label">Región</label>
                            <select
                                className="form-select"
                                value={regionSeleccionada}
                                onChange={(e) => setRegionSeleccionada(e.target.value)}
                                required
                            >
                                <option value="">Seleccione una región</option>
                                {regiones.map(r => (
                                    <option key={r.id_region} value={r.id_region}>{r.nom_region}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col">
                            <label className="form-label">Comuna</label>
                            <select
                                className="form-select"
                                name="id_comuna_dep"
                                value={form.id_comuna_dep}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione una comuna</option>
                                {comunas
                                    .filter(c => c.region_id === parseInt(regionSeleccionada))
                                    .map(c => (
                                        <option key={c.id_comuna} value={c.id_comuna}>{c.nom_comuna}</option>
                                    ))}
                            </select>
                        </div>
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

            <p className="mt-2 text-muted">
                Total {form.tipo_despacho === '200' ? 'con' : 'sin'} envío: <strong>${totalConEnvio}</strong>
            </p>

            <button className="btn btn-success mt-3" onClick={handleContinuar}>
                Continuar al pago
            </button>
        </div>
    );
};

export default FormularioPago;
