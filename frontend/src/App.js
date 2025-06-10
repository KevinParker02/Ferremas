import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

import Login from './estructura/login/Login';
import Catalogo from './estructura/catalogo/Catalogo';
import Registro from './estructura/registro/Registro';
import Recuperar from './estructura/recuperar/Recuperar';
import Restablecer from './estructura/reset_password/reset_password';
import FormularioPago from './estructura/pago/FormularioPago';
import PagoExitoso from './estructura/pago/PagoExitoso';
// Nuevas vistas
import MiCuenta from './estructura/miCuenta/MiCuenta';
import Vendedor from './estructura/vendedor/Vendedor';
import Contador from './estructura/contador/Contador';
import Administrador from './estructura/administrador/Admin';
import Bodega from './estructura/bodega/Bodega';
import Error from './estructura/error/Error';
import Productos from './estructura/productos/Productos'; 


import { ProtectedRoute } from './Servicios/AuthGuard/ProtectedRoute';
import { GuestRoute} from './Servicios/AuthGuard/GuestRoute';
function App() {

  const [moneda, setMoneda] = useState('clp');
  const [tipoCambio, setTipoCambio] = useState(1);

  useEffect(() => {
    if (moneda === 'usd') {
      fetch('http://localhost:8000/api/dolar/')
        .then(res => res.json())
        .then(data => setTipoCambio(data.dolar));
    } else {
      setTipoCambio(1);
    }
  }, [moneda]);
  return (
    <Router>
      <div className="text-end p-3">
        <label>Moneda: </label>
        <select value={moneda} onChange={(e) => setMoneda(e.target.value)}>
          <option value="clp">CLP</option>
          <option value="usd">USD</option>
        </select>
      </div>
      <Routes>
        {/* rutas de invitado */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login"    element={<GuestRoute><Login/></GuestRoute>} />
        <Route path="/registro" element={<GuestRoute><Registro/></GuestRoute>} />
        <Route path="/recuperar" element={<GuestRoute><Recuperar/></GuestRoute>} />
        <Route path="/restablecer" element={<GuestRoute><Restablecer/></GuestRoute>} />

        {/* definir estas rutas mas tarde */}
        <Route
          path="/formulario-pago"
          element={<FormularioPago moneda={moneda} tipoCambio={tipoCambio} />}
        />
        <Route
          path="/pago-exitoso"
          element={<PagoExitoso moneda={moneda} tipoCambio={tipoCambio} />}
        />
        {/* rutas protegidas */}
        <Route path="/catalogo"
          element={
            <ProtectedRoute roles={[51]}>
              <Catalogo moneda={moneda} tipoCambio={tipoCambio} />
            </ProtectedRoute>
          }
        />
        <Route path="/miCuenta"
          element={<ProtectedRoute roles={[51]}><MiCuenta/></ProtectedRoute>}
        />
        <Route path="/vendedor"
          element={<ProtectedRoute roles={[21]}><Vendedor/></ProtectedRoute>}
        />
        <Route path="/bodega"
          element={<ProtectedRoute roles={[31]}><Bodega/></ProtectedRoute>}
        />
        <Route path="/productos" 
          element={<ProtectedRoute allowedRoles={[31]}><Productos /></ProtectedRoute>}
        />
        <Route path="/admin"
          element={<ProtectedRoute roles={[11]}><Administrador/></ProtectedRoute>}
        />
        <Route path="/contador"
          element={<ProtectedRoute roles={[41]}><Contador/></ProtectedRoute>}
        />


        {/* 404 */}
        <Route path="/error" element={<Error/>} />
        <Route path="*"       element={<Navigate to="/error" replace />} />
      </Routes>
    </Router>
  );
}

export default App;