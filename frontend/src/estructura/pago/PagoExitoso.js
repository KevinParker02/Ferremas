import React, { useEffect, useState, useRef } from 'react';
import './PagoExitoso.css'; // Archivo CSS para los estilos
import logoFerremas from '../../img/logo-ferremas.png';

const PagoExitoso = () => {
  const [mensaje, setMensaje] = useState('Cargando...');
  const [sessionId, setSessionId] = useState(null);
  const [datosSesion, setDatosSesion] = useState(null);
  const pedidoYaGenerado = useRef(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('session_id');
    if (!id) {
      setMensaje('❌ No se encontró el ID de sesión.');
      return;
    }

    setSessionId(id);
    setMensaje('✅ ¡Pago confirmado!');

    const obtenerDatosSesion = async () => {
      try {
        const res = await fetch(`https://ferremas-webhook.onrender.com/stripe/obtener-datos/${id}/`);
        const data = await res.json();

        if (data.error) {
          setDatosSesion({ error: '❌ No se pudieron obtener los datos de la sesión.' });
        } else {
          setDatosSesion(data);
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setDatosSesion({ error: '❌ Error al contactar con el servidor.' });
      }
    };

    obtenerDatosSesion();
  }, []);
  useEffect(() => {
    const generarPedido = async () => {
      if (!datosSesion || datosSesion.payment_status !== 'paid' || pedidoYaGenerado.current) return;

      pedidoYaGenerado.current = true; 

      try {
        const response = await fetch('http://localhost:8000/api/pedido/crear/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario_id: datosSesion.metadata.usuario,
            total_pedido: datosSesion.metadata.total,
            tipo_despacho_id: datosSesion.metadata.tipo_despacho_id,
            direc_desp: datosSesion.metadata.direc_desp || 'NoAplica',
            id_comuna_dep: datosSesion.metadata.id_comuna_dep || null,
            id_region_desp: datosSesion.metadata.id_region_desp || null,
            tipo_comprobante_id: datosSesion.metadata.tipo_comprobante_id,
            rut_factura: datosSesion.metadata.rut_factura || 'NoAplica',
            razon_social: datosSesion.metadata.razon_social || 'NoAplica',
            sucursal_id: datosSesion.metadata.id_sucursal || null
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error HTTP ${response.status}: ${errorText}`);
        }

        const resultado = await response.json();
        console.log('📦 Pedido generado:', resultado);
      } catch (error) {
        console.error('❌ Error al crear el pedido:', error);
      }
    };

    generarPedido();
  }, [datosSesion]);


  console.log('🧾 Metadata:', datosSesion?.metadata);
  

  return (
    <div>
    {/* Header con ancho completo */}
    <header className="payment-header">
      <div className="header-container">
        <img src={logoFerremas} alt="Logo Ferremas" className="header-logo" />
        <h1 className="header-title">Confirmación de Compra</h1>
      </div>
    </header>

    {/* Contenido con ancho restringido */}
    <div className="success-container">
      <div className="payment-steps mt-4">
                    <div className="step">1. Envío</div>
                    <div className="step">2. Pago</div>
                    <div className="step active">3. Confirmación</div>
                </div>
    
      <main className="success-content">
        <div className={`status-message ${mensaje.includes('✅') ? 'success' : 'error'}`}>
          {mensaje}
        </div>

        {sessionId && (
          <div className="session-info">
            <h3>ID de Transacción</h3>
            <code>{sessionId}</code>
          </div>
        )}

        {datosSesion ? (
          datosSesion.error ? (
            <div className="error-message">{datosSesion.error}</div>
          ) : (
            <div className="payment-details">
              <div className="customer-info">
                <h2>Detalles del Cliente</h2>
                <div className="info-row">
                  <span className="info-label">Nombre:</span>
                  <span>{datosSesion.customer_details?.name || 'No disponible'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Correo:</span>
                  <span>{datosSesion.customer_details?.email || 'No disponible'}</span>
                </div>
              </div>

              <div className="payment-summary">
                <h2>Resumen del Pago</h2>
                <div className="info-row">
                  <span className="info-label">Total:</span>
                  <span className="amount">${(datosSesion.amount_total).toLocaleString('es-CL')} CLP</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Método:</span>
                  <span>{datosSesion.payment_method_types?.[0] === 'card' ? 'Tarjeta' : 'Otro método'}</span>
                </div>
              </div>

              <div className="shipping-info">
                <h2>Datos de Entrega</h2>
                {datosSesion.metadata && (
                  <>
                    <div className="info-row">
                      <span className="info-label">Tipo de envío:</span>
                      <span>{datosSesion.metadata.tipo_despacho_id === '100' ? 'Retiro en tienda' : 'Despacho a domicilio'}</span>
                    </div>
                    {datosSesion.metadata.tipo_despacho_id === '200' && (
                      <>
                        <div className="info-row">
                          <span className="info-label">Dirección:</span>
                          <span>{datosSesion.metadata.direc_desp}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Región/Comuna:</span>
                          <span>{datosSesion.metadata.id_region_desp} / {datosSesion.metadata.id_comuna_dep}</span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="invoice-info">
                <h2>Datos de Facturación</h2>
                {datosSesion.metadata && (
                  <>
                    <div className="info-row">
                      <span className="info-label">Documento:</span>
                      <span>{datosSesion.metadata.tipo_comprobante_id === '1' ? 'Boleta' : 'Factura'}</span>
                    </div>
                    {datosSesion.metadata.tipo_comprobante_id === '2' && (
                      <>
                        <div className="info-row">
                          <span className="info-label">RUT:</span>
                          <span>{datosSesion.metadata.rut_factura}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Razón Social:</span>
                          <span>{datosSesion.metadata.razon_social}</span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        ) : (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando detalles de la transacción...</p>
          </div>
        )}

        <div className="action-buttons">
          <button 
            className="btn-primary"
            onClick={() => window.location.href = '/catalogo'}
          >
            Volver al Catálogo
          </button>
          <button 
            className="btn-secondary"
            onClick={() => window.print()}
          >
            Imprimir Comprobante
          </button>
        </div>
      </main>
      </div>
    </div>
  );
};

export default PagoExitoso;