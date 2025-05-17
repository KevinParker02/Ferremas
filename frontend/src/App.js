import React from 'react';
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
  return (
    <Router>
      <Routes>
        {/* rutas de invitado */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login"    element={<GuestRoute><Login/></GuestRoute>} />
        <Route path="/registro" element={<GuestRoute><Registro/></GuestRoute>} />
        <Route path="/recuperar" element={<GuestRoute><Recuperar/></GuestRoute>} />
        <Route path="/restablecer" element={<GuestRoute><Restablecer/></GuestRoute>} />

        {/* definir estas rutas mas tarde */}
        <Route path="/formulario-pago" element={<FormularioPago />}/>
        <Route path="/pago-exitoso" element={<PagoExitoso />} />
        {/* rutas protegidas */}
        <Route path="/catalogo"
          element={<ProtectedRoute roles={[51]}><Catalogo/></ProtectedRoute>}
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