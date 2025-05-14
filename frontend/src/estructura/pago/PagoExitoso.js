import React, { useEffect, useState } from 'react';

const PagoExitoso = () => {
  const [mensaje, setMensaje] = useState('Cargando...');
  const [sessionId, setSessionId] = useState(null);
  const [datosSesion, setDatosSesion] = useState(null);

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
