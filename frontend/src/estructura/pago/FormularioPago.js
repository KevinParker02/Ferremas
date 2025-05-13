import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const FormularioPago = () => {


    const navigate = useNavigate();
    //para seleccion de comuna y region
    const [regiones, setRegiones] = useState([]);
    const [comunas, setComunas] = useState([]);
    const [regionSeleccionada, setRegionSeleccionada] = useState('');
    //para seleccion de sucursal
    const [sucursales, setSucursales] = useState([]);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState('');
    
    //datos
    const [form, setForm] = useState({
        tipo_despacho: '100',
        direc_desp: '',
        id_comuna_dep: '',
        tipo_comprobante: '1',
        rut_factura: '',
        razon_social: ''
    });
    //obtener valores de la URL
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const totalRaw = query.get('total');
    const total = Number(totalRaw);
    const totalSeguro = isNaN(total) ? 0 : total; // 👈 más blindado
    const costoEnvio = form.tipo_despacho === '200' ? 2990 : 0;
    const totalConEnvio = totalSeguro + costoEnvio;
    const Userid = parseInt(query.get('usuario')) || 0;

    //enviar datos a continuar
    const handleContinuar = () => {
        const costoEnvio = form.tipo_despacho === '200' ? 2990 : 0;
        const totalConEnvio = parseInt(total) + costoEnvio;
 
        const query = new URLSearchParams({
          usuario: Userid,
          total: totalConEnvio,
          estado: 'ACEPTADO',
          tipo_despacho_id: form.tipo_despacho,
          direc_desp: form.direc_desp,
          id_comuna_dep: form.id_comuna_dep,
          id_region_desp: regionSeleccionada,
          tipo_comprobante_id: form.tipo_comprobante,
          rut_factura: form.rut_factura,
          razon_social: form.razon_social,
          id_sucursal: sucursalSeleccionada
        }).toString();
      
        navigate(`/pago-simulado?${query}`);
    };

    
    // Cargar regiones
    useEffect(() => {
        fetch('http://localhost:8000/api/regiones/')
        .then(res => res.json())
        .then(data => setRegiones(data));
    }, []);
    
    // Cargar comunas por región
    useEffect(() => {
        if (regionSeleccionada) {
            fetch(`http://localhost:8000/api/comunas/?region=${regionSeleccionada}`)
            .then(res => res.json())
            .then(data => setComunas(data));
        }
    }, [regionSeleccionada]);
    //cargar sucursales
    useEffect(() => {
        fetch('http://localhost:8000/api/sucursales/')
          .then(res => res.json())
          .then(data => setSucursales(data));
      }, []);
    //para actualizar direccion con sucursal
    useEffect(() => {
        if (form.tipo_despacho === '100' && sucursalSeleccionada) {
          const sucursal = sucursales.find(s => s.id_sucursal === parseInt(sucursalSeleccionada));
          if (sucursal) {
            setForm(prev => ({
              ...prev,
              direc_desp: sucursal.direccion_sucursal
            }));
          }
        }
      }, [sucursalSeleccionada, form.tipo_despacho, sucursales]);

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
        {form.tipo_despacho === '100' && (
        <div className="mb-3">
            <label className="form-label">Sucursal para retiro</label>
            <select
            className="form-select"
            value={sucursalSeleccionada}
            onChange={(e) => setSucursalSeleccionada(e.target.value)}
            >
            <option value="">Seleccione una sucursal</option>
            {sucursales.map(s => (
                <option key={s.id_sucursal} value={s.id_sucursal}>
                {s.direccion_sucursal}
                </option>
            ))}
            </select>
        </div>
        )}

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
            >
            <option value="">Seleccione una región</option>
            {regiones.map(r => (
                <option key={r.id_region} value={r.id_region}>
                {r.nom_region}
                </option>
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
                    <option key={c.id_comuna} value={c.id_comuna}>
                    {c.nom_comuna}
                    </option>
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
            Total {form.tipo_despacho === '200' ? 'con' : 'sin'} envío:{' '}
            <strong>${totalConEnvio}</strong>
            </p>
            <button className="btn btn-success mt-3" onClick={handleContinuar}>
            Continuar al pago
            </button>
            </div>
        );
    };
    
    export default FormularioPago;
    