import React, { useEffect, useState } from 'react';

const PagoExitoso = () => {
  const [mensaje, setMensaje] = useState('Cargando datos...');
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (!sessionId) {
      setMensaje('No se encontró el ID de sesión.');
      return;
    }

    const obtenerDatosPago = async () => {
      try {
        const res = await fetch(`https://ferremas-webhook.onrender.com/api/stripe/obtener-datos/${sessionId}`);
        const datos = await res.json();

        if (datos.error) {
          setMensaje('❌ Error al recuperar la información del pago.');
          return;
        }

        console.log('📦 Metadata recibida:', datos);
        setMetadata(datos);
        setMensaje('✅ ¡Pago confirmado! Revisa los datos del pedido:');
      } catch (error) {
        console.error('Error al procesar el pago:', error);
        setMensaje('❌ Error al recuperar la información del pago.');
      }
    };

    obtenerDatosPago();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Pago Exitoso</h2>
      <p>{mensaje}</p>

      {metadata && (
        <div style={{ marginTop: '1rem' }}>
          <ul>
            {Object.entries(metadata).map(([clave, valor]) => (
              <li key={clave}><strong>{clave}:</strong> {valor || <i>(vacío)</i>}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={() => window.location.href = '/catalogo'} style={{ marginTop: '2rem' }}>
        Volver al catálogo
      </button>
    </div>
  );
};

export default PagoExitoso;