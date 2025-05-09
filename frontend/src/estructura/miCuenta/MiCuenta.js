import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import authguard from '../../Servicios/AuthGuard/authguard';

const MiCuenta = () => {
  return (
    <div>
      <h1>Pantalla de MiCuenta, Aquí creo que se puede mostrar todo lo del cliente y sus pedidos (si hace clic en el pedido se abre el detalle pedido)</h1>
      {/* …lo que quieras mostrar… */}
    </div>
  )
}

export default MiCuenta;