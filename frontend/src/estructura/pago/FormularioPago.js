import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import authguard from '../../Servicios/AuthGuard/authguard';
import './FormularioPago.css';
import logoFerremas from '../../img/logo-ferremas.png';

const FormularioPago = () => {
    const stripePromise = loadStripe('pk_test_51ROTKbC0ISZZKwGbP50NTgZ4WaZIlLBR28pk052WyyYxLEsPwahrBjdQXRFiRHmzXK7peeNG8f9GjhCP9Nd0WMrN00riz24rCi');
    const navigate = useNavigate();
    const location = useLocation();

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

    const query = new URLSearchParams(location.search);
    const totalRaw = query.get('total');
    const total = Number(totalRaw);
    const totalSeguro = isNaN(total) ? 0 : total;
    const costoEnvio = form.tipo_despacho === '200' ? 2990 : 0;
    const totalConEnvio = totalSeguro + costoEnvio;
    const Userid = parseInt(query.get('usuario')) || 0;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleContinuar = async () => {
        const costoEnvio = form.tipo_despacho === '200' ? 2990 : 0;
        const totalConEnvio = parseInt(total) + costoEnvio;
    
        let direccionDespacho = form.direc_desp;
        let idSucursalFinal = '';
        let idComunaFinal = form.id_comuna_dep;
        let idRegionFinal = regionSeleccionada;
        
        if (form.tipo_despacho === '200') {
            const idSucursalCliente = authguard.obtenerUsuario()?.id_sucursal;
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

    return (
        <div className="payment-layout">
            {/* Header consistente con el resto de la app */}
            <header className="payment-header">
                <img src={logoFerremas} alt="Logo Ferremas" className="payment-logo" />
                <h1 className="payment-main-title">Finalizar Compra</h1>
            </header>

            <main className="payment-main-content">
                <div className="payment-steps">
                    <div className="step active">1. Envío</div>
                    <div className="step">2. Pago</div>
                    <div className="step">3. Confirmación</div>
                </div>

                <div className="payment-form-container">
                    <section className="form-section">
                        <h2 className="section-title">
                            <span className="section-icon">🚚</span>
                            Método de Entrega
                        </h2>
                        
                        <div className="form-card">
                            <div className="form-group">
                                <label>Tipo de despacho</label>
                                <select 
                                    name="tipo_despacho" 
                                    value={form.tipo_despacho} 
                                    onChange={handleChange}
                                >
                                    <option value="100">Retiro en tienda</option>
                                    <option value="200">Despacho a domicilio</option>
                                </select>
                            </div>

                            {form.tipo_despacho === '200' && (
                                <div className="shipping-fields">
                                    <div className="form-group">
                                        <label>Dirección completa</label>
                                        <input 
                                            type="text" 
                                            name="direc_desp" 
                                            value={form.direc_desp} 
                                            onChange={handleChange}
                                            placeholder="Calle, número, departamento"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Región</label>
                                            <select
                                                value={regionSeleccionada}
                                                onChange={(e) => setRegionSeleccionada(e.target.value)}
                                            >
                                                <option value="">Seleccione región</option>
                                                {regiones.map(r => (
                                                    <option key={r.id_region} value={r.id_region}>{r.nom_region}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Comuna</label>
                                            <select
                                                name="id_comuna_dep"
                                                value={form.id_comuna_dep}
                                                onChange={handleChange}
                                            >
                                                <option value="">Seleccione comuna</option>
                                                {comunas
                                                    .filter(c => c.region_id === parseInt(regionSeleccionada))
                                                    .map(c => (
                                                        <option key={c.id_comuna} value={c.id_comuna}>{c.nom_comuna}</option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="form-section">
                        <h2 className="section-title">
                            <span className="section-icon">📄</span>
                            Datos de Facturación
                        </h2>
                        
                        <div className="form-card">
                            <div className="form-group">
                                <label>Tipo de documento</label>
                                <select 
                                    name="tipo_comprobante" 
                                    value={form.tipo_comprobante} 
                                    onChange={handleChange}
                                >
                                    <option value="1">Boleta</option>
                                    <option value="2">Factura</option>
                                </select>
                            </div>

                            {form.tipo_comprobante === '2' && (
                                <div className="invoice-fields">
                                    <div className="form-group">
                                        <label>RUT</label>
                                        <input 
                                            type="text" 
                                            name="rut_factura" 
                                            value={form.rut_factura} 
                                            onChange={handleChange}
                                            placeholder="12.345.678-9"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Razón Social</label>
                                        <input 
                                            type="text" 
                                            name="razon_social" 
                                            value={form.razon_social} 
                                            onChange={handleChange}
                                            placeholder="Nombre legal de la empresa"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <aside className="payment-summary">
                    <h3 className="summary-title">Resumen de Compra</h3>
                    <div className="summary-content">
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>${totalSeguro.toLocaleString('es-CL')}</span>
                        </div>
                        {form.tipo_despacho === '200' && (
                            <div className="summary-row">
                                <span>Envío:</span>
                                <span>$2.990</span>
                            </div>
                        )}
                        <div className="summary-total">
                            <span>Total:</span>
                            <span>${totalConEnvio.toLocaleString('es-CL')}</span>
                        </div>
                    </div>
                    <button className="payment-button" onClick={handleContinuar}>
                        Proceder al Pago
                    </button>
                </aside>
            </main>
        </div>
    );
};

export default FormularioPago;