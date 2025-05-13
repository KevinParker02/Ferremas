import { useLocation, useNavigate } from 'react-router-dom';

const PagoSimulado = () => {
  const query = new URLSearchParams(useLocation().search);
  const total = query.get('total');
  const usuario = query.get('usuario');
  const navigate = useNavigate();

  const handleConfirmar = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/webpay/respuesta/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: usuario,
          monto: total,
          estado: 'ACEPTADO'
        })
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Redirige al agradecimiento con el número de pedido si viene
        navigate(`/pago-exitoso?mensaje=${encodeURIComponent(data.mensaje || 'Pago registrado')}`);
      } else {
        alert(data.error || 'Ocurrió un problema al registrar el pago');
      }
    } catch (err) {
      console.error('Error en pago simulado:', err);
      alert('Error en la solicitud');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Simulación de Pago</h2>
      <p>Total a pagar: <strong>${total}</strong></p>
      <button className="btn btn-success" onClick={handleConfirmar}>
        Confirmar pago (simulado)
      </button>
    </div>
  );
};

export default PagoSimulado;