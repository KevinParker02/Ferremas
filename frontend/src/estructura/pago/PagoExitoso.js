import React, { useEffect, useState, useRef } from 'react';

const PagoExitoso = () => {
  const [mensaje, setMensaje] = useState('Cargando...');
  const [sessionId, setSessionId] = useState(null);
  const [datosSesion, setDatosSesion] = useState(null);
  const pedidoYaGenerado = useRef(false);  //asegurar que no se genere dos veces csmmmm
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
    <div style={{ padding: '2rem' }}>
      <h2>Estado del Pago</h2>
      <p>{mensaje}</p>

      {sessionId && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>ID de la sesión de Stripe:</strong></p>
          <code style={{ background: '#eee', padding: '0.5rem', display: 'inline-block' }}>
            {sessionId}
          </code>
        </div>
      )}

      {datosSesion ? (
        datosSesion.error ? (
          <p>{datosSesion.error}</p>
        ) : (
          <>
            <p><strong>Nombre:</strong> {datosSesion.customer_details?.name || 'No disponible'}</p>
            <p><strong>Correo:</strong> {datosSesion.customer_details?.email || 'No disponible'}</p>
            <p><strong>Total pagado:</strong> {datosSesion.amount_total} CLP</p>
            <p><strong>Tipo de pago:</strong> 
              {datosSesion.payment_method_types?.[0] === 'card' ? 'Tarjeta de crédito/débito' : 'Otro método'}
            </p>

            <h3>Datos del formulario previo al pago:</h3>
            <ul>
              {datosSesion.metadata && Object.entries(datosSesion.metadata).map(([clave, valor]) => (
                <li key={clave}><strong>{clave}:</strong> {valor || <i>(vacío/NoAplica)</i>}</li>
              ))}
            </ul>
          </>
        )
      ) : (
        <p>Cargando detalles de la sesión...</p>
      )}
      

      <button onClick={() => window.location.href = '/catalogo'} style={{ marginTop: '2rem' }}>
        Volver al catálogo
      </button>
    </div>
  );
  
};

export default PagoExitoso;
